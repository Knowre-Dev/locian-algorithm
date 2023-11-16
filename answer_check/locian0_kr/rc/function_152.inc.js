import _ from 'lodash';

export function evaluateEx_new(tree) {
    
    if (validMathTree(tree) === false) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let newTree
    switch (tree_1[0]) {
        // 160828 larwein - inequality patch
        case 'inequality':
            // 20180817 epark - Leave alone inequalities with infinity sign'
            if (JSON.stringify(tree_1[1]) === JSON.stringify(['infinity']) || 
                JSON.stringify(tree_1[5]) === JSON.stringify(['infinity']) || 
                JSON.stringify(tree_1[1]) === JSON.stringify(['negative', ['infinity']]) || 
                JSON.stringify(tree_1[5]) === JSON.stringify(['negative', ['infinity']])) {
                return tree_1;
            }
            newTree = ['inequality'];
            let newOperands = [];
            if (tree_1[2] === 'gt' || tree_1[2] === 'ge') {
                var tree_2 = tree_1.slice(1);
                for (let [k, subtree] of tree_2.entries()) {
                    if (k === tree_1.length - 2) {
                        newOperands.push(['natural', '0']);
                    } else if (k % 2 === 1) {
                        newOperands.push(subtree);
                    } else {
                        newOperands.push(evaluateEx_new(
                            ['addchain', ['add', subtree], ['sub', tree_1[tree_1.length - 1]]]
                        ));
                    }
                }
            } else {
                var tree_2 = tree_1.slice(1).reverse();
                for (let [k, subtree] of tree_2.entries()) {
                    if (k === tree_1.length - 2) {
                        newOperands.push(['natural', '0']);
                    } else if (k % 2 === 1) {
                        newTree.push(subtree === 'lt' ? 'gt' : 'ge');
                    } else {
                        newTree.push(evaluateEx_new(
                            ['addchain', ['add', subtree], ['sub', tree[1]]]
                        ));
                    }
                }
            }
            newTree = newTree.concat(newOperands);
            break;
        
        case 'equation':
        case 'neq':
        case 'ratio':
        //case 'inequality':
        case 'orchain':
        default:
            newTree = ['eval'];
            let seedArr = [-2, -1, 1, 2, 3];
            for (let seed of seedArr) {
                let evalresult = evaluateExWithSeed(tree_1, seed);
                
                // If the value is too large for numerical evaluation
                // so that any of the five substitutions produce INF or NAN,
                // then just return the original tree
                //*//
                if (Array.isArray(evalresult)) {
                    if ( ['equation', 'inequality', 'neq', 'ratio', 'orchain'].includes(evalresult[0])) {
                        let evalresult_1 = evalresult.slice(1);
                        for (let evalside of evalresult_1) {
                            if (!isFinite(evalside[0]) || isNaN(evalside[0]) || 
                                !isFinite(evalside[1]) || isNaN(evalside[1]))
                                return tree_1;
                        }
                    } else if (!isFinite(evalresult[0]) || isNaN(evalresult[0]) ||
                            !isFinite(evalresult[1]) || isNaN(evalresult[1])) {
                        return tree_1;
                    }
                }
                //*/
                newTree.push(evalresult);
        }
    }
    
    return newTree;
    
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x^{2a}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateEx_new(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
/*
A quick helper function for naming variables for lookup table
*/

export function getVarName(variable) {
    let variable_1 = _.cloneDeep(variable);
    let varname = variable_1.slice(1);
    varname = varname.length > 1 ? ('(' + varname.join() + ')') : varname[0].toString();
    return varname;

}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\sin{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateEx_new(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
/*
Routine mostly copied from checkmath.php

Edit 20180817 epark:
This routine now constructs a lookup table
to use when substituting a complex number for each variable
That way, we are guaranteed to have every variable with the same value
no matter where in the tree traversal does the substitution occur
*/
export function evaluateExWithSeed(tree, seed = 1, lookupTable = new Object()) {
    
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let lookupTable_1 = _.cloneDeep(lookupTable);
    let operator = tree_1[0];
    let operandTree = tree_1.slice(1);
    // Construct a lookup table for variables
    // Added by epark on 20180817
    let varList = findVars(tree_1, true);
    // Note epark 20180831:
    // The above function findVars() only finds variables, not subscripts
    // This is because evaluateOperation() already has a way to deal with
    // subscripts in a way that we desire
    // (i.e., same let name with different subscript treated as different)
    let varNames = [];
    for (let variable of varList) {
        // Use a helper function to set variable name string for lookup table
        // (will also be used at evaluateVariable() to find the correct entry)
        let varname = getVarName(variable);
        let is_included = false;
        for (let v of varNames) {
            if (JSON.stringify(v) === JSON.stringify(varname)) {
                is_included = true;
            }
        }
        if (!is_included) {
            varNames.push(varname);
        }
    }
    
    // Sort the variable names
    // This ensures that the same variable is assigned with the same value
    // Regardless of when it was added to the varNames array
    varNames.sort();
    /*//
    // debug (use these lines whenever you need to examine varNames)
    newTree = [];
    foreach (varNames as varname) {
        newTree[] = ['add', varname];
    }
    return array2ChainTree(newTree);
    // end debug
    //*/
    //let maxVal = Math.pow(2, 63) - 1;
    let maxVal =  Number.MAX_SAFE_INTEGER;
    let rangeWidth = 10;
    let bound = rangeWidth / 2;
    
    if (Object.keys(lookupTable_1).length === 0) {
        
        for (let varname of varNames) {
            let newZ = [];
            switch (varname) {
                // Add below any other cases of special mathematical constants as needed
                case 'i': // imaginary unit
                    newZ = [0, 1];
                break;
                case 'e': // base of natural system of logarithms
                    newZ = [Math.exp(1), 0];
                    break;
                case 'pi': // pi (circumference / diameter)
                    newZ = [Math.PI, 0];
                    break;
                default:
                    
                    // Use rand() only when the symbol is not any of the
                    // special mathematical constants specified above
                    // so as to not affect the random number generator state
                    // 
                    /*//
                    // EDIT epark 20180830: Don't use lcg_value().. srand() wouldn't work as you'd expect
                    randRe = lcg_value();
                    randIm = lcg_value();
                    /*/

                    /*
                    let randRe = Math.floor((Math.random() * Number.MAX_SAFE_INTEGER));
                    let randIm = Math.floor((Math.random() * Number.MAX_SAFE_INTEGER));
                    */
                    let randRe = Math.floor((Math.cos(seed) * Number.MAX_SAFE_INTEGER));
                    let randIm = Math.floor((Math.sin(seed) * Number.MAX_SAFE_INTEGER));
                    // Scale the random numbers appropriately (incl. make them into float values)
                    randRe /= maxVal;
                    randIm /= maxVal;
                    //*/
                    // EDIT 2018.08.23:
                    // Ensure that x in one tree is assigned a different value than y in another tree
                    // Even when each variable is the only variable present in their respective trees
                    // RATIONALE: Without this, 3x+3y-3x and 3x+3y-3y will evaluate to same
                    // after all the prior transformations inside the new Equivalent preset,
                    // which must include mulZero to prevent PHP error
                    // caused at lines 1808,1809,1811,1812
                    let asciiBound = utf8_ord('a') + 13; // Middle of 'a' - 'z'
                    randRe += (utf8_ord(varname) - asciiBound);
                    randIm += (utf8_ord(varname) - asciiBound);
                    
                    randRe = randRe * rangeWidth - bound;
                    randIm = randIm * rangeWidth - bound;
                    
                    // Round to 4 decimal places just for efficiency's sake
                    // (otherwise running the new Equivalent preset slows down too much)
                    randRe = parseFloat(randRe.toFixed(4));
                    randIm = parseFloat(randIm.toFixed(4));
                    
                    // Initialize the new complex value
                    newZ[0] = randRe;
                    newZ[1] = randIm;
                    break;
            }
            lookupTable_1[varname] = newZ;
            
        }
    }
    
    if (operator === 'summation') {
        return evaluateOperation(operator, operandTree, seed, lookupTable_1);
    }
    
    let operand = [];
    
    
    for (let subtree of operandTree) {
        
        operand.push(evaluateExWithSeed(subtree, seed, lookupTable_1));
    }

    
    // By the recursion above, we are guaranteed that
    // ALL subexpressions have been evaluated into numerical values
    switch(operator) {
        case 'variable':
            //case 'subscript': // commented out; evaluateOperation() already handles this well
            return evaluateVariable([operator].concat(operand), lookupTable_1);
            
            // Note: The function above has been edited to take in the whole tree as 1st arg
            //          rather than just the operand without operator at front
        case 'overline':
        case 'overleftarrow':
        case 'overrightarrow':
        case 'overleftrightarrow':
        case 'widearc':
        case 'arc':
        case 'mangle':
        case 'angle':
        case 'sin':
        case 'cos':
        case 'tan':
            return operand[0];
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain':
            let result = [operator];
            for (let v of operand) {
                result.push(v);
            }
            return result;
        default:
            return evaluateOperation(operator, operand, seed, lookupTable_1);
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '21(\\frac{2^{\\frac{1}{2})}{2})^{n-1}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateExWithSeed(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
/*
Routine mostly copied from checkmath.php

Values are represented in complex number format
(array of two numbers [real, imaginary])
*/
export function evaluateOperation(operator, operand, seed = null, lookupTable = new Object()) {
    let operand_1 = _.cloneDeep(operand);
    let lookupTable_1 = _.cloneDeep(lookupTable);
    
    switch(operator) {
        case 'natural':
        case 'decimal':
            return [parseFloat(operand_1[0]), 0];
        case 'positive':
        case 'add':
        case 'mul':
            return operand_1[0];
        case 'pm':
        case 'addsub':
            return [0.8 * operand_1[0][0], 1.2 * operand_1[0][1]];
        case 'negative':
        case 'sub':
            // ...what case would below be??
            if (Array.isArray(operand_1[0][0]) || Array.isArray(operand_1[0][1])) {
                    return [0, 0];
            }
            
            return [-operand_1[0][0], -operand_1[0][1]];
        case 'addchain':
            let sum = [0, 0];
            for (let term of operand_1) {
                if (Array.isArray(term)) {
                    sum[0] += (!isNaN(term[0]) ? term[0] : 0);
                    sum[1] += (!isNaN(term[1]) ? term[1] : 0);
                }
            }
            return sum;
        case 'div':
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            var modulusSq = Math.pow(operand_1[0][0], 2) + Math.pow(operand_1[0][1], 2);
            return [operand_1[0][0] / modulusSq, -operand_1[0][1] / modulusSq];
        case 'mulchain':
            let prod = [1, 0];
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            
            for (let factor of operand_1) {
                let temp = _.cloneDeep(prod);
                prod[0] = temp[0] * factor[0] - temp[1] * factor[1];
                prod[1] = temp[0] * factor[1] + temp[1] * factor[0];
            }
            return prod;
        case 'fraction':
            if (isNaN(operand_1[0][0]) ||
                isNaN(operand_1[0][1]) ||
                isNaN(operand_1[1][0]) ||
                isNaN(operand_1[1][1])) {
                return [1, 1];
            }
            let numerRe = operand_1[0][0];
            let numerIm = operand_1[0][1];
            let denomRe = operand_1[1][0];
            let denomIm = operand_1[1][1];
            let modulusSqDenom = denomRe * denomRe + denomIm * denomIm;
            return [
                (numerRe * denomRe + numerIm * denomIm) / modulusSqDenom,
                (numerIm * denomRe - numerRe * denomIm) / modulusSqDenom
            ];
        case 'mfraction': // only real entries assumed
            return [operand_1[0][0] + operand_1[1][0] / operand_1[2][0], 0];
        case 'power':
            return powComplex_inLocian(operand_1[0], operand_1[1]);    
        case 'squareroot':
            return powComplex_inLocian(operand_1[0], [0.5, 0]);
        case 'nthroot':
            // For a complex number z, we have 1/z = z*/|z|^2,
            // where z* is the complex conjugate of z
            // So z1th root of z2 (i.e., z2^(1/z1)) would be
            // z2^(z1*/|z1|^2)
            var modulusSq = Math.pow(operand_1[0][0], 2) + Math.pow(operand_1[0][1], 2);
            return powComplex_inLocian(
                operand_1[1],
                [operand_1[0][0] / modulusSq, -operand_1[0][1] / modulusSq]
            );
        
        case 'absolute':
            var modulus = Math.sqrt(
                Math.pow(operand_1[0][0], 2) + Math.pow(operand_1[0][1], 2)
            );
            return [modulus, 0];
        case 'rdecimal':
            
            let intg = parseFloat(operand_1[0]);
            let num;
            if (operand_1[1] === '') {
                let num = parseFloat(operand_1[1] + operand_1[2]);
            } else {
                let num = parseFloat(operand_1[1] + (parseFloat(operand_1[2]) - parseFloat(operand_1[1])).toString());
            }
            let denum = '';
            for(let i = 0; i < operand_1[2].length; i++) {
                denum += '9';
            }
            for(let i = 0; i < operand_1[1].length; i++) {
                denum += '0';
            }
            denum = parseFloat(denum);
            
            return [intg + (num / denum), 0];
        case 'subscript':
            return [
                operand_1[0][0] + 2 * operand_1[1][1],
                operand_1[0][1] + 2 * operand_1[1][0]
            ];
        case 'ln':
            
            var modulus = Math.sqrt(
                Math.pow(operand_1[0][0], 2) + Math.pow(operand_1[0][1], 2));
          
            /*//
            // the current implementation does not consider the complex natural log
            // but simply takes the modulus and use that instead
            return array(log(modulus), 0);
            /*/
            // theta is the argument (angle) from the positive x-axis
            let theta = Math.atan2(operand_1[0][1], operand_1[0][0]);
            return [Math.log(modulus), theta];
            // Note: The return value above implies that
            //          the returned value is really the principal value Log z of the input z=x+iy
            //*/
        
        case 'log':
            
            let newOperand = [];
            newOperand.push(evaluateOperation('ln', [operand_1[0]], seed, lookupTable_1));
            if (typeof operand_1[1] !== 'undefined') {
                newOperand.push(evaluateOperation('ln', [operand_1[1]], seed, lookupTable_1));
            } else {
                newOperand.push(evaluateOperation('ln', [[10, 0]], seed, lookupTable_1));
            }
            return evaluateOperation('fraction', newOperand, seed, lookupTable_1);
        
        case 'summation':
            if (operand_1[0][0] === 'equation'
                && operand_1[0][1][0] === 'variable'
                && operand_1[0][2][0] === 'natural'
                && operand_1[1][0] === 'natural') {
                let sum = [0, 0];
                let vari = operand_1[0][1];
                let min = operand_1[0][2][1];
                let max = operand_1[1][1];
                for (let ind = min; ind <= max; ind++) {
                    let newEx = replace(operand_1[2], vari, ['natural', ind.toString()]);
                    newEx = evaluateExWithSeed(newEx, seed, lookupTable_1);
                    sum = evaluateOperation(
                        'addchain',
                        [sum, newEx],
                        seed,
                        lookupTable_1
                    );
                }
                return sum;
            } else {
                return null;
            }
        
        default:
        return null;
    }
    
}



/*
Replace a subtree from in a MathTree tree with another subtree to
Mostly copied from checkmath.php
*/
export function replace(tree, from, to) {
    
    if (JSON.stringify(tree) === JSON.stringify(from)) {
        return to;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1[0];
    let operand = tree_1.slice(1);
    
    let newOperand = [];
    for (let v of operand) {
        if (Array.isArray(v)) {
            newOperand.push(replace(v, from, to));
        } else {
            newOperand.push(v);
        }
    }
    
    return [operator].concat(newOperand);
}



/*
Refactored this routine to use instead 
a lookup table constructed at evaluateExWithSeed(),
which is passed as an argument
*/
export function evaluateVariable(variable, lookupTable = new Object()) {

    
    
    //let variable_1 = _.cloneDeep(variable);
    let lookupTable_1 = _.cloneDeep(lookupTable);
    
    let varname = getVarName(variable);
   
    let keys = Object.keys(lookupTable_1);
    let is_included = false;
    for (let v of keys) {
        if (JSON.stringify(v) === JSON.stringify(varname)) {
            is_included = true;
            break;
        }
    }
    if (is_included) {
        
        return lookupTable_1[varname];
    }
    return null;
}


/*
Copied mostly from checkmath.php,
with comments added by epark
*/
export function powComplex_inLocian(A, B) {  
   
   
    if (A[0] === 0 && A[1] === 0) {
        if (B[0] === 0 && B[1] === 0) {
            return [1, 0];
        }
        return [0, 0];
    }
    //let A_1 = _.cloneDeep(A);
    //let B_1 = _.cloneDeep(B);
    // r is the modulus of the base
    let r = Math.sqrt(Math.pow(A[0], 2) + Math.pow(A[1], 2));
    if (r < 1) {
        
        // If r is less than 1, underflow may occur due to denormalization of float
        // If anyone's got a better remedy, please go ahead and do so...
        let r2 = Math.pow(r, 2);
        let newA = [A[0] / r2, -A[1] / r2];
        let newB = [-B[0], -B[1]];
       
        return powComplex_inLocian(newA, newB);
    }
    
    // theta is the argument (angle) from the positive x-axis
    let theta;
    if (A[1] === 0 && A[0] > 0) {
        theta = 0;
    } else if (A[1] === 0 && A[0] < 0) {
        theta = Math.PI;
    } else if (A[1] > 0) {
        theta = Math.acos(A[0] / r);
    } else {
        theta = 2 * Math.PI - Math.acos(A[0] / r);
    }
    
    let c = B[0];
    let d = B[1];

    let newR = Math.pow(r, c) / Math.exp(d * theta);
    
    let newTheta = (d * Math.log(r) + c * theta) % (2 * Math.PI);
    
    let result = [
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
    ];
    

    
    return result;
}
/*
let A = [ [0.7071067811865476, 0], [35293845, 22661916] ];
let result = powComplex_inLocian(A[0], A[1]);
console.log(result);
*/
/*
Combines fractions w/ two powers with same exponent into one power obj
so as to prevent floating point value overflow
Intended only for use in evaluateEx_new
*/
export function fracOfPow2PowOfFrac(tree) {
    
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    if (tree_1[0] === 'fraction' &&
        tree_1[1][0] === 'power' && 
        tree_1[2][0] === 'power' && 
        // Currently exponents must also be the same; modify if needed
        JSON.stringify(tree_1[1][2]) === JSON.stringify(tree_1[2][2])) {
        tree_1 = ['power', ['fraction', tree_1[1][1], tree_1[2][1]], tree_1[1][2]];
        return tree_1;
    }
    for (let [k, subtree] of tree_1.entries()) {
        if (k === 0) {
            continue;
        }
        tree_1[k] = fracOfPow2PowOfFrac(subtree);
    }
    return tree_1;
}





/* 135. UtilityFunctions */

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Contents:
array2ChainTree
chainTree2Array
combine2ChainTree
evalNumericValues
  - evalNumericValues_addchain
  - evalNumericValues_mulchain
  - evalNumericValues_power
findDenominators
findGCF
findVars
isNumeric
multFactor
termExists
validMathTree
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Converts an array of two or more arithmetic terms into an addchain or mulchain
If there is only one term in the array, just return that term (without subtype)

Parameter:
arr: An array of arithmetic terms
(each element must have 'add', 'sub', 'addsub', 'subadd', 'mul', 'div' as its 0th element)
evalNumeric: An optional boolean -
                      if TRUE, evaluate all numerical terms into a single term before returning

Returns:
An addchain or mulchain

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function array2ChainTree(arr, evalNumeric = false) {
    
    // For any invalid input, just return the input back
    if (!Array.isArray(arr) || arr.length === 0 || arr[0].length < 1) {
        return arr;
    }
    let arr_1 = _.cloneDeep(arr);
    let operator;
    if (['add', 'sub', 'addsub', 'subadd'].includes(arr_1[0][0])) {
        operator = 'addchain';
    } else if (['mul', 'div'].includes(arr_1[0][0])) {
        operator = 'mulchain';
    } else {
        // Can only handle addchain or mulchain; return the input array otherwise
        return arr_1;
    }
    
    // Optional: Evaluate all numerical terms into a single term
    if (evalNumeric) {
        let numericArr = [];
        let nonnumericArr = [];
        for (let term of arr_1) {
            let subtree = term[1];
            if (isNumeric(subtree, false, false)) {
                numericArr.push([term[0], subtree]);
            } else {
                nonnumericArr.push([term[0], subtree]);
            }
        }
        //console.log(JSON.stringify(numericArr, null, 4))
        let numRes = array2ChainTree(numericArr);
        arr_1 = nonnumericArr;
        if (numRes.length > 0) {
            
            numRes = evalNumericValues(numRes);
            
            if (operator === 'addchain') {
                if (arr_1.length === 0 || JSON.stringify(numRes) !== JSON.stringify(['natural', '0'])) {
                    if (numRes[0] === 'negative') {
                        arr_1.unshift(['sub', numRes[1]]);
                    } else {
                        arr_1.unshift(['add', numRes]);
                    }
                }
            } else {
                arr_1.unshift(['mul', numRes]);
            }
        }
    }
    
    // If there is only one operand, just return that operand
    if (arr_1.length === 1) {
        if (['addsub', 'subadd'].includes(arr_1[0][0])) {
            return ['pm', arr_1[0][1]];
        }
        if (arr_1[0][0] === 'sub') {
            return ['negative', arr_1[0][1]];
        }
        if (arr_1[0][0] === 'div') {
            return ['fraction', ['natural', '1'], arr_1[0][1]];
        }
        return arr_1[0][1];
    }
    
    // Construct the tree
    let tree = [operator].concat(arr_1);
    return tree;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '3^2';
let tree_1 = LatexToTree(latex_1);
tree_1 = [['mul', tree_1]];
let tree_11 = array2ChainTree(tree_1, true);
console.log(JSON.stringify(tree_11, null, 4))
*/


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Converts a MathTree into array of term(s) of given subtype
(add, sub, mul, div, etc. - defaults to mul)
If the tree is either addchain or mulchain and its terms agree in type with the 2nd input,
then ignores the 2nd input and just returns the array of terms in the tree (with subtype)

This function, roughly speaking, is the inverse of array2ChainTree.

Parameters:
tree: A MathTree
subtype: A string (e.g., 'add', 'sub', 'addsub', 'subadd', 'mul', 'div') - defaults to 'mul'

Returns:
An array of array(s)

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function chainTree2Array(tree, subtype = 'mul') {
    
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    // Make sure to return array of array(s) as the final output
    if (tree_1[0] === 'addchain') {
        if (['add', 'sub', 'addsub', 'subadd'].includes(subtype)) {
            return tree_1.slice(1);
        }
    } else if (tree_1[0] === 'mulchain') {
        if (['mul', 'div'].includes(subtype)) {
            return tree_1.slice(1);
        }
    }
    return [[subtype, tree_1]];
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Combines two trees into one tree of type either addchain or mulchain

Parameters:
tree1: The first tree
tree2: The second tree
subtype: String for subtype of the terms in the output tree
      This arg, if not provided, is set to agree with tree1
      (or tree2 if tree1 is neither an addchain nor a mulchain)
      If neither tree is either an addchain or a mulchain,
      then subtype defaults to 'mul'.
      However, it is recommended to always provide this arg
      so that the function works as intended

Returns:
A new tree of type either addchain or mulchain

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function combine2ChainTree(tree1, tree2, subtype = null) {
    
    if (!Array.isArray(tree1) || tree1.length < 1 || 
        !Array.isArray(tree2) || tree2.length < 1) {
        return false;
    }
    //let tree1_1 = _.cloneDeep(tree1);
    //let tree2_1 = _.cloneDeep(tree2);
    // Set subtype if not provided (see the note above)
    if (subtype === null) {
        if (['addchain', 'mulchain'].includes(tree1[0])) {
            subtype = tree1[0] === 'addchain' ? 'add' : 'mul';
        } else {
            subtype = tree2[0] === 'addchain' ? 'add' : 'mul';
        }
    }
    
    let t1Arr = chainTree2Array(tree1, subtype);
    let t2Arr = chainTree2Array(tree2, subtype);
    
    let tArr = t1Arr.concat(t2Arr);
    return array2ChainTree(tArr);
}




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Evaluates the given tree of purely numerical terms
Note: NOT term-by-term recursive

Precondition:
1. tree must contain SIMPLE (i.e., not compound) numerical terms 
    with no plusminus (not even addsub/subadd)

Parameters:
tree: A MathTree (assumed to contain only numerical terms)

Returns:
A new MathTree (either natural or fraction with natural subtrees)

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
import {fracComplex} from '../rc/function_69.inc.js';

export function evalNumericValues(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    
    let operator = tree_1.shift();
    let operand = tree_1;
    switch (operator) {
        case 'natural':
            tree_1 = [operator, operand[0]];
            return tree_1;
        case 'decimal':
            tree_1 = [operator, operand[0]];
            return evalNumericValues(fracDecimal(tree_1));
        case 'rdecimal':
            tree_1 = [operator, operand[0]];
            return evalNumericValues(rdecToFrac(tree_1));
        case 'negative':
            let subtree = evalNumericValues(operand[0]);
            if (subtree[0] === 'negative') {
                return subtree[1];
            }
            tree_1 = [operator, subtree];
            return tree_1;
        case 'absolute':
            tree_1 = evalNumericValues(operand[0]);
            if (tree_1[0] === 'negative') {
                tree_1 = tree_1[1];
            }
            return tree_1;
        case 'fraction':
            tree_1 = [operator].concat(operand);
            tree_1 = fracComplex(tree_1);
            tree_1 = fracNegative(tree_1);
            tree_1 = fracSimpInt(tree_1);
            return tree_1;
        case 'addchain':
            tree_1 = evalNumericValues_addChain(operand);
            return tree_1;
        case 'mulchain':
            tree_1 = evalNumericValues_mulChain(operand);
            return tree_1;
        case 'power':
            tree_1 = evalNumericValues_power(operand);
            return tree_1;
        default:
            tree_1 = [operator].concat(operand);
            break;
    }
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '1.5*3.5';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evalNumericValues(tree_1);
let result1 = JSON.stringify(tree_11, null, 4);
console.log(result1);
*/
/*
Helper function for evalNumericValues(tree) for addchain tree
Author: epark
*/
import {EuclidAlg} from '../rc/function_76.inc.js';


export function evalNumericValues_addChain(operand) {
    let operand_1 = _.cloneDeep(operand);
    //let operator = 'addchain';
    let operand_11 = [];
    let operand_12 = [];
    for (let term of operand_1) {
        if (term[0] === 'add' || term[0] === 'sub') {
            operand_11.push(term);
        } else {
            operand_12.push(['addsub', term[1]]);
        }
    }
    if (JSON.stringify(operand_11) === JSON.stringify([])) {
        return ['addchain'].concat(operand_12);
    }
    let numer = 0;
    let denom = 1;
    
    for (let term of operand_11) {
        
        let op = term[0];
        let subtree = term[1];
        
        // Account for any negative and/or subtraction
        let sign = 1;
        if (subtree[0] === 'negative') {
            sign = -1 * sign;
            subtree = subtree[1];
        }
        if (op === 'sub') {
            sign = -1 * sign;
        }
        
        let nVal;
        let dVal;
        if (subtree[0] === 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        } else {
            nVal = parseInt(subtree[1]);
            dVal = 1;
        }
        // Update denom to the LCD of all terms considered so far
        let updateFactor = dVal / EuclidAlg(denom, dVal);
        denom *= updateFactor;
        // Update numer also to reflect the new LCD, and then add the current term
        numer *= updateFactor;
        numer += sign * nVal * (denom / dVal);
        
    }
    
    // Construct the output tree as a fraction, and then simplify before returning
    let tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    tree = fracSimpInt(tree);
    if (numer > 0) {
        operand_11 = [['add', tree]];
    } else {
        operand_11 = [['sub', tree]];
    }
    tree = ['addchain'].concat(operand_11).concat(operand_12);
    return tree;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '1\\pm 2+3';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evalNumericValues_addChain(tree_1.slice(1));
let result1 = JSON.stringify(tree_11, null, 4);
console.log(result1);
*/


/*
Helper function for evalNumericValues(tree) for mulchain tree
Author: epark
*/
export function evalNumericValues_mulChain(operand) {
    let operand_1 = _.cloneDeep(operand);
    //let operator = 'mulchain';
    
    let numer = 1;
    let denom = 1;
    for (let term of operand_1) {
        // Return early if numer === 0 (for efficiency's sake)
        if (numer === 0) {
            return ['natural', '0'];
        }
        
        let op = term[0];
        let subtree = term[1];
        
        // Account for any negative
        let sign = 1;
        if (subtree[0] === 'negative') {
            sign = -1;
            subtree = subtree[1];
        }
        let nVal;
        let dVal;
        if (subtree[0] === 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        } else {
            nVal = parseInt(subtree[1]);
            dVal = 1;
        }
        // Update the current numerator and denominator
        if (op === 'div') {
            let temp = nVal;
            nVal = dVal;
            dVal = temp;
        }
        
        
        numer *= (sign * nVal);
        denom *= dVal;
        
    }
    // Construct the output tree as a fraction, and then simplify before returning
    let tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    if (numer < 0) {
        tree = ['negative', tree];
    }
    tree = fracSimpInt(tree);
    return tree;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evalNumericValues_power(tree_1.slice(1));
let result1 = JSON.stringify(tree_11, null, 4);
console.log(result1);
*/

/*
Helper function for evalNumericValues(tree) for power tree
Author: epark
*/
export function evalNumericValues_power(operand) {
    let operand_1 = _.cloneDeep(operand);
    //let operator = 'power';
    // By precondition, the input is simple numeric,
    // which means the base is guaranteed to be natural, or a negative thereof
    let basetree = operand_1[0];
    let sign = 1;
    if (basetree[0] === 'negative') {
        sign = -1;
        basetree = basetree[1];
    }
    
    let expFrac = [operand_1[1], ['natural', '1']];
    if (operand_1[1][0] === 'fraction') {
        expFrac = operand_1[1].slice(1);
    }
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate
    let reciprocFlag = false;
    for (let [k, obj] of expFrac.entries()) {
        if (obj[0] === 'negative') {
            reciprocFlag = !reciprocFlag;
            expFrac[k] = obj[1];
        }
    }
    
    // Evaluation
    let mtermArr = []; // construct as a mulchain, and then simplify later
    
    // work with absolute value of base for now, will see why later
    let bVal = parseInt(basetree[1]);
    
    let xNval = parseInt(expFrac[0][1]);
    let xDval = parseInt(expFrac[1][1]);
    
    // Watch out for any imaginary number case
    let imaginaryFlag = (sign === -1) && (xNval % 2 === 1) && (xDval % 2 === 0);
    
    // Factor out any integer result possible
    let xVal = Math.floor(xNval / xDval);
   
    if (Math.log(Number.MAX_SAFE_INTEGER) / Math.log(bVal) < xVal) {
        return ['power'].concat(operand_1);
    }
    let intRes = Math.pow(bVal, xVal);
    let rtRes = Math.pow(bVal, (xNval % xDval) / xDval);
    // Here, pow() quietly returns FALSE for inputs like pow(-1, 1 / 2)
    // that was why we work with the absolute value
    // and deal with the sign last
    // so that we can put imaginary unit i properly
    
    // Add the mul terms to mtermArr
    if (rtRes === Math.floor(rtRes)) {
        intRes *= rtRes;
        mtermArr.push(['mul', ['natural', intRes.toString()]]);
    } else {
        if (intRes !== 1) {
            mtermArr.push(['mul', ['natural', intRes.toString()]]);
        }
        let subtree = [
            'power',
            ['natural', bVal.toString()],
            ['fraction', ['natural', (xNval % xDval).toString()], ['natural', xDval.toString()]]
        ];
        mtermArr.push(['mul', subtree]);
    }
    
    // Deal with imaginary number case and negative result case here
    let resSign;
    if (imaginaryFlag) {
        mtermArr.push(['mul', ['variable', 'i']]);
        let intSign = Math.floor(xNval / xDval) % 2 === 0 ? 1 : sign;
        let rtSign = (xNval % xDval) % 2 === 0 ? 1 : sign;
        resSign = intSign * rtSign;
    } else {
        resSign = xNval % 2 === 0 ? 1 : sign;
    }
    let tree = array2ChainTree(mtermArr);
    if (reciprocFlag) {
        tree = ['fraction', ['natural', '1'], tree];
    }
    if (resSign < 0) {
        tree = ['negative', tree];
    }
    
    //tree = mulIdentity(tree);
    return tree;
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns an array of denominators of all fractions present in the given tree

Parameters:
tree: A Laco tree
unique: An option to have each element in the output array unique
              By default, duplicates are allowed (i.e., unique = false)
positive: An option to output absolute values of any negative denominators
              By default set to FALSE (i.e., simply gives any denominator as is)

Returns:
An array of Laco data object (e.g., ['natural', '5'], ['variable', 'q'])

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function findDenominators(tree, unique = false, positive = false) {
    
    let denomArr = [];
    if (Array.isArray(tree)) {
        let tree_1 = _.cloneDeep(tree);
        let operator = tree_1.shift();
        switch (operator) {
            case 'fraction':
                let denom = tree_1[1];
                if (positive && denom[0] === 'negative') {
                    denom = denom[1];
                }
                denomArr.push(denom);
                break;  
            default:
                for (let subtree of tree_1) {
                    let subDenArr = findDenominators(subtree, unique);
                    for (let dtree of subDenArr) {
                        let is_included = false;
                        for (let v of denomArr) {
                            if (JSON.stringify(v) === JSON.stringify(dtree)) {
                                is_included = true;
                                break;
                            }
                        }
                        if (!unique || !is_included) {
                            denomArr.push(dtree);
                        }
                    }
                }
        }
    }
    return denomArr;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{a}{c}+\\frac{b}{c}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findDenominators(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns array of factors for the greatest common factor
of all sides of equalities/inequalities
The greatest constant common factors are indexed with 'const'
Array of all variable common factors are indexed with 'sym'

Parameters:
tree: A Laco tree

Returns:
An associative array of:
1) one integer common factor, indexed by 'const'
2) and an array of variables common to all sides, indexed by 'sym'

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

import {fracDecimal} from '../rc/function_49.inc.js';
//import {EuclidAlg} from '../rc/function_76.inc.js';
import {rdecToFrac} from '../rc/function_78.inc.js';

export function findGCF(tree = null) {
    
    let commonFactorArr = {
        'const': ['natural', '1'],
        'sym': []
    };
    if (Array.isArray(tree)) {
        let tree_1 = _.cloneDeep(tree);
        let operator = tree_1.shift();
        switch (operator) {
            case 'negative':
                // common factor assumed to be positive
                return findGCF(tree_1[0]);
            case 'fraction':
                // only consider the numerator
                return findGCF(tree_1[0]);
            case 'decimal':
                // only consider the numerator
                return findGCF(fracDecimal([operator].concat(tree_1)));
            case 'rdecimal':
                // only consider the numerator
                return findGCF(rdecToFrac([operator].concat(tree_1)));
            case 'natural':
                commonFactorArr['const'] = [operator].concat(tree_1);
                break;
            case 'variable':
                commonFactorArr['sym'].push([operator].concat(tree_1));
                break;
            case 'mulchain':
                let constF = 1;
                let symFArr = [];
                for (let multerm of tree_1) {
                    // only consider multiplications (divisions would end up in denominators)
                    if (multerm[0] === 'mul') {
                        let subtree = multerm[1];
                        let subCFArr = findGCF(subtree);
                        
                        if (JSON.stringify(subCFArr['const']) !== JSON.stringify([])) {
                            constF *= parseInt(subCFArr['const'][1]);
                        }

                        for (let symb of subCFArr['sym']) {
                            let is_included = false;
                            for (let v of symFArr) {
                                if (JSON.stringify(v) === JSON.stringify(symb)) {
                                    is_included = true;
                                }
                            }
                            if (!is_included) {
                                symFArr.push(symb);
                            }
                        }
                    }
                }
                
                commonFactorArr['const'] = ['natural', constF.toString()];
                commonFactorArr['sym'] = symFArr;
                break;
            case 'addchain':
            case 'equation':
            case 'inequality':
                for (let [k, term] of tree_1.entries()) {
                    // this is the case for inequality signs (e.g., 'le', 'ge')
                    if (!Array.isArray(term)) {
                        continue;
                    }
                    let subtree = operator === 'addchain' ? term[1] : term;
                    let subCFArr = findGCF(subtree);
                    if (k === 0) {
                        // If this is the first term, just copy to commonFactorArr
                        commonFactorArr = subCFArr;
                    } else {
                        // For numerical constants, update the array with GCF
                        
                        let gcf = EuclidAlg(
                            parseInt(commonFactorArr['const'][1]),
                            parseInt(subCFArr['const'][1])
                        );
                        
                        commonFactorArr['const'] = ['natural', gcf.toString()];
                        // For variables,
                        // only count the vars already in commonFactorArr['sym']
                        let symFArr = [];
                        
                        for (let symb of subCFArr['sym']) {
                            for (let symb_1 of commonFactorArr['sym']) {
                                if (JSON.stringify(symb) === JSON.stringify(symb_1)) {
                                    symFArr.push(symb);
                                }
                            }
                        }
                        commonFactorArr['sym'] = symFArr;
                    }
                }
                break;
            default:
                break;
        }
    }
    return commonFactorArr;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'c*c^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findGCF(tree_1);
console.log(JSON.stringify(tree_11.get('const'), null, 4));
console.log(JSON.stringify(tree_11.get('sym'), null, 4));
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns an array of objects representing all variables in the given tree
NOTE: Any product of variables are also included in addition to individual variables

Parameters:
tree: A Laco tree
option:
An optional boolean argument
When set to TRUE, the routine does a DFS of the whole tree
  and outputs an array of individual variables, with no mulchain of variables
By default, the argument is set to FALSE, in which case
  the routine considers as one separate variable
  an addchain within a mulchain,
  provided that it contains at least one variable term


Returns:
An array of variable objects

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function findVars(tree, option = false) {
   
    let varList = [];
    if (Array.isArray(tree)) {
        let tree_1 = _.cloneDeep(tree);
        if (option === true) {
            if (isNumeric(tree_1)) {
                return varList;
            }
            if (tree_1[0] === 'variable') {
                varList.push(tree_1);
                return varList;
            }
            let tree_2 = tree_1.slice(1);
            for (let term of tree_2) {
                let subtree = ['addchain', 'mulchain'].includes(tree_1[0]) ? term[1] : term;
                let subVarList = findVars(subtree, option);
                for (let variable of subVarList) {
                    let is_included = false;
                    for (let v of varList) {
                        if (JSON.stringify(v) === JSON.stringify(variable)) {
                            is_included = true;
                            break;
                        }
                    }
                    if (!is_included) {
                        varList.push(variable);
                    }
                }
            }
            return varList;
        }
        
        let operator = tree_1.shift();
        switch (operator) {
            case 'natural':
                break;
            case 'variable':
                varList.push([operator].concat(tree_1));
                break;
            case 'power':
                if (findVars(tree_1[0], option).length > 0) {
                    varList.push([operator].concat(tree_1));
                }
                break;
            case 'negative':
                return findVars(tree_1[0], option);
            case 'mulchain':
                let varTerm = [];
                for (let term of tree_1) {
                    let mulOp = term[0];
                    let subtree = term[1];
                    if (subtree[0] === 'negative') {
                        subtree = subtree[1];
                    }
                    if (findVars(subtree, option).length > 0) {
                        varTerm.push([mulOp, subtree]);
                        // This way, same variable multiplied twice (e.g., ['variable', 'x'])
                        // will be parsed as a mulchain
                        // (e.g., ['mulchain', ['mul', ['variable', 'x']], ['mul', ['variable', 'x']]])
                        // rather than just as one variable (e.g., ['variable', 'x'])
                    }
                }
                varTerm = array2ChainTree(varTerm);
                if (varTerm.length > 0) {
                    
                    varList.push(varTerm);
                }
                break;
            case 'addchain':
                for (let term of tree_1) {
                    let subtree = term[1];
                    if (subtree[0] === 'negative') {
                        subtree = subtree[1];
                    }
                    let subVarList = findVars(subtree, option);
                    for (let subtree of subVarList) {
                        let is_included = false;
                        for (let v of varList) {
                            if (JSON.stringify(v) === JSON.stringify(subtree)) {
                                is_included = true;
                                break;
                            }
                        }
                        if (!is_included) {
                            varList.push(subtree);
                        }
                    }
                }
                break;
            default:
                break;
        }
    }
    
    return varList;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns TRUE if the given tree is a numeric constant
(i.e., with no variable term present)
and FALSE otherwise

Parameter:
tree: A Laco tree
excNegative: An optional boolean argument to only consider nonnegative numeric
                     by setting it to TRUE
recursive: If set to TRUE, recursively checks every subtree
                     By default, the function only considers the top level of subtrees
                     and hence returns FALSE for 
                     fractions with non-integer numerator/denominator
                     or for powers with non-integer base or non-simple-numerical exponent

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function isNumeric(tree, excNegative = false, recursive = false) {
    
    if (!Array.isArray(tree)) {
        return false;
    }
    if (tree[0] === 'absolute') {
        return isNumeric(tree[1]);
    }
    if (tree[0] === 'negative') {
        return !excNegative && isNumeric(tree[1]);
    }
    //let tree_1 = _.cloneDeep(tree);
    let fracIsNumeric = tree[0] === 'fraction';
    let powIsNumeric = tree[0] === 'power';
    if (recursive) {
        // The second term in logical AND evaluates only if tree is a fraction
        fracIsNumeric = fracIsNumeric && isNumeric(tree[1], excNegative, recursive);
        fracIsNumeric = fracIsNumeric && isNumeric(tree[2], excNegative, recursive);
        // The second term in logical AND evaluates only if tree is a power
        powIsNumeric = powIsNumeric && isNumeric(tree[1], excNegative, recursive);
        powIsNumeric = powIsNumeric && isNumeric(tree[2], excNegative, recursive);
    } else {
        
        fracIsNumeric = fracIsNumeric && tree[1][0] === 'natural' && tree[2][0] === 'natural';
        powIsNumeric = powIsNumeric && (tree[1][0] === 'natural' || (tree[1][0] === 'negative' && tree[1][1][0] === 'natural')) && tree[2][0] === 'natural';

        /*//
        // The following change has been undone as of 20180823
        // RATIONALE: If we consider fractional exponents as simple numerical expression
        // then there is no way for us to differentiate, for example,
        // 313^(1/2) (must NOT simplify) and 81^(1/2) (must simplify)
        // without actually carrying out the calculation
        
        // For power, however,
        // allow fractional exponent to return TRUE even with recursive === FALSE
        // as long as the fraction is simple numeric, in addition to
        // the base being simple numeric
        // Therefore, split the evaluation of boolean powIsNumeric into multiple steps
        powIsNumeric = powIsNumeric && tree[1][0] === 'natural';
        expoIsNat = powIsNumeric && tree[2][0] === 'natural';
        expoIsSimpFrac = powIsNumeric && tree[2][0] === 'fraction' && isNumeric(tree[2]);
        expoIsNumeric = expoIsNat || expoIsSimpFrac;
        powIsNumeric = powIsNumeric && expoIsNumeric;
        //*/
    }
    
    return ['natural', 'decimal', 'rdecimal'].includes(tree[0]) || fracIsNumeric || powIsNumeric;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = isNumeric(tree_1, false, false);
console.log(JSON.stringify(tree_11, null, 4))
*/



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Applies multiplicative term factor to each term in tree, and then returns the new tree.

Parameters:
tree: A Laco tree
factor: A Laco data object (e.g., ['natural', '5'], ['variable', 'x'])
simplifyDenom: An option to remove from the denominator (if present)
            rather than appending to the numerator
            (applicable only for fraction tree)
            Option set to FALSE by default

Returns:
A new Laco tree

Author: epark
*/
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {mulNegative} from '../rc/function_160.inc.js';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function multFactor(tree, fterm, simplifyFrac = false) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (!Array.isArray(fterm) || 
        fterm.length === 0 || 
        !['mul', 'div'].includes(fterm[0])) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let fterm_1 = _.cloneDeep(fterm);
    if (tree_1[0] === 'fraction') {
        let idx = fterm_1[0] === 'div' ? 2 : 1;
        if (simplifyFrac && JSON.stringify(fterm_1[1]) === JSON.stringify(tree_1[3 - idx])) {
            tree_1[3 - idx] = ['natural', '1'];
        } else {
            tree_1[idx] = combine2ChainTree(fterm_1[1], tree_1[idx], 'mul');
        }
        tree_1 = fracNegative(tree_1);
        tree_1 = fracSimpInt(tree_1);
        tree_1 = fracSimpVar(tree_1);
        
    } else if (tree_1[0] === 'addchain') {
        let newtree = ['addchain'];
        let tree_2 = tree_1.slice(1);
        for (let aterm of tree_2) {
            aterm[1] = multFactor(aterm[1], fterm_1, simplifyFrac);
            newtree.push(aterm);
        }
        tree_1 = addAdjacentSigns(newtree);
    } else {
        if (fterm_1[0] === 'mul') {
            tree_1 = combine2ChainTree(fterm_1[1], tree_1, 'mul');
        } else {
            tree_1 = ['fraction', tree_1, fterm_1[1]];
        }
    }
    
    
    tree_1 = mulNegative(tree_1);
    if (simplifyFrac) {
        tree_1 = fracNegative(tree_1);
        tree_1 = fracSimpInt(tree_1);
        tree_1 = fracSimpVar(tree_1);
    }
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{1}{2}';
let tree_1 = LatexToTree(latex_1);
let term = ['mul', LatexToTree('2')];
let tree_11 = multFactor(tree_1, term, true);
console.log(JSON.stringify(tree_11, null, 4));
*/



/*
Returns TRUE if the given term exists in the given tree, FALSE otherwise

Parameters:
term: Any subtree in Laco format (e.g., ['variable', 'x'], ['natural', '10'])
tree: A Laco tree
recursive: An optional boolean that activates recursive call (to search ALL subtrees)
                 (defaults to TRUE)
excPolyTerm: An optional boolean that excludes power terms from consideration
                      For example, if term === ['variable', 'x']
                      and tree === ['power', ['variable', 'x'], ['natural', '2']],
                      then this routine returns TRUE unless excPolyTerm is set to TRUE,
                      in which case the routine returns FALSE
                      Same applies for when tree === ['power', ['natural', '2'], ['variable', 'x']]

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function termExists(term, tree, recursive = true, excPolyTerm = false) {
   
    if (JSON.stringify(term) === JSON.stringify(tree)) {
        return true;
    }
    if (!Array.isArray(tree)) {
        return false;
    }

    let term_1 = _.cloneDeep(term);
    let tree_1 = _.cloneDeep(tree);
    
    if (recursive === false) {
        let tree_2 = tree_1.slice(1);
        for (let subterm of tree_2) {
            let subtree;
            if (['addchain', 'mulchain'].includes(tree_1[0])) {
                subtree = subterm[1];
            } else {
                subtree = subterm;
            }
            if (JSON.stringify(term_1) === JSON.stringify(subtree)) {
                if (tree_1[0] === 'power' && excPolyTerm) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    for (let subtree of tree_1) {
        if (termExists(term_1, subtree, recursive, excPolyTerm)) {
            let subtree_1 = _.cloneDeep(subtree);
            let subtree_11 = subtree_1.slice(1);
            let is_included = false;
            for (let v of subtree_11) {
                if (JSON.stringify(v) === JSON.stringify(term_1)) {
                    is_included = true;
                    break;
                }
            }
            if (subtree[0] === 'power' && 
                excPolyTerm &&
                is_included) {
                return false;
            }
            return true;
        }
    }
    
   
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
TRUE if the given input is a valid instance of Laco MathTree; FALSE otherwise

Parameters:
tree: Could be any PHP object

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function validMathTree(tree) {
    
    if (!Array.isArray(tree) || tree.length === 0) {
        return false;
    }
    let tree_1 = _.cloneDeep(tree);
    switch (tree_1[0]) {
        case 'setname':
            return true; // debug this later
        case 'infinity':
            return tree_1.length === 1;
        case 'absolute':
        case 'negative':
        case 'pm':
        case 'mp':
        case 'squareroot':
        case 'angle':
        case 'mangle':
        case 'arc':
        case 'overline':
        case 'sin':
        case 'cos':
        case 'tan':
            return tree_1.length === 2 && validMathTree(tree_1[1]);
        case 'fraction':
        case 'power':
        case 'nthroot':
            return tree_1.length === 3 && validMathTree(tree_1[1]) && validMathTree(tree_1[2]);
        case 'subscript':
            if (tree_1.length !== 3 || tree_1[1][0] !== 'variable') {
                return false;
            }
            return validMathTree(tree_1[1]) && validMathTree(tree_1[2]);
        case 'mfraction':
            return (
                tree_1.length === 4 &&
                validMathTree(tree_1[1]) && validMathTree(tree_1[2]) && validMathTree(tree_1[3])
            );
        case 'natural':
            if (tree_1.length !== 2) {
                return false;
            }
            let arr = tree_1[1].toString().split('');
            var range = [];
            for (let i = 0; i <= 9; i++) {
                range.push(i.toString());
            }
            for (let c of arr) {
                if (!range.includes(c)) {
                    return false;
                }
            }
            break;
        case 'decimal':
            if (tree_1.length !== 2) {
                return false;
            }
            if (tree_1[1].indexOf('.') === -1) {
                return false;
            }
            var tree_2 = tree_1[1].split('');
            var range = [];
            for (let i = 0; i <= 9; i++) {
                range.push(i.toString());
            }
            for (let c of tree_2) {
                if (!range.includes(c) && c !== '.') {
                    return false;
                }
            }
            break;
        case 'rdecimal':
            if (![3, 4].includes(tree_1.length)) {
                return false;
            }
            
            for (let k = 1; k <= tree_1.length - 1; k++) {
                if (!validMathTree(['natural', tree_1[k]])) {
                    return false;
                }
            }
            break;
        case 'anything':
        case 'variable':
            var tree_2 = tree_1.slice(1);
            for (let v of tree_2) {
                if ('0'.charCodeAt(0) <= v.charCodeAt(0) && v.charCodeAt(0) <= '9'.charCodeAt(0)) {
                    return false;
                }
            }
            break;
        case 'addchain':
            if (tree_1.length === 1) {
                return false;
            }
            var tree_2 = tree_1.slice(1);
            for (let term of tree_2) {
                if (term.length !== 2 ||
                    !['add', 'sub', 'addsub', 'subadd'].includes(term[0]) || 
                    !validMathTree(term[1])) {
                    return false;
                }
            }
            break;
        case 'mulchain':
            if (tree_1.length === 1) {
                return false;
            }
            var tree_2 = tree_1.slice(1);
            for (let term of tree_2) {
                if (term.length !== 2 ||
                    !['mul', 'div'].includes(term[0]) || 
                    !validMathTree(term[1])) {
                    return false;
                }
            }
            break;
        case 'equation':
            var tree_2 = tree_1.slice(1);
            for (let subtree of tree_2) {
                if (!validMathTree(subtree)) {
                    return false;
                }
            }
            break;
        case 'inequality':
            var tree_2 = tree_1.slice(1);
            for (let subtree of tree_2) {
                if (!validMathTree(subtree) && !['lt', 'gt', 'le', 'ge'].includes(subtree)) {
                    return false;
                }
            }
            break;
        case 'interval':
            if (tree_1.length !== 5) {
                return false;
            }
            if (!['[', '('].includes(tree_1[1]) || !tree_1[4], [']', ')'].includes(tree_1[4])) {
                return false;
            }
            return validMathTree(tree_1[2]) && validMathTree(tree_1[3]);    
        default:
            return false;
    }
    
    return true;
}


export function utf8_ord(ch) {
    let len = ch.length;
    
    if (len <= 0) { 
        return false;
    }
    let h = ch[0].charCodeAt(0);
    if (h <= 0x7F) {
        return h;
    }
    if (h < 0xC2) { 
        return false;
    }
    if (h <= 0xDF && len > 1) { 
        return (h & 0x1F) <<  6 | (ch[1].charCodeAt(0) & 0x3F);
    }
    if (h <= 0xEF && len > 2 ) { 
        return (h & 0x0F) << 12 | (ch[1].charCodeAt(0) & 0x3F) << 6 | (ch[2].charCodeAt(0) & 0x3F);
    }          
    if (h <= 0xF4 && len >3) {
        return (h & 0x0F) << 18 | (ch[1].charCodeAt(0) & 0x3F) << 12 | (ch[2].charCodeAt(0) & 0x3F) << 6 | (ch[3].charCodeAt(0) & 0x3F);
    }
    return h
    //return false;
}
/*
let result = utf8_ord('하');
//result = utf8_ord('10000');
console.log(JSON.stringify(result, null, 4));
*/