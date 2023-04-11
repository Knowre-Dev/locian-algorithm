import {validMathTree} from '../rc/function_135.inc.js';

export function evaluateEx_new(tree) { 
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (validMathTree(tree_1) == false) {
        
        return tree_1;
    }
    var newTree = [];
    //console.log(JSON.stringify(tree_1, null, 4));
    switch(tree_1[0]) {
        
        // 160828 larwein - inequality patch
        case 'inequality':
        // 20180817 epark - Leave alone inequalities with infinity sign
            if (JSON.stringify(tree_1[1]) == JSON.stringify(['infinity']) || 
                JSON.stringify(tree_1[5]) == JSON.stringify(['infinity']) || 
                JSON.stringify(tree_1[1]) == JSON.stringify(['negative', ['infinity']]) || 
                JSON.stringify(tree_1[5]) == JSON.stringify(['negative', ['infinity']])) {
                return tree_1;
            }  
            newTree = ['inequality'];
            var newOperands = [];
            if (tree_1[2] === 'gt' || tree_1[2] === 'ge') {
                var tree_11 = tree_1.slice(1);

                for (var [k, subtree] of tree_11.entries()) {
                    if (k == tree_1.length - 2) {
                        newOperands.push(['natural', '0']);
                    } else if (k % 2 == 1) {
                        newOperands.push(subtree);
                    } else {
                        newOperands.push(evaluateEx_new(
                            ['addchain', ['add', subtree], ['sub', tree_1[tree_1.length - 1]]]
                        ));
                    }
                }
            } else {
                var tree_11 = tree_1.slice(1).reverse();
                
                for (var [k, subtree] of tree_11.entries()) {
                    
                    if (k == tree_1.length - 2) {
                        newOperands.push(['natural', '0']);
                    } else if (k % 2 == 1) {
                        var op = (subtree == 'lt' ? 'gt' : 'ge');
                        newTree.push(op);
                    } else {
                        newTree.push(evaluateEx_new(
                            ['addchain', ['add', subtree], ['sub', tree_1[1]]]
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
            var seedArr = [-2, -1, 1, 2, 3];
            //var seedArr = [Math.tan(-2), Math.tan(-1), Math.tan(1), Math.tan(2), Math.tan(3)];
            for (var seed of seedArr) {
                var evalresult = evaluateExWithSeed(tree_1, seed);
                
                // If the value is too large for numerical evaluation
                // so that any of the five substitutions produce INF or NAN,
                // then just return the original tree
                //*//
                
                if (['equation', 'inequality', 'neq', 'ratio', 'orchain'].includes(evalresult[0])) {
                    var evalresult_1 = evalresult.slice(1); 
                    for (var evalside of evalresult_1) { 
                        if (!isFinite(evalside[0]) || isNaN(evalside[0]) || 
                            !isFinite(evalside[1]) || isNaN(evalside[1])) {  
                            return tree_1;
                        }
                    }
                } else if (!isFinite(evalresult[0]) || isNaN(evalresult[0]) ||
                    !isFinite(evalresult[1]) || isNaN(evalresult[1])) { 
                        
                    return tree_1;
                }
                
                newTree.push(evalresult);
                
            }
            break;
    }
    
    return newTree;
    
}



/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = evaluateEx_new;
var latex1 = 'e';
var tree1 = LatexToTree(latex1);


var tree11 = func(tree1);
console.log(JSON.stringify(tree11, null, 4));
*/


/*
A quick helper export function for naming variables for lookup table
*/
//*//
export function getVarName(variable) {
    var variable_1 = JSON.parse(JSON.stringify(variable));
    /*//
    // DEBUG
    if (is_null(variable))
        return 'x';
    if (variable[0] == 'subscript')
        return 'y';
    return 'z';
    return ('x' . count(variable));
    // end debug
    //*/
    var varname = variable_1.slice(1);
    varname = varname.length > 1 ? '(' + varname.join() + ')' : varname[0].toString();
    return varname;
    /*//
    if (variable[0] == 'subscript') {
        varname = getVarName(variable[1]);
        varname2 = getVarName(variable[2]);
        varname .= varname2;
    } else {
        //varname = is_null(variable) ? ['e'] : array_slice(variable, 1);
        varname = array_slice(variable, 1);
        varname = count(varname) > 1 ? ('(' . implode(varname) . ')') : strval(varname[0]);
    }
    return varname;
    //*/
}
//*/

/*
Routine mostly copied from checkmath.php

Edit 20180817 epark:
This routine now constructs a lookup table
to use when substituting a complex number for each variable
That way, we are guaranteed to have every variable with the same value
no matter where in the tree traversal does the substitution occur
*/

import {findVars} from '../rc/function_135.inc.js';

export function evaluateExWithSeed(tree, seed = 1, lookupTable = null) {  
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var lookupTable_1 = JSON.parse(JSON.stringify(lookupTable));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    var operator = tree_1[0];
    var operandTree = tree_1.slice(1);
    // Construct a lookup table for variables
    // Added by epark on 20180817
    var varList = findVars(tree_1, true);
    // Note epark 20180831:
    // The above export function findVars() only finds variables, not subscripts
    // This is because evaluateOperation() already has a way to deal with
    // subscripts in a way that we desire
    // (i.e., same var name with different subscript treated as different)
    var varNames = [];
    for (var variable of varList) {
        // Use a helper export function to set variable name string for lookup table
        // (will also be used at evaluateVariable() to find the correct entry)
        var varname = getVarName(variable);
        var is_included = false;
        for (var v of varNames) {
            if (JSON.stringify(v) == JSON.stringify(varname)) {
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
    
    var maxVal = Number.MAX_SAFE_INTEGER;;
    // epark 20190717: Decreased rangeWidth from 10 to 1
    //     so as to accurately compare 3^x+y and 3^x-y
    //     where too large rangeWidth results in them evaluated equal
    //     (y was too small compared to 3^x)
    var rangeWidth = 1;
    var bound = rangeWidth / 2;
    if (lookupTable_1 == null) {
        lookupTable_1 = new Map();
        for (var varname of varNames) {
            var newZ = [];
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
                    
                    var randRe = Math.floor((Math.cos(seed) * Number.MAX_SAFE_INTEGER));
                    var randIm = Math.floor((Math.sin(seed) * Number.MAX_SAFE_INTEGER));
                    
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
                    var asciiBound = 'a'.charCodeAt(0) + 13; // Middle of 'a' - 'z'
                    randRe += ((Math.cos(seed) + 2) * varname.charCodeAt(0) - asciiBound);
                    randIm += ((Math.sin(seed) + 2) * varname.charCodeAt(0) - asciiBound);
                    randRe = randRe * rangeWidth - bound;
                    randIm = randIm * rangeWidth - bound;
                    // Round to 4 decimal places just for efficiency's sake
                    // (otherwise running the new Equivalent preset slows down too much)

                    randRe = parseFloat(randRe.toFixed(4));
                    
                    randIm = parseFloat(randIm.toFixed(4));
                    
                    //Initialize the new complex value
                    newZ[0] = randRe;
                    newZ[1] = randIm;
                    break;
                
            }
            
            lookupTable_1[varname] = newZ;
        }
    }
    //console.log(operator);
           
    //console.log(lookupTable_1);
    //console.log('.......');
    
    if (operator === 'summation') {
        return evaluateOperation(operator, operandTree, seed, lookupTable_1);
    }
    // To account for cases like 0=N^x-y vs. 0=N^x+y (addchain with large-base power term),
    // we add the power term on all sides then log-transform both sides
    
    // if there is a power term with a large base {
    //     if tree is a seq. of equalities/inequalities {
    //         logTransform(subtree) for each subtree
    //     } else { operandTree = logTransform(operandTree) }
    // }
    
    var operand = [];

    for(var subtree of operandTree) {
        
        operand.push(evaluateExWithSeed(subtree, seed, lookupTable_1));
        //if (operator == 'power') {
        //    console.log(operator);
        //    console.log(JSON.stringify(subtree, null, 4));
        //    console.log(evaluateExWithSeed(subtree, seed, lookupTable_1));
        //    console.log('...........');
        //}
    }
    //console.log(operator);
    //console.log(operand);
    // By the recursion above, we are guaranteed that
    // ALL subexpressions have been evaluated into numerical values
    switch(operator) {
        case 'variable':
            
            //case 'subscript': // commented out; evaluateOperation() already handles this well
            return evaluateVariable([operator].concat(operand), lookupTable_1);
            // Note: The export function above has been edited to take in the whole tree as 1st arg
            //          rather than just the operand without operator at front

        
        case 'overline':
        case 'overleftarrow':
        case 'overrightarrow':
        case 'overleftrightarrow':
        case 'widearc':
        case 'arc':
        case 'mangle':
        case 'angle':
            return operand[0];
        
        case 'sin':   // ahjin
            var result = operand[0];
            var degree = result[0] * 180 / Math.PI;
            
            if (degree % 180 === 0) {
                result[0] = 0;
            } else {
                result[0] = Math.sin(degree * Math.PI / 180);
            }
            return result;
        
        case 'cos':   // ahjin
            var result = operand[0];
            var degree = result[0] * 180 / Math.PI;
            degree += 90;
            if (degree % 180 === 0) {
                result[0] = 0;
            } else {
                result[0] = Math.sin(degree * Math.PI / 180);
            }
            if (result[1] < 0) {
                result[1] *= -1;
            }
            return result;
        
        case 'tan':
            result = operand[0];
            result[0] = Math.tan(result[0]);
            return result;
        
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain':  
            var result = [operator];
            for (var v of operand) {
                result.push(v);
            }
            return result;
            
            
        default:
            //console.log(operator);
            //console.log(operand);
            //console.log('.......');
            return evaluateOperation(operator, operand, seed, lookupTable_1);
    }
}


/*
Routine mostly copied from checkmath.php

Values are represented in complex number format
(array of two numbers [real, imaginary])
*/
export function evaluateOperation(operator, operand, seed = null, lookupTable = null) {
    //console.log(operator);
    //console.log(operand);
    //console.log('.......');
    var operand_1 = JSON.parse(JSON.stringify(operand));
    var lookupTable_1 = JSON.parse(JSON.stringify(lookupTable));
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
            var sum = [0, 0];
            for (var term of operand_1) {       
                         
                sum[0] += (!isNaN(term[0]) ? term[0] : 0);
                sum[1] += (!isNaN(term[1]) ? term[1] : 0);
                
                // if newRe == sum[0] and yet term[0] > 0, then floating point rounding error
            }
            return sum;
        
        case 'div':
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            var modulusSq = operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1];
            return [operand_1[0][0] / modulusSq, -operand_1[0][1] / modulusSq];
        
        case 'mulchain':
            var prod = [1, 0];
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            
            for (var factor of operand_1) {
                var temp = JSON.parse(JSON.stringify(prod));
                
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
            var numerRe = operand_1[0][0];
            var numerIm = operand_1[0][1];
            var denomRe = operand_1[1][0];
            var denomIm = operand_1[1][1];
            var modulusSqDenom = denomRe * denomRe + denomIm * denomIm;
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
            var modulusSq = operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1];
            return powComplex_inLocian(
                operand_1[1],
                [operand_1[0][0] / modulusSq, -operand_1[0][1] / modulusSq]
            );
        
        case 'absolute':
            var modulus = Math.sqrt(
                operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1]
            );
            return [modulus, 0];
        
        case 'rdecimal':
            var intg = parseFloat(operand_1[0]);
            var num = operand_1[1] + (parseFloat(operand_1[2]) - parseFloat(operand_1[1])).toString();
            var denum = '';
            for(i = 0; i < operand_1[2].length; i++) {
                denum += '9';
            }
            for(i = 0; i < operand_1[1].length; i++) {
                denum += '0';
            }
            return [intg + (parseFloat(num) / parseFloat(denum)), 0];
        
        case 'subscript':
            return [
                operand_1[0][0] + 2 * operand_1[1][1],
                operand_1[0][1] + 2 * operand_1[1][0]
            ];
            
        case 'ln':
            var modulus = Math.sqrt(
                operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1]
            );
            /*//
            // the current implementation does not consider the complex natural log
            // but simply takes the modulus and use that instead
            return array(log(modulus), 0);
            /*/
            // theta is the argument (angle) from the positive x-axis
            var theta = Math.atan2(operand_1[0][1], operand_1[0][0]);
            return [Math.log(modulus), theta];
            // Note: The return value above implies that
            //          the returned value is really the principal value Log z of the input z=x+iy
            //*/
        
        case 'log':
            var newOperand = [];
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
                var sum = array(0, 0);
                var variable = operand_1[0][1];
                var min = parseFloat(operand_1[0][2][1]);
                var max = parseFloat(operand_1[1][1]);
                for (var ind = min; ind <= max; ind++) {
                    var newEx = replace(operand_1[2], variable, ['natural', ind]);
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
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var from_1 = JSON.parse(JSON.stringify(from));
    var to_1 = JSON.parse(JSON.stringify(to));
    if (JSON.stringify(tree_1) == JSON.stringify(from_1)) {
        return to;
    }
    
    var operator = tree_1[0];
    var operand = tree_1.slice(1);
    
    var newOperand = [];
    for(var v of operand) {
        if (Array.isArray(v)) {
            newOperand.push(replace(v, from_1, to_1));
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
    var variable_1 = JSON.parse(JSON.stringify(variable));
    var lookupTable_1 = JSON.parse(JSON.stringify(lookupTable));
    var varname = getVarName(variable_1);
    /*//
    varname = is_array(variable) ? ('(' . implode(variable) . ')') : variable;
    //*/
   
    var keys = Object.keys(lookupTable_1);
    
    if (keys.includes(varname)) {
        return lookupTable_1[varname];
    }
    return null;
}


/*
Copied mostly from checkmath.php,
with comments added by epark
*/
export function powComplex_inLocian(A, B) {  
    var A_1 = JSON.parse(JSON.stringify(A));
    var B_1 = JSON.parse(JSON.stringify(B));
    
    if (A_1[0] == 0 && A_1[1] == 0) {
        if (B_1[0] == 0 && B_1[1] == 0) {
            return [1, 0];
        }
        return [0, 0];
    }
    
    // r is the modulus of the base
    var r = Math.sqrt(A_1[0] * A_1[0] + A_1[1] * A_1[1]);
    
    if (r < 1) {
        // If r is less than 1, underflow may occur due to denormalization of float
        // If anyone's got a better remedy, please go ahead and do so...
        var r2 = r * r;
        var newA = [A_1[0] / r2, -A_1[1] / r2];
        var newB = [-B_1[0], -B_1[1]];
        return powComplex_inLocian(newA, newB);
    }
    
    // theta is the argument (angle) from the positive x-axis
    var theta;
    if (A_1[1] == 0 && A_1[0] > 0) {
        theta = 0;
    } else if (A_1[1] == 0 && A_1[0] < 0) {
        theta = Math.PI;
    } else if (A_1[1] > 0) {
        theta = Math.acos(A_1[0] / r);
    } else {
        theta = 2 * Math.PI - Math.acos(A_1[0] / r);
    }
    
    var c = B_1[0];
    var d = B_1[1];
    
    var newR = Math.pow(r, c) / Math.exp(d * theta);
    var newTheta = d * Math.log(r) + c * theta;
    
    var result = [
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
    ];
    
    return result;
}


/*
Combines fractions w/ two powers with same exponent into one power obj
so as to prevent floating point value overflow
Intended only for use in evaluateEx_new
*/
export function fracOfPow2PowOfFrac(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1) || tree_1.length < 1) {
        return tree_1;
    }
    
    if (tree_1[0] == 'fraction' &&
        tree_1[1][0] == 'power' && tree_1[2][0] == 'power' && 
        // Currently exponents must also be the same; modify if needed
        tree_1[1][2] == tree_1[2][2]) {
        tree_1 = ['power', ['fraction', tree_1[1][1], tree_1[2][1]], tree_1[1][2]];
        return tree_1;
    }
    for (var [k, subtree] of tree_1.entries()) {
        if (k == 0) {
            continue;
        }
        tree_1[k] = fracOfPow2PowOfFrac(subtree);
    }
    return tree_1;
}

export function utf8_ord(ch) {
    var len = ch.length;
    
    if (len <= 0) { 
        return false;
    }
    var h = ch[0].charCodeAt(0);
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