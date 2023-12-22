/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable camelcase */
export function evaluateEx_new(tree) {
    if (validMathTree(tree) === false) {
        return tree;
    }

    // let newTree;
    // let newOperands;
    // let seedArr;
    switch (tree[0]) {
        // 160828 larwein - inequality patch
        case 'inequality': {
            // 20180817 epark - Leave alone inequalities with infinity sign'
            if (JSON.stringify(tree[1]) === JSON.stringify(['infinity']) ||
                JSON.stringify(tree[5]) === JSON.stringify(['infinity']) ||
                JSON.stringify(tree[1]) === JSON.stringify(['negative', ['infinity']]) ||
                JSON.stringify(tree[5]) === JSON.stringify(['negative', ['infinity']])) {
                return tree;
            }
            const newTree = ['inequality'];
            const newOperands = [];
            if (tree[2] === 'gt' || tree[2] === 'ge') {
                const [, ...operand] = tree;
                const operand_entries = operand.entries();
                for (const [key, term] of operand_entries) {
                    key === tree.length - 2 ? newOperands.push(['natural', '0'])
                    : key % 2 === 1 ? newOperands.push(term)
                    : newOperands.push(evaluateEx_new(
                            ['addchain', ['add', term], ['sub', tree[tree.length - 1]]]
                        ));
                }
                return [...newTree, ...newOperands];
            }
            const operand_reverse = tree.slice(1).reverse();
            const operand_reverse_entries = operand_reverse.entries();
            for (const [key, term] of operand_reverse_entries) {
                key === tree.length - 2 ? newOperands.push(['natural', '0'])
                : key % 2 === 1 ? newTree.push(term === 'lt' ? 'gt' : 'ge')
                : newTree.push(evaluateEx_new(
                        ['addchain', ['add', term], ['sub', tree[1]]]
                    ));
            }
            return [...newTree, ...newOperands];
        }
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'orchain':
        default: {
            const newTree = ['eval'];
            const seedArr = [-2, -1, 1, 2, 3];
            for (const seed of seedArr) {
                const evalresult = evaluateExWithSeed(tree, seed);
                // If the value is too large for numerical evaluation
                // so that any of the five substitutions produce INF or NAN,
                // then just return the original tree

                if (Array.isArray(evalresult)) {
                    if (['equation', 'inequality', 'neq', 'ratio', 'orchain'].includes(evalresult[0])) {
                        const [, ...evalresult_1] = evalresult;
                        for (const evalside of evalresult_1) {
                            if (!isFinite(evalside[0]) || isNaN(evalside[0]) ||
                                !isFinite(evalside[1]) || isNaN(evalside[1])) {
                                return tree;
                            }
                        }
                    } else if (!isFinite(evalresult[0]) || isNaN(evalresult[0]) ||
                        !isFinite(evalresult[1]) || isNaN(evalresult[1])) {
                        return tree;
                    }
                }
                newTree.push(evalresult);
            }
            return newTree;
        }
    }
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
    const [, ...varname] = variable;
    return varname.length > 1 ? ('(' + varname.join() + ')') : varname[0].toString();
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
export function evaluateExWithSeed(tree, seed = 1, lookupTable = {}) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    // Construct a lookup table for variables
    // Added by epark on 20180817
    const varList = findVars(tree, true);
    // Note epark 20180831:
    // The above function findVars() only finds variables, not subscripts
    // This is because evaluateOperation() already has a way to deal with
    // subscripts in a way that we desire
    // (i.e., same let name with different subscript treated as different)
    const varNames = [];
    for (const variable of varList) {
        // Use a helper function to set variable name string for lookup table
        // (will also be used at evaluateVariable() to find the correct entry)
        const varname = getVarName(variable);
        let is_included = false;
        for (const v_name of varNames) {
            if (JSON.stringify(v_name) === JSON.stringify(varname)) {
                is_included = true;
                break;
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

    const maxVal = Number.MAX_SAFE_INTEGER;
    const rangeWidth = 10;
    const bound = rangeWidth / 2;

    if (Object.keys(lookupTable).length === 0) {
        for (const varname of varNames) {
            let newZ = [];
            switch (varname) {
                // Add below any other cases of special mathematical constants as needed
                case 'i': { // imaginary unit
                    newZ = [0, 1];
                    break;
                }
                case 'e': { // base of natural system of logarithms
                    newZ = [Math.exp(1), 0];
                    break;
                }
                case 'pi': { // pi (circumference / diameter)
                    newZ = [Math.PI, 0];
                    break;
                }
                default: {
                    // Use rand() only when the symbol is not any of the
                    // special mathematical constants specified above
                    // so as to not affect the random number generator state
                    // EDIT epark 20180830: Don't use lcg_value().. srand() wouldn't work as you'd expect
                    let randRe = Math.floor((Math.cos(seed) * Number.MAX_SAFE_INTEGER));
                    let randIm = Math.floor((Math.sin(seed) * Number.MAX_SAFE_INTEGER));
                    // Scale the random numbers appropriately (incl. make them into float values)
                    randRe /= maxVal;
                    randIm /= maxVal;
                    // EDIT 2018.08.23:
                    // Ensure that x in one tree is assigned a different value than y in another tree
                    // Even when each variable is the only variable present in their respective trees
                    // RATIONALE: Without this, 3x+3y-3x and 3x+3y-3y will evaluate to same
                    // after all the prior transformations inside the new Equivalent preset,
                    // which must include mulZero to prevent PHP error
                    // caused at lines 1808,1809,1811,1812
                    const asciiBound = utf8_ord('a') + 13; // Middle of 'a' - 'z'
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
            }
            lookupTable[varname] = newZ;
        }
    }

    if (operator === 'summation') {
        return evaluateOperation(operator, operand, seed, lookupTable);
    }

    const newOperand = operand.map(term => evaluateExWithSeed(term, seed, lookupTable));

    // By the recursion above, we are guaranteed that
    // ALL subexpressions have been evaluated into numerical values

    switch (operator) {
        case 'variable': {
            // case 'subscript':
            // commented out; evaluateOperation() already handles this well
            return evaluateVariable([operator, ...newOperand], lookupTable);

            // Note: The function above has been edited to take in the whole tree as 1st arg
            //          rather than just the operand without operator at front
        }
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
        case 'tan': {
            return newOperand[0];
        }
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain': {
            return [operator, ...newOperand];
        }
        default: {
            return evaluateOperation(operator, newOperand, seed, lookupTable);
        }
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
export function evaluateOperation(operator, operand, seed = null, lookupTable = {}) {
    switch (operator) {
        case 'natural':
        case 'decimal': {
            return [parseFloat(operand[0]), 0];
        }
        case 'positive':
        case 'add':
        case 'mul': {
            return operand[0];
        }
        case 'pm':
        case 'addsub': {
            return [0.8 * operand[0][0], 1.2 * operand[0][1]];
        }
        case 'negative':
        case 'sub': {
            // ...what case would below be??
            if (Array.isArray(operand[0][0]) || Array.isArray(operand[0][1])) {
                return [0, 0];
            }
            return [-operand[0][0], -operand[0][1]];
        }
        case 'addchain': {
            const sum = [0, 0];
            for (const term of operand) {
                if (Array.isArray(term)) {
                    sum[0] += (!isNaN(term[0]) ? term[0] : 0);
                    sum[1] += (!isNaN(term[1]) ? term[1] : 0);
                }
            }
            return sum;
        }
        case 'div': {
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            const modulusSq = Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2);
            return [operand[0][0] / modulusSq, -operand[0][1] / modulusSq];
        }
        case 'mulchain': {
            const prod = [1, 0];
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i

            for (const factor of operand) {
                const temp = [prod[0], prod[1]];
                prod[0] = temp[0] * factor[0] - temp[1] * factor[1];
                prod[1] = temp[0] * factor[1] + temp[1] * factor[0];
            }
            return prod;
        }
        case 'fraction': {
            if (isNaN(operand[0][0]) ||
                isNaN(operand[0][1]) ||
                isNaN(operand[1][0]) ||
                isNaN(operand[1][1])) {
                return [1, 1];
            }
            const numerRe = operand[0][0];
            const numerIm = operand[0][1];
            const denomRe = operand[1][0];
            const denomIm = operand[1][1];
            const modulusSqDenom = denomRe * denomRe + denomIm * denomIm;
            return [
                (numerRe * denomRe + numerIm * denomIm) / modulusSqDenom,
                (numerIm * denomRe - numerRe * denomIm) / modulusSqDenom
            ];
        }
        case 'mfraction': { // only real entries assumed
            return [operand[0][0] + operand[1][0] / operand[2][0], 0];
        }
        case 'power': {
            return powComplex_inLocian(operand[0], operand[1]);
        }
        case 'squareroot': {
            return powComplex_inLocian(operand[0], [0.5, 0]);
        }
        case 'nthroot': {
            // For a complex number z, we have 1/z = z*/|z|^2,
            // where z* is the complex conjugate of z
            // So z1th root of z2 (i.e., z2^(1/z1)) would be
            // z2^(z1*/|z1|^2)
            const modulusSq = Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2);
            return powComplex_inLocian(
                operand[1],
                [operand[0][0] / modulusSq, -operand[0][1] / modulusSq]
            );
        }
        case 'absolute': {
            const modulus = Math.sqrt(
                Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2)
            );
            return [modulus, 0];
        }
        case 'rdecimal': {
            const intg = parseFloat(operand[0]);
            let num
            operand[1] === '' ? num = parseFloat(operand[1] + operand[2])
            : num = parseFloat(operand[1] + (parseFloat(operand[2]) - parseFloat(operand[1])).toString());
            let denum = '9'.repeat(operand[2].length) + '0'.repeat(operand[1].length);
            denum = parseFloat(denum);
            return [intg + (num / denum), 0];
        }
        case 'subscript': {
            return [
                operand[0][0] + 2 * operand[1][1],
                operand[0][1] + 2 * operand[1][0]
            ];
        }
        case 'ln': {
            const modulus = Math.sqrt(
                Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2));

            /*
            the current implementation does not consider the complex natural log
            but simply takes the modulus and use that instead
            return array(log(modulus), 0);
            */
            // theta is the argument (angle) from the positive x-axis
            // const theta = Math.atan2(operand[0][1], operand[0][0]);
            return [Math.log(modulus), Math.atan2(operand[0][1], operand[0][0])];
            // Note: The return value above implies that
            //          the returned value is really the principal value Log z of the input z=x+iy
        }
        case 'log': {
            const newOperand = [];
            newOperand.push(evaluateOperation('ln', [operand[0]], seed, lookupTable));
            typeof operand[1] !== 'undefined' ? newOperand.push(evaluateOperation('ln', [operand[1]], seed, lookupTable))
            : newOperand.push(evaluateOperation('ln', [[10, 0]], seed, lookupTable))
            return evaluateOperation('fraction', newOperand, seed, lookupTable);
        }
        case 'summation': {
            if (operand[0][0] === 'equation' &&
                operand[0][1][0] === 'variable' &&
                operand[0][2][0] === 'natural' &&
                operand[1][0] === 'natural') {
                let sum = [0, 0];
                const vari = operand[0][1];
                const min = operand[0][2][1];
                const max = operand[1][1];
                for (let ind = min; ind <= max; ind++) {
                    let newEx = replace(operand[2], vari, ['natural', ind.toString()]);
                    newEx = evaluateExWithSeed(newEx, seed, lookupTable);
                    sum = evaluateOperation(
                        'addchain',
                        [sum, newEx],
                        seed,
                        lookupTable
                    );
                }
                return sum;
            } else {
                return null;
            }
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
    const [operator, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        Array.isArray(term) ? newOperand.push(replace(term, from, to))
        : newOperand.push(term)
    }
    return [operator, ...newOperand];
}

/*
Refactored this routine to use instead
a lookup table constructed at evaluateExWithSeed(),
which is passed as an argument
*/
export function evaluateVariable(variable, lookupTable = {}) {
    const varname = getVarName(variable);
    const keys = Object.keys(lookupTable);
    for (const key of keys) {
        if (JSON.stringify(key) === JSON.stringify(varname)) {
            return lookupTable[varname];
        }
    }
    return null;
}

/*
Copied mostly from checkmath.php,
with comments added by epark
*/
export function powComplex_inLocian(A, B) {
    if (A[0] === A[1] === 0) {
        if (B[0] === B[1] === 0) {
            return [1, 0];
        }
        return [0, 0];
    }

    // r is the modulus of the base
    const r = Math.sqrt(Math.pow(A[0], 2) + Math.pow(A[1], 2));
    if (r < 1) {
        // If r is less than 1, underflow may occur due to denormalization of float
        // If anyone's got a better remedy, please go ahead and do so...
        const r2 = Math.pow(r, 2);
        return powComplex_inLocian([A[0] / r2, -A[1] / r2], [-B[0], -B[1]]);
    }

    // theta is the argument (angle) from the positive x-axis
    let theta;
    (A[1] === 0 && A[0] > 0) ? theta = 0
    : (A[1] === 0 && A[0] < 0) ? theta = Math.PI
    : A[1] > 0 ? theta = Math.acos(A[0] / r)
    : theta = 2 * Math.PI - Math.acos(A[0] / r);

    const c = B[0];
    const d = B[1];
    const newR = Math.pow(r, c) / Math.exp(d * theta);
    const newTheta = (d * Math.log(r) + c * theta) % (2 * Math.PI);
    return [newR * Math.cos(newTheta), newR * Math.sin(newTheta)];
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

    if (tree[0] === 'fraction' && tree[1][0] === 'power' && tree[2][0] === 'power' &&
        // Currently exponents must also be the same; modify if needed
        JSON.stringify(tree[1][2]) === JSON.stringify(tree[2][2])) {
        return ['power', ['fraction', tree[1][1], tree[2][1]], tree[1][2]];
    }
    const tree_entries = tree.entries();
    for (const [key, term] of tree_entries) {
        if (key !== 0) {
            tree[key] = fracOfPow2PowOfFrac(term);
        }
    }
    return tree;
}

/* 135. UtilityFunctions */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function array2ChainTree(arr, evalNumeric = false) {
    // For any invalid input, just return the input back
    if (!Array.isArray(arr) || arr.length === 0 || arr[0].length < 1) {
        return arr;
    }

    let operator;
    if (['add', 'sub', 'addsub', 'subadd'].includes(arr[0][0])) {
        operator = 'addchain'
    } else if (['mul', 'div'].includes(arr[0][0])) {
        operator = 'mulchain'
    } else {
        return arr;
        // Can only handle addchain or mulchain; return the input array otherwise
    }
    // Optional: Evaluate all numerical terms into a single term
    if (evalNumeric) {
        const numericArr = [];
        const nonnumericArr = [];
        for (const term of arr) {
            const subtree = term[1];
            isNumeric(subtree, false, false) ? numericArr.push([term[0], subtree])
            : nonnumericArr.push([term[0], subtree]);
        }

        let numRes = array2ChainTree(numericArr);
        arr = nonnumericArr;
        if (numRes.length > 0) {
            numRes = evalNumericValues(numRes);
            if (operator === 'addchain') {
                if (arr.length === 0 || JSON.stringify(numRes) !== JSON.stringify(['natural', '0'])) {
                    numRes[0] === 'negative' ? arr.unshift(['sub', numRes[1]])
                    : arr.unshift(['add', numRes]);
                }
            } else {
                arr.unshift(['mul', numRes]);
            }
        }
    }

    // If there is only one operand, just return that operand
    if (arr.length === 1) {
        if (['addsub', 'subadd'].includes(arr[0][0])) {
            return ['pm', arr[0][1]];
        }
        if (arr[0][0] === 'sub') {
            return ['negative', arr[0][1]];
        }
        if (arr[0][0] === 'div') {
            return ['fraction', ['natural', '1'], arr[0][1]];
        }
        return arr[0][1];
    }

    // Construct the tree
    return [operator, ...arr];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '3^2';
let tree_1 = LatexToTree(latex_1);
tree_1 = [['mul', tree_1]];
let tree_11 = array2ChainTree(tree_1, true);
console.log(JSON.stringify(tree_11, null, 4))
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function chainTree2Array(tree, subtype = 'mul') {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }

    // Make sure to return array of array(s) as the final output
    if (tree[0] === 'addchain') {
        if (['add', 'sub', 'addsub', 'subadd'].includes(subtype)) {
            return tree.slice(1);
        }
    } else if (tree[0] === 'mulchain') {
        if (['mul', 'div'].includes(subtype)) {
            return tree.slice(1);
        }
    }
    return [[subtype, tree]];
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function combine2ChainTree(tree1, tree2, subtype = null) {
    if (!Array.isArray(tree1) || tree1.length < 1 ||
        !Array.isArray(tree2) || tree2.length < 1) {
        return false;
    }

    // Set subtype if not provided (see the note above)
    if (subtype === null) {
        ['addchain', 'mulchain'].includes(tree1[0]) ? subtype = tree1[0] === 'addchain' ? 'add' : 'mul'
        : subtype = tree2[0] === 'addchain' ? 'add' : 'mul';
    }

    return array2ChainTree([...chainTree2Array(tree1, subtype), ...chainTree2Array(tree2, subtype)]);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
import { fracDecimal } from '../rc/function_49.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracComplex } from '../rc/function_69.inc.js';
import { fracSimpInt, EuclidAlg } from '../rc/function_76.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';

export function evalNumericValues(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'natural':{
            return [operator, tree[1]];
        }
        case 'decimal': {
            return evalNumericValues(fracDecimal([operator, tree[1]]));
        }
        case 'rdecimal': {
            return evalNumericValues(rdecToFrac([operator, tree[1]]));
        }
        case 'negative': {
            const operand_0 = evalNumericValues(tree[1]);
            return operand_0[0] === 'negative' ? operand_0[1]
                : [operator, operand_0];
        }
        case 'absolute': {
            const operand_0 = evalNumericValues(tree[1]);
            return operand_0[0] === 'negative' ? operand_0[1]
                : operand_0;
        }
        case 'fraction': {
            return fracSimpInt(fracNegative(fracComplex(tree)));
        }
        case 'addchain': {
            return evalNumericValues_addChain(tree.slice(1));
        }
        case 'mulchain': {
            return evalNumericValues_mulChain(tree.slice(1));
        }
        case 'power': {
            return evalNumericValues_power(tree.slice(1));
        }
        default: {
            return tree;
        }
    }
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

export function evalNumericValues_addChain(operand) {
    const operand_1 = [];
    const operand_2 = [];
    for (const term of operand) {
        (term[0] === 'add' || term[0] === 'sub') ? operand_1.push(term)
        : operand_2.push(['addsub', term[1]]);
    }
    if (JSON.stringify(operand_1) === JSON.stringify([])) {
        return ['addchain', ...operand_2];
    }
    let numer = 0;
    let denom = 1;

    for (const term_1 of operand_1) {
        let subtree = term_1[1];
        // Account for any negative and/or subtraction
        let sign = 1;
        if (subtree[0] === 'negative') {
            sign *= -1;
            subtree = subtree[1];
        }
        if (term_1[0] === 'sub') {
            sign *= -1;
        }

        let nVal = parseInt(subtree[1]);
        let dVal = 1;
        if (subtree[0] === 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        }
        // Update denom to the LCD of all terms considered so far
        const updateFactor = dVal / EuclidAlg(denom, dVal);
        denom *= updateFactor;
        // Update numer also to reflect the new LCD, and then add the current term
        numer *= updateFactor;
        numer += sign * nVal * (denom / dVal);
    }

    // Construct the output tree as a fraction, and then simplify before returning
    const tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    return numer > 0 ? ['addchain', ['add', fracSimpInt(tree)], ...operand_2]
        : ['addchain', ['sub', fracSimpInt(tree)], ...operand_2]
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
    let numer = 1;
    let denom = 1;
    for (const term of operand) {
        // Return early if numer === 0 (for efficiency's sake)
        if (numer === 0) {
            return ['natural', '0'];
        }
        let subtree = term[1];
        // Account for any negative
        let sign = 1;
        if (subtree[0] === 'negative') {
            sign = -1;
            subtree = subtree[1];
        }
        let nVal = parseInt(subtree[1]);
        let dVal = 1;
        if (subtree[0] === 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        }
        // Update the current numerator and denominator
        if (term[0] === 'div') {
            const temp = nVal;
            nVal = dVal;
            dVal = temp;
        }
        numer *= (sign * nVal);
        denom *= dVal;
    }
    // Construct the output tree as a fraction, and then simplify before returning
    const tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    return numer < 0 ? fracSimpInt(['negative', tree])
        : fracSimpInt(tree);
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
    // By precondition, the input is simple numeric,
    // which means the base is guaranteed to be natural, or a negative thereof
    let basetree = operand[0];
    let sign = 1;
    if (basetree[0] === 'negative') {
        basetree = basetree[1];
        sign = -1;
    }
    let expFrac = [operand[1], ['natural', '1']];
    if (operand[1][0] === 'fraction') {
        [, ...expFrac] = operand[1];
    }
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate
    let reciprocFlag = false;
    const expFrac_entries = expFrac.entries();
    for (const [k, obj] of expFrac_entries) {
        if (obj[0] === 'negative') {
            reciprocFlag = !reciprocFlag;
            expFrac[k] = obj[1];
        }
    }
    // Evaluation
    const mtermArr = []; // construct as a mulchain, and then simplify later
    // work with absolute value of base for now, will see why later
    const bVal = parseInt(basetree[1]);
    const xNval = parseInt(expFrac[0][1]);
    const xDval = parseInt(expFrac[1][1]);
    // Watch out for any imaginary number case
    const imaginaryFlag = (sign === -1) && (xNval % 2 === 1) && (xDval % 2 === 0);
    // Factor out any integer result possible
    const xVal = Math.floor(xNval / xDval);
    if (Math.log(Number.MAX_SAFE_INTEGER) / Math.log(bVal) < xVal) {
        return ['power', ...operand];
    }
    let intRes = Math.pow(bVal, xVal);
    const rtRes = Math.pow(bVal, (xNval % xDval) / xDval);
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
        const subtree = [
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
        const intSign = Math.floor(xNval / xDval) % 2 === 0 ? 1 : sign;
        const rtSign = (xNval % xDval) % 2 === 0 ? 1 : sign;
        resSign = intSign * rtSign;
    } else {
        resSign = xNval % 2 === 0 ? 1 : sign;
    }
    let tree = array2ChainTree(mtermArr);
    if (reciprocFlag) {
        tree = ['fraction', ['natural', '1'], tree];
    }
    return resSign < 0 ? ['negative', tree]
        : tree;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function findDenominators(tree, unique = false, positive = false) {
    const denomArr = [];
    if (!Array.isArray(tree)) {
        return denomArr;
    }
    const [operator] = tree;
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        let denom = operand[1];
        if (positive && denom[0] === 'negative') {
            denom = denom[1];
        }
        denomArr.push(denom);
        return denomArr;
    }

    const [, ...operand] = tree;
    for (const tree of operand) {
        const subDenArr = findDenominators(tree, unique);
        for (const dtree of subDenArr) {
            let is_included = false;
            for (const v of denomArr) {
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
    return denomArr;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{a}{c}+\\frac{b}{c}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findDenominators(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// import {EuclidAlg} from '../rc/function_76.inc.js';

export function findGCF(tree = null) {
    let commonFactorArr = {
        const: ['natural', '1'],
        sym: []
    };
    if (!Array.isArray(tree)) {
        return commonFactorArr;
    }

    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            // common factor assumed to be positive
            return findGCF(tree[1]);
        }
        case 'fraction': {
            // only consider the numerator
            return findGCF(tree[1]);
        }
        case 'decimal': {
            // only consider the numerator
            return findGCF(fracDecimal(tree));
        }
        case 'rdecimal': {
            // only consider the numerator
            return findGCF(rdecToFrac(tree));
        }
        case 'natural': {
            commonFactorArr.const = tree;
            return commonFactorArr;
        }
        case 'variable': {
            commonFactorArr.sym.push(tree);
            return commonFactorArr;
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let constF = 1;
            const symFArr = [];
            for (const term of operand) {
                // only consider multiplications (divisions would end up in denominators)
                if (term[0] === 'mul') {
                    const subtree = term[1];
                    const subCFArr = findGCF(subtree);

                    if (JSON.stringify(subCFArr.const) !== JSON.stringify([])) {
                        constF *= parseInt(subCFArr.const[1]);
                    }
                    const subCFArr_sym = subCFArr.sym;
                    for (const symb of subCFArr_sym) {
                        let is_included = false;
                        for (const sym of symFArr) {
                            if (JSON.stringify(sym) === JSON.stringify(symb)) {
                                is_included = true;
                                break;
                            }
                        }
                        if (!is_included) {
                            symFArr.push(symb);
                        }
                    }
                }
            }

            commonFactorArr.const = ['natural', constF.toString()];
            commonFactorArr.sym = symFArr;
            return commonFactorArr;
        }
        case 'addchain':
        case 'equation':
        case 'inequality': {
            const [, ...operand] = tree;
            const operand_entries = operand.entries();
            for (const [key, term] of operand_entries) {
                // this is the case for inequality signs (e.g., 'le', 'ge')
                if (!Array.isArray(term)) {
                    continue;
                }
                const subtree = operator === 'addchain' ? term[1] : term;
                const subCFArr = findGCF(subtree);
                if (key === 0) {
                    // If this is the first term, just copy to commonFactorArr
                    commonFactorArr = subCFArr;
                } else {
                    // For numerical constants, update the array with GCF
                    const gcf = EuclidAlg(
                        parseInt(commonFactorArr.const[1]),
                        parseInt(subCFArr.const[1])
                    );

                    commonFactorArr.const = ['natural', gcf.toString()];
                    // For variables,
                    // only count the vars already in commonFactorArr['sym']
                    const symFArr = [];
                    const subCFArr_sym = subCFArr.sym;
                    const commonFactorArr_sym = commonFactorArr.sym;
                    for (const symb of subCFArr_sym) {
                        for (const symb_1 of commonFactorArr_sym) {
                            if (JSON.stringify(symb) === JSON.stringify(symb_1)) {
                                symFArr.push(symb);
                            }
                        }
                    }
                    commonFactorArr.sym = symFArr;
                }
            }
            return commonFactorArr;
        }
        default: {
            return commonFactorArr;
        }
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'c*c^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findGCF(tree_1);
console.log(JSON.stringify(tree_11.get('const'), null, 4));
console.log(JSON.stringify(tree_11.get('sym'), null, 4));
*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function findVars(tree, option = false) {
    if (!Array.isArray(tree)) {
        return [];
    }
    const varList = [];
    if (option === true) {
        if (isNumeric(tree)) {
            return [];
        }
        if (tree[0] === 'variable') {
            return [tree];
        }
        const [, ...operand] = tree;
        for (const term of operand) {
            const subtree = ['addchain', 'mulchain'].includes(tree[0]) ? term[1] : term;
            const subVarList = findVars(subtree, option);
            for (const variable of subVarList) {
                let is_included = false;
                for (const vari of varList) {
                    if (JSON.stringify(vari) === JSON.stringify(variable)) {
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

    const [operator] = tree;
    switch (operator) {
        case 'natural': {
            return varList;
        }
        case 'variable': {
            varList.push(tree);
            return varList;
        }
        case 'power': {
            if (findVars(tree[1], option).length > 0) {
                varList.push(tree);
            }
            return varList;
        }
        case 'negative': {
            return findVars(tree[1], option);
        }
        case 'mulchain': {
            const operand = tree.slice(1);
            let varTerm = [];
            for (const term of operand) {
                let subtree = term[1];
                if (subtree[0] === 'negative') {
                    subtree = subtree[1];
                }
                if (findVars(subtree, option).length > 0) {
                    varTerm.push([term[0], subtree]);
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
            return varList;
        }
        case 'addchain': {
            const [, ...operand] = tree;
            for (const term of operand) {
                let subtree = term[1];
                if (subtree[0] === 'negative') {
                    subtree = subtree[1];
                }
                const subVarList = findVars(subtree, option);
                for (const subtree of subVarList) {
                    let is_included = false;
                    for (const vari of varList) {
                        if (JSON.stringify(vari) === JSON.stringify(subtree)) {
                            is_included = true;
                            break;
                        }
                    }
                    if (!is_included) {
                        varList.push(subtree);
                    }
                }
            }
            return varList;
        }
        default: {
            return varList;
        }
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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

        /*
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
        */
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
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

import { fracSimpVar } from '../rc/function_77.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';
import { mulNegative } from '../rc/function_160.inc.js';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function multFactor(tree, fterm, simplifyFrac = false) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (!Array.isArray(fterm) ||
        fterm.length === 0 ||
        !['mul', 'div'].includes(fterm[0])) {
        return tree;
    }
    switch (tree[0]) {
        case 'fraction': {
            const idx = fterm[0] === 'div' ? 2 : 1;
            (simplifyFrac && JSON.stringify(fterm[1]) === JSON.stringify(tree[3 - idx])) ? tree[3 - idx] = ['natural', '1']
            : tree[idx] = combine2ChainTree(fterm[1], tree[idx], 'mul');
            tree = mulNegative(fracSimpVar(fracSimpInt(fracNegative(tree))));
            return simplifyFrac ? fracSimpVar(fracSimpInt(fracNegative(tree)))
                : tree;
        }
        case 'addchain': {
            const newtree = ['addchain'];
            const [, ...operand] = tree;
            for (const aterm of operand) {
                aterm[1] = multFactor(aterm[1], fterm, simplifyFrac);
                newtree.push(aterm);
            }
            tree = addAdjacentSigns(newtree);
            return simplifyFrac ? fracSimpVar(fracSimpInt(fracNegative(tree)))
                : tree;
        }
        default: {
            fterm[0] === 'mul' ? tree = combine2ChainTree(fterm[1], tree, 'mul')
            : tree = ['fraction', tree, fterm[1]];
            tree = mulNegative(tree);
            return simplifyFrac ? fracSimpVar(fracSimpInt(fracNegative(tree)))
            : tree;
        }
    }
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
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function termExists(term, tree, recursive = true, excPolyTerm = false) {
    if (JSON.stringify(term) === JSON.stringify(tree)) {
        return true;
    }
    if (!Array.isArray(tree)) {
        return false;
    }

    if (recursive === false) {
        const [, ...operand] = tree;
        for (const subterm of operand) {
            let subtree;
            ['addchain', 'mulchain'].includes(tree[0]) ? subtree = subterm[1]
            : subtree = subterm;
            if (JSON.stringify(term) === JSON.stringify(subtree)) {
                if (tree[0] === 'power' && excPolyTerm) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
    for (const subtree of tree) {
        if (termExists(term, subtree, recursive, excPolyTerm)) {
            const [, ...operand_subtree] = subtree;
            let is_included = false;
            for (const term_subtree of operand_subtree) {
                if (JSON.stringify(term_subtree) === JSON.stringify(term)) {
                    is_included = true;
                    break;
                }
            }
            if (subtree[0] === 'power' && excPolyTerm && is_included) {
                return false;
            }
            return true;
        }
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/*
TRUE if the given input is a valid instance of Laco MathTree; FALSE otherwise

Parameters:
tree: Could be any PHP object

Returns:
A boolean value

Author: epark
*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function validMathTree(tree) {
    if (!Array.isArray(tree) || tree.length === 0) {
        return false;
    }

    switch (tree[0]) {
        case 'setname': {
            return true; // debug this later
        }
        case 'infinity': {
            return tree.length === 1;
        }
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
        case 'tan': {
            return tree.length === 2 && validMathTree(tree[1]);
        }
        case 'fraction':
        case 'power':
        case 'nthroot': {
            return tree.length === 3 && validMathTree(tree[1]) && validMathTree(tree[2]);
        }
        case 'subscript': {
            if (tree.length !== 3 || tree[1][0] !== 'variable') {
                return false;
            }
            return validMathTree(tree[1]) && validMathTree(tree[2]);
        }
        case 'mfraction': {
            return (
                tree.length === 4 &&
                validMathTree(tree[1]) && validMathTree(tree[2]) && validMathTree(tree[3])
            );
        }
        case 'natural': {
            if (tree.length !== 2) {
                return false;
            }
            const arr = tree[1].toString().split('');
            const range = [];
            for (let i = 0; i <= 9; i++) {
                range.push(i.toString());
            }
            for (const term of arr) {
                if (!range.includes(term)) {
                    return false;
                }
            }
            return true;
        }
        case 'decimal': {
            if (tree.length !== 2) {
                return false;
            }
            if (tree[1].indexOf('.') === -1) {
                return false;
            }
            const letters = tree[1].split('');
            const range = [];
            for (let i = 0; i <= 9; i++) {
                range.push(i.toString());
            }
            for (const letter of letters) {
                if (!range.includes(letter) && letter !== '.') {
                    return false;
                }
            }
            return true;
        }
        case 'rdecimal': {
            if (![3, 4].includes(tree.length)) {
                return false;
            }
            const tree_length = tree.length;
            for (let k = 1; k <= tree_length - 1; k++) {
                if (!validMathTree(['natural', tree[k]])) {
                    return false;
                }
            }
            return true;
        }
        case 'anything':
        case 'variable': {
            const [, ...operand] = tree;
            for (const term of operand) {
                if ('0'.charCodeAt(0) <= term.charCodeAt(0) && term.charCodeAt(0) <= '9'.charCodeAt(0)) {
                    return false;
                }
            }
            return true;
        }
        case 'addchain': {
            if (tree.length === 1) {
                return false;
            }
            const [, ...operand] = tree;
            for (const term of operand) {
                if (term.length !== 2 ||
                    !['add', 'sub', 'addsub', 'subadd'].includes(term[0]) ||
                    !validMathTree(term[1])) {
                    return false;
                }
            }
            return true;
        }
        case 'mulchain': {
            if (tree.length === 1) {
                return false;
            }
            const [, ...operand] = tree;
            for (const term of operand) {
                if (term.length !== 2 || !['mul', 'div'].includes(term[0]) || !validMathTree(term[1])) {
                    return false;
                }
            }
            return true;
        }
        case 'equation': {
            const [, ...operand] = tree;
            for (const subtree of operand) {
                if (!validMathTree(subtree)) {
                    return false;
                }
            }
            return true;
        }
        case 'inequality': {
            const [, ...operand] = tree;
            for (const subtree of operand) {
                if (!validMathTree(subtree) && !['lt', 'gt', 'le', 'ge'].includes(subtree)) {
                    return false;
                }
            }
            return true;
        }
        case 'interval': {
            return tree.length !== 5 ? false
                : !['[', '('].includes(tree[1]) || ![']', ')'].includes(tree[4]) ? false
                : validMathTree(tree[2]) && validMathTree(tree[3])
        }
        default: {
            return false;
        }
    }
}

export function utf8_ord(ch) {
    const len = ch.length;
    if (len <= 0) {
        return false;
    }
    const h = ch[0].charCodeAt(0);
    return h <= 0x7F ? h
        : h < 0xC2 ? false
        : h <= 0xDF && len > 1 ? (h & 0x1F) << 6 | (ch[1].charCodeAt(0) & 0x3F)
        : h <= 0xEF && len > 2 ? (h & 0x0F) << 12 | (ch[1].charCodeAt(0) & 0x3F) << 6 | (ch[2].charCodeAt(0) & 0x3F)
        : h <= 0xF4 && len > 3 ? (h & 0x0F) << 18 | (ch[1].charCodeAt(0) & 0x3F) << 12 | (ch[2].charCodeAt(0) & 0x3F) << 6 | (ch[3].charCodeAt(0) & 0x3F)
        : h
}
/*
let result = utf8_ord('하');
//result = utf8_ord('10000');
console.log(JSON.stringify(result, null, 4));
*/
