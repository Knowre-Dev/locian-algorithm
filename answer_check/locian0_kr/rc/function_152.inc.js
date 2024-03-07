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
    const [operator, ...operand] = tree;
    switch (operator) {
        // 160828 larwein - inequality patch
        case 'inequality': {
            // 20180817 epark - Leave alone inequalities with infinity sign'
            const infs = [JSON.stringify(['infinity']), JSON.stringify(['negative', ['infinity']])];
            if (infs.includes(JSON.stringify(operand[0])) || infs.includes(JSON.stringify(operand[4]))) {
                return tree;
            }
            let newTree = ['inequality'];
            if (['gt', 'ge'].includes(operand[1])) {
                const opernad_length = operand.length;
                const max = Math.floor(opernad_length / 2);
                const term_last = operand[opernad_length - 1];
                for (let i = 0; i < max; i++) {
                    newTree = [...newTree,
                        evaluateEx_new(['addchain', ['add', operand[2 * i]], ['sub', term_last]]),
                        operand[2 * i + 1]
                    ];
                }
                return [...newTree, ['natural', '0']];
            }
            const operand_reverse = operand.reverse();
            const max = Math.floor(operand_reverse.length / 2);
            for (let i = 0; i < max; i++) {
                newTree = [...newTree,
                    evaluateEx_new(['addchain', ['add', operand_reverse[2 * i]], ['sub', operand[0]]]),
                    operand_reverse[2 * i + 1] === 'lt'
                        ? 'gt'
                        : 'ge'
                ];
            }
            return [...newTree, ['natural', '0']];
        }
        default: {
            let newTree = ['eval'];
            const seedArr = [-2, -1, 1, 2, 3];
            for (const seed of seedArr) {
                const eval_tree = evaluateExWithSeed(tree, seed);
                // If the value is too large for numerical evaluation
                // so that any of the five substitutions produce INF or NAN,
                // then just return the original tree

                if (Array.isArray(eval_tree)) {
                    const [eval_0, ...eval_1] = eval_tree;
                    const condition_1 = ['equation', 'inequality', 'neq', 'ratio', 'orchain'].includes(eval_0);
                    const condition_2 = eval_1.some(term => !isFinite(term[0]) || isNaN(term[0]) || !isFinite(term[1]) || isNaN(term[1]));
                    const condition_3 = !isFinite(eval_0) || isNaN(eval_0) || !isFinite(eval_1[0]) || isNaN(eval_1[0]);
                    if ((condition_1 && condition_2) || (!condition_1 && condition_3)) {
                        return tree
                    }
                }
                newTree = [...newTree, eval_tree];
            }
            return newTree;
        }
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x<3<2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateEx_new(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
/*
A quick helper function for naming variables for lookup table
*/
/*
export function getVarName(variable) {
    const [, ...varname] = variable;
    return varname.length > 1
        ? ('(' + varname.join() + ')')
        : varname[0].toString();
}
*/
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
    //
    // function

    //

    let varNames = [];
    for (const variable of varList) {
        // Use a helper function to set variable name string for lookup table
        // (will also be used at evaluateVariable() to find the correct entry)
        const [, ...variable_1] = variable;
        const varname = variable_1.length > 1
            ? '(' + variable_1.join() + ')'
            : variable_1[0].toString();
        if (varNames.every(v_name => JSON.stringify(v_name) !== JSON.stringify(varname))) {
            varNames = [...varNames, varname];
        }
    }

    // Sort the variable names
    // This ensures that the same variable is assigned with the same value
    // Regardless of when it was added to the varNames array
    varNames.sort();

    const maxVal = Number.MAX_SAFE_INTEGER;
    const rangeWidth = 10;
    const bound = rangeWidth / 2;
    if (JSON.stringify(lookupTable) === '{}') {
        varNames.forEach(varname => {
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
                    // Scale the random numbers appropriately (incl. make them into float values)
                    let randRe = Math.floor((Math.cos(seed) * Number.MAX_SAFE_INTEGER)) / maxVal;
                    let randIm = Math.floor((Math.sin(seed) * Number.MAX_SAFE_INTEGER)) / maxVal;
                    // EDIT 2018.08.23:
                    // Ensure that x in one tree is assigned a different value than y in another tree
                    // Even when each variable is the only variable present in their respective trees
                    // RATIONALE: Without this, 3x+3y-3x and 3x+3y-3y will evaluate to same
                    // after all the prior transformations inside the new Equivalent preset,
                    // which must include mulZero to prevent PHP error
                    // caused at lines 1808,1809,1811,1812

                    const asciiBound = utf8_ord('a') + 13; // Middle of 'a' - 'z'
                    randRe = (randRe + utf8_ord(varname) - asciiBound) * rangeWidth - bound;
                    randIm = (randIm + utf8_ord(varname) - asciiBound) * rangeWidth - bound;
                    // Round to 4 decimal places just for efficiency's sake
                    // (otherwise running the new Equivalent preset slows down too much)
                    randRe = parseFloat(randRe.toFixed(4));
                    randIm = parseFloat(randIm.toFixed(4));

                    // Initialize the new complex value
                    newZ = [randRe, randIm];
                    break;
                }
            }
            lookupTable[varname] = newZ;
        });
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
            const varname = newOperand.length > 1
                ? '(' + newOperand.join() + ')'
                : newOperand[0].toString();
            return Object.keys(lookupTable).some(key => JSON.stringify(key) === JSON.stringify(varname))
                ? lookupTable[varname]
                : null;

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
Refactored this routine to use instead
a lookup table constructed at evaluateExWithSeed(),
which is passed as an argument
*/
/*
export function evaluateVariable(variable, lookupTable = {}) {
    const varname = getVarName(variable);
    return Object.keys(lookupTable).some(key => JSON.stringify(key) === JSON.stringify(varname))
        ? lookupTable[varname]
        : null;
}
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
            return Array.isArray(operand[0][0]) || Array.isArray(operand[0][1])
                ? [0, 0]
                : [-operand[0][0], -operand[0][1]];
        }
        case 'addchain': {
            return operand.reduce((sum, term) => Array.isArray(term)
                ? [!isNaN(term[0])
                    ? sum[0] + term[0]
                    : sum[0],
                !isNaN(term[1])
                    ? sum[1] + term[1]
                    : sum[1]]
                : sum,
            [0, 0]);
        }
        case 'div': {
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            const modulusSq = Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2);
            return [operand[0][0] / modulusSq, -operand[0][1] / modulusSq];
        }
        case 'mulchain': {
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            return operand.reduce((a, b) =>
                [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], [1, 0]);
        }
        case 'fraction': {
            if (isNaN(operand[0][0]) || isNaN(operand[0][1]) || isNaN(operand[1][0]) || isNaN(operand[1][1])) {
                return [1, 1];
            }
            const [[numerRe, numerIm], [denomRe, denomIm]] = operand;
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
            return powComplex_inLocian(operand[1], [operand[0][0] / modulusSq, -operand[0][1] / modulusSq]);
        }
        case 'absolute': {
            const modulus = Math.sqrt(Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2));
            return [modulus, 0];
        }
        case 'rdecimal': {
            const intg = operand[0];
            const num = operand[1] === ''
                ? operand[1] + operand[2]
                : parseFloat(operand[1] + (operand[2] - operand[1]).toString());
            const denum = '9'.repeat(operand[2].length) + '0'.repeat(operand[1].length);
            return [intg + (num / denum), 0];
        }
        case 'subscript': {
            return [operand[0][0] + 2 * operand[1][1], operand[0][1] + 2 * operand[1][0]];
        }
        case 'ln': {
            const modulus = Math.sqrt(Math.pow(operand[0][0], 2) + Math.pow(operand[0][1], 2));

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
            const term_add = typeof operand[1] !== 'undefined'
                ? evaluateOperation('ln', [operand[1]], seed, lookupTable)
                : evaluateOperation('ln', [[10, 0]], seed, lookupTable);
            const newOperand = [evaluateOperation('ln', [operand[0]], seed, lookupTable), term_add];
            return evaluateOperation('fraction', newOperand, seed, lookupTable);
        }
        case 'summation': {
            const is_sum = operand[0][0] === 'equation' && operand[0][1][0] === 'variable' && operand[0][2][0] === 'natural' && operand[1][0] === 'natural';
            if (is_sum) {
                let sum = [0, 0];
                const [[, vari, [, min]], [, max]] = operand;
                const vari_1 = JSON.stringify(vari);
                for (let ind = min; ind <= max; ind++) {
                    const number = JSON.stringify(['natural', ind.toString()]);
                    const operand_2 = JSON.stringify(operand[2]);
                    let newEx = JSON.parse(operand_2.replaceAll(vari_1, number));
                    newEx = evaluateExWithSeed(newEx, seed, lookupTable);
                    sum = evaluateOperation('addchain', [sum, newEx], seed, lookupTable);
                }
                return sum;
            }
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
/*
export function replace(tree, from, to) {
    if (JSON.stringify(tree) === JSON.stringify(from)) {
        return to;
    }
    const [operator, ...operand] = tree;
    const newOperand = operand.map(term =>
        Array.isArray(term)
            ? replace(term, from, to)
            : term);
    return [operator, ...newOperand];
}
*/
/*
Copied mostly from checkmath.php,
with comments added by epark
*/
export function powComplex_inLocian(A, B) {
    if (A[0] === A[1] === 0) {
        return B[0] === B[1] === 0
            ? [1, 0]
            : [0, 0];
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
    const theta = (A[1] === 0 && A[0] > 0)
        ? 0
        : A[1] === 0 && A[0] < 0
            ? Math.PI
            : A[1] > 0
                ? Math.acos(A[0] / r)
                : 2 * Math.PI - Math.acos(A[0] / r);
    const [c, d] = B;
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
/*
export function fracOfPow2PowOfFrac(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const [operator, ...operand] = tree;
    const is_fraction = operator === 'fraction' && operand[0][0] === 'power' === operand[1][0] && JSON.stringify(operand[0][2]) === JSON.stringify(operand[1][2])
    // Currently exponents must also be the same; modify if needed
    return is_fraction
        ? ['power', ['fraction', operand[0][1], operand[1][1]], operand[0][2]]
        : [operator, operand.map(term => fracOfPow2PowOfFrac(term))];
}
*/
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
    if (!Array.isArray(arr) || arr.length === 0 || arr[0].length === 0) {
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
        let numericArr = [];
        let nonnumericArr = [];
        arr.forEach(term => {
            const [, subtree] = term;
            isNumeric(subtree, false, false)
                ? numericArr = [...numericArr, [term[0], subtree]]
                : nonnumericArr = [...nonnumericArr, [term[0], subtree]];
        });
        let numRes = array2ChainTree(numericArr);
        arr = nonnumericArr;
        if (numRes.length > 0) {
            numRes = evalNumericValues(numRes);
            if (operator === 'addchain') {
                if (arr.length === 0 || JSON.stringify(numRes) !== JSON.stringify(['natural', '0'])) {
                    arr = numRes[0] === 'negative'
                        ? [['sub', numRes[1]], ...arr]
                        : [['add', numRes], ...arr];
                }
            } else {
                arr = [['mul', numRes], ...arr];
            }
        }
    }

    // If there is only one operand, just return that operand
    return arr.length === 1
        ? ['addsub', 'subadd'].includes(arr[0][0])
            ? ['pm', arr[0][1]]
            : arr[0][0] === 'sub'
                ? ['negative', arr[0][1]]
                : arr[0][0] === 'div'
                    ? ['fraction', ['natural', '1'], arr[0][1]]
                    : arr[0][1]
        : [operator, ...arr];
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
/*
export function chainTree2Array(tree, subtype = 'mul') {

    // if (!Array.isArray(tree) || tree.length === 0) {
    //    return tree;
    //}

    // Make sure to return array of array(s) as the final output
    return (tree[0] === 'addchain' && ['add', 'sub', 'addsub', 'subadd'].includes(subtype))
        ? tree.slice(1)
        : (tree[0] === 'mulchain' && ['mul', 'div'].includes(subtype))
            ? tree.slice(1)
            : [[subtype, tree]];
}
*/
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
    if (!Array.isArray(tree1) || tree1.length === 0 || !Array.isArray(tree2) || tree2.length === 0) {
        return false;
    }

    // Set subtype if not provided (see the note above)
    const [operator_1, ...operand_1] = tree1;
    const [operator_2, ...operand_2] = tree2;
    if (subtype === null) {
        subtype = [operator_1, operator_2].includes('addchain')
            ? 'add'
            : 'mul'
    }
    const is_subtype_add = ['add', 'sub', 'addsub', 'subadd'].includes(subtype);
    const is_subtype_mul = ['mul', 'div'].includes(subtype)
    const tree1_1 = (operator_1 === 'addchain' && is_subtype_add) || (operator_1 === 'mulchain' && is_subtype_mul)
        ? operand_1
        : [[subtype, tree1]];
    const tree2_1 = (operator_2 === 'addchain' && is_subtype_add) || (operator_2 === 'mulchain' && is_subtype_mul)
        ? operand_2
        : [[subtype, tree2]];
    return array2ChainTree([...tree1_1, ...tree2_1]);
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
import { fracSimpInt } from '../rc/function_76.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';

export function evalNumericValues(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'natural':{
            return [operator, operand[0]];
        }
        case 'decimal': {
            return evalNumericValues(fracDecimal([operator, operand[0]]));
        }
        case 'rdecimal': {
            return evalNumericValues(rdecToFrac([operator, operand[0]]));
        }
        case 'negative': {
            const operand_0 = evalNumericValues(operand[0]);
            return operand_0[0] === 'negative'
                ? operand_0[1]
                : [operator, operand_0];
        }
        case 'absolute': {
            const operand_0 = evalNumericValues(operand[0]);
            return operand_0[0] === 'negative'
                ? operand_0[1]
                : operand_0;
        }
        case 'fraction': {
            return fracSimpInt(fracNegative(fracComplex(tree)));
        }
        case 'addchain': {
            return evalNumericValues_addChain(operand);
        }
        case 'mulchain': {
            return evalNumericValues_mulChain(operand);
        }
        case 'power': {
            return evalNumericValues_power(operand);
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
    let operand_11 = [];
    let operand_12 = [];
    operand.forEach(term => {
        ['add', 'sub'].includes(term[0])
            ? operand_11 = [...operand_11, term]
            : operand_12 = [...operand_12, ['addsub', term[1]]];
    });
    if (operand_11.length === 0) {
        return ['addchain', ...operand_12];
    }
    let numer = 0;
    let denom = 1;
    operand_11.forEach(term_1 => {
        let [operator_2, operand_2] = term_1;
        let sign = operator_2 === 'sub'
            ? -1
            : 1;
        if (operator_2 === 'negative') {
            sign *= -1;
            [, operand_2] = operand_2;
        }

        let [operator_3, nVal] = operand_2;
        let dVal = 1;
        if (operator_3 === 'fraction') {
            [, [, nVal], [, dVal]] = operand_2;
        }
        denom *= dVal;
        numer = numer * dVal + sign * denom * nVal / dVal;
    });
    let A = numer;
    let B = denom;
    while (B !== 0) {
        [A, B] = [B, A % B];
    }
    const gcd = A;
    numer /= gcd;
    denom /= gcd;

    // Construct the output tree as a fraction, and then simplify before returning
    const tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    const op = numer > 0
        ? 'add'
        : 'sub';
    return ['addchain', [op, fracSimpInt(tree)], ...operand_12];
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
    operand.forEach(term => {
        let [operator, operand] = term;
        // Account for any negative
        if (operand[0] === 'negative') {
            numer *= -1;
            [, operand] = operand;
        }
        let [operator_1, nVal] = operand;
        let dVal = 1;
        if (operator_1 === 'fraction') {
            [, [, nVal], [, dVal]] = operand;
        }
        if (operator === 'div') {
            [nVal, dVal] = [dVal, nVal];
        }
        numer *= nVal;
        if (numer === 0) {
            return ['natural', '0'];
        }
        denom *= dVal;
    });
    // Construct the output tree as a fraction, and then simplify before returning
    const tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    return numer < 0
        ? fracSimpInt(['negative', tree])
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
    let [base, exp] = operand;
    let sign = 1;
    if (base[0] === 'negative') {
        [, base] = base;
        sign = -1;
    }
    let expFrac = [exp, ['natural', '1']];
    if (exp[0] === 'fraction') {
        [, ...expFrac] = exp;
    }
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate
    let reciprocFlag = false;
    expFrac.forEach((obj, k) => {
        if (obj[0] === 'negative') {
            reciprocFlag = !reciprocFlag;
            [, expFrac[k]] = obj;
        }
    });
    // Evaluation
    let mtermArr = []; // construct as a mulchain, and then simplify later
    // work with absolute value of base for now, will see why later
    const [, bVal] = base;
    const [[, xNval], [, xDval]] = expFrac;
    // Factor out any integer result possible
    const xVal = Math.floor(xNval / xDval);
    if (Math.log(Number.MAX_SAFE_INTEGER) / Math.log(bVal) < xVal) {
        return ['power', ...operand];
    }
    const intRes = Math.pow(bVal, xVal);
    const rtRes = Math.pow(bVal, (xNval % xDval) / xDval);
    // Here, pow() quietly returns FALSE for inputs like pow(-1, 1 / 2)
    // that was why we work with the absolute value
    // and deal with the sign last
    // so that we can put imaginary unit i properly

    // Add the mul terms to mtermArr
    if (rtRes === Math.floor(rtRes)) {
        mtermArr = [...mtermArr, ['mul', ['natural', (intRes * rtRes).toString()]]];
    } else {
        if (intRes !== 1) {
            mtermArr = [...mtermArr, ['mul', ['natural', intRes.toString()]]];
        }
        const subtree = [
            'power',
            ['natural', bVal.toString()],
            ['fraction', ['natural', (xNval % xDval).toString()], ['natural', xDval.toString()]]
        ];
        mtermArr = [...mtermArr, ['mul', subtree]];
    }
    // Deal with imaginary number case and negative result case here
    // Watch out for any imaginary number case
    const imaginaryFlag = sign === -1 && xNval % 2 === 1 && xDval % 2 === 0;
    let resSign;
    if (imaginaryFlag) {
        mtermArr = [...mtermArr, ['mul', ['variable', 'i']]];
        resSign = Math.floor(xNval / xDval) % 2 === 0
            ? -1
            : 1;
    } else {
        resSign = xNval % 2 === 0
            ? 1
            : sign;
    }
    const tree = reciprocFlag
        ? ['fraction', ['natural', '1'], array2ChainTree(mtermArr)]
        : array2ChainTree(mtermArr);
    return resSign < 0
        ? ['negative', tree]
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
    if (!Array.isArray(tree)) {
        return [];
    }
    const [operator, ...operand] = tree;
    if (operator === 'fraction') {
        let [, denom] = operand;
        if (positive && denom[0] === 'negative') {
            [, denom] = denom;
        }
        return [denom];
    }

    let denomArr = [];
    operand.forEach(term => {
        const subDenArr = findDenominators(term, unique);
        denomArr = [...denomArr,
            ...subDenArr.reduce((terms, dterm) => !unique && denomArr.some(value => JSON.stringify(value) === JSON.stringify(dterm))
                ? [...terms, dterm, dterm]
                : [...terms, dterm], denomArr)];
    });
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

export function findGCF(tree = null) {
    let commonFactorArr = {
        const: ['natural', '1'],
        sym: []
    };
    if (!Array.isArray(tree)) {
        return commonFactorArr;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'fraction': // only consider the numerator
        case 'negative': { // common factor assumed to be positive
            return findGCF(operand[0]);
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
            commonFactorArr.sym = [...commonFactorArr.sym, tree];
            return commonFactorArr;
        }
        case 'mulchain': {
            let constF = 1;
            let symFArr = [];
            operand.forEach(term => {
                // only consider multiplications (divisions would end up in denominators)
                if (term[0] === 'mul') {
                    const subCFArr = findGCF(term[1]);
                    if (subCFArr.const.length !== 0) {
                        constF *= subCFArr.const[1];
                    }
                   symFArr = subCFArr.sym.reduce((terms, symb) => terms.every(sym => JSON.stringify(sym) !== JSON.stringify(symb))
                        ? [...terms, symb]
                        : terms, symFArr);
                }
            });

            commonFactorArr.const = ['natural', constF.toString()];
            commonFactorArr.sym = symFArr;
            return commonFactorArr;
        }
        case 'addchain':
        case 'equation':
        case 'inequality': {
            const [term_0, ...operand_1] = operand;
            if (Array.isArray(term_0)) {
                const subtree = operator === 'addchain'
                    ? term_0[1]
                    : term_0;
                commonFactorArr = findGCF(subtree);
            }

            operand_1.forEach(term => {
                // this is the case for inequality signs (e.g., 'le', 'ge')
                if (Array.isArray(term)) {
                    const subtree = operator === 'addchain'
                        ? term[1]
                        : term;
                    const subCFArr = findGCF(subtree);
                    // For numerical constants, update the array with GCF
                    let A = parseInt(commonFactorArr.const[1]);
                    let B = parseInt(subCFArr.const[1]);
                    while (B !== 0) {
                        [A, B] = [B, A % B];
                    }
                    const gcf = A;
                    commonFactorArr.const = ['natural', gcf.toString()];
                    // For variables,
                    // only count the vars already in commonFactorArr['sym']
                    commonFactorArr.sym = subCFArr.sym.reduce((a, b) => [...a, ...commonFactorArr.sym.filter(symb_1 => JSON.stringify(b) === JSON.stringify(symb_1))], []);
                }
            });
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
    const [operator, ...operand] = tree;
    if (option) {
        if (isNumeric(tree)) {
            return [];
        }
        if (operator === 'variable') {
            return [tree];
        }
        let varList = [];
        // const [, ...operand] = tree;
        operand.forEach(term => {
            const subtree = ['addchain', 'mulchain'].includes(tree[0])
                ? term[1]
                : term;
            const subVarList = findVars(subtree, option);
            varList = [...varList, ...subVarList.filter(variable => varList.every(vari => (JSON.stringify(vari) !== JSON.stringify(variable))))];
        });
        return varList;
    }

    switch (operator) {
        case 'natural': {
            return [];
        }
        case 'variable': {
            return [tree];
        }
        case 'power': {
            return findVars(operand[0], option).length > 0
                ? [tree]
                : [];
        }
        case 'negative': {
            return findVars(operand[0], option);
        }
        case 'mulchain': {
            let varTerm = [];
            operand.forEach(term => {
                let [, subtree] = term;
                if (subtree[0] === 'negative') {
                    [, subtree] = subtree;
                }
                if (findVars(subtree, option).length > 0) {
                    varTerm = [...varTerm, [term[0], subtree]];
                    // This way, same variable multiplied twice (e.g., ['variable', 'x'])
                    // will be parsed as a mulchain
                    // (e.g., ['mulchain', ['mul', ['variable', 'x']], ['mul', ['variable', 'x']]])
                    // rather than just as one variable (e.g., ['variable', 'x'])
                }
            });
            varTerm = array2ChainTree(varTerm);
            return varTerm.length > 0
                ? [varTerm]
                : [];
        }
        case 'addchain': {
            let varList = [];
            operand.forEach(term => {
                let [, subtree] = term;
                if (subtree[0] === 'negative') {
                    [, subtree] = subtree;
                }
                const subVarList = findVars(subtree, option);
                varList = [...varList, ...subVarList.filter(subtree => varList.every(vari => JSON.stringify(vari) !== JSON.stringify(subtree)))];
            });
            return varList;
        }
        default: {
            return [];
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
    const [operator, ...operand] = tree;
    if (operator === 'absolute') {
        return isNumeric(operand[0]);
    }
    if (operator === 'negative') {
        return !excNegative && isNumeric(operand[0]);
    }

    let fracIsNumeric = operator === 'fraction';
    let powIsNumeric = operator === 'power';
    if (recursive) {
        // The second term in logical AND evaluates only if tree is a fraction
        // fracIsNumeric = fracIsNumeric && isNumeric(tree[1], excNegative, recursive);
        const is_numeric = isNumeric(operand[0], excNegative, recursive) && isNumeric(operand[1], excNegative, recursive);
        fracIsNumeric &&= is_numeric;
        // The second term in logical AND evaluates only if tree is a power
        powIsNumeric &&= is_numeric;
    } else {
        fracIsNumeric &&= operand[0][0] === 'natural' && operand[1][0] === 'natural';
        powIsNumeric &&= (operand[0][0] === 'natural' || (operand[0][0] === 'negative' && operand[0][1][0] === 'natural')) && operand[1][0] === 'natural';

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
    return ['natural', 'decimal', 'rdecimal'].includes(operator) || fracIsNumeric || powIsNumeric;
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
    if (!Array.isArray(tree) || !Array.isArray(fterm) || fterm.length === 0 || !['mul', 'div'].includes(fterm[0])) {
        return tree;
    }
    const [operator, ...operand] = tree;
    const frac_function = tree_1 => fracSimpVar(fracSimpInt(fracNegative(tree_1)));
    switch (operator) {
        case 'fraction': {
            const idx = fterm[0] === 'div'
                ? 1
                : 0;
            simplifyFrac && JSON.stringify(fterm[1]) === JSON.stringify(operand[1 - idx])
                ? operand[1 - idx] = ['natural', '1']
                : operand[idx] = combine2ChainTree(fterm[1], operand[idx], 'mul');
            tree = mulNegative(frac_function([operator, ...operand]));
            return simplifyFrac
                ? frac_function(tree)
                : tree;
        }
        case 'addchain': {
            let newtree = ['addchain'];
            operand.forEach(aterm => {
                aterm[1] = multFactor(aterm[1], fterm, simplifyFrac);
                newtree = [...newtree, aterm];
            });
            tree = addAdjacentSigns(newtree);
            return simplifyFrac
                ? frac_function(tree)
                : tree;
        }
        default: {
            tree = fterm[0] === 'mul'
                ? combine2ChainTree(fterm[1], tree, 'mul')
                : ['fraction', tree, fterm[1]];
            tree = mulNegative(tree);
            return simplifyFrac
                ? frac_function(tree)
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
    const term_string = JSON.stringify(term);
    if (term_string === JSON.stringify(tree)) {
        return true;
    }
    if (!Array.isArray(tree)) {
        return false;
    }

    if (recursive === false) {
        const [operator, ...operand] = tree;
        return operand.some(term => ['addchain', 'mulchain'].includes(operator)
                ? JSON.stringify(term[1]) === term_string
                : JSON.stringify(term) === term_string)
            ? !(operator === 'power' && excPolyTerm)
            : false;
    }
    for (const subtree of tree) {
        if (termExists(term, subtree, recursive, excPolyTerm)) {
            const [operator_subtree, ...operand_subtree] = subtree;
            return operand_subtree.some(term_subtree => JSON.stringify(term_subtree) === term_string)
                ? !(operator_subtree === 'power' && excPolyTerm)
                : true;
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
    const [operator, ...operand] = tree;
    switch (operator) {
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
            return tree.length === 2 && validMathTree(operand[0]);
        }
        case 'fraction':
        case 'power':
        case 'nthroot': {
            return tree.length === 3 && validMathTree(operand[0]) && validMathTree(operand[1]);
        }
        case 'subscript': {
            return tree.length !== 3 || operand[0][0] !== 'variable'
                ? false
                : validMathTree(operand[0]) && validMathTree(operand[1]);
        }
        case 'mfraction': {
            return tree.length === 4 && validMathTree(operand[0]) && validMathTree(operand[1]) && validMathTree(operand[2]);
        }
        case 'natural': {
            return tree.length !== 2
                ? false
                : /^\d+$/.test(operand[0]);
        }
        case 'decimal': {
            return tree.length !== 2
                ? false
                : operand[0].indexOf('.') === -1 && /^-?\d+(\.\d+)?$/.test(operand[0]);
        }
        case 'rdecimal': {
            return [3, 4].includes(tree.length)
                ? false
                : operand.evey(term => validMathTree(['natural', term]));
        }
        case 'anything':
        case 'variable': {
            return !operand.some(term => ('0'.charCodeAt(0) <= term.charCodeAt(0) && term.charCodeAt(0) <= '9'.charCodeAt(0)));
        }
        case 'addchain': {
            return tree.length === 1
                ? false
                : operand.every(term => (term.length === 2 && ['add', 'sub', 'addsub', 'subadd'].includes(term[0]) && validMathTree(term[1])));
        }
        case 'mulchain': {
            return tree.length === 1
                ? false
                : operand.every(term => (term.length === 2 && ['mul', 'div'].includes(term[0]) && validMathTree(term[1])));
        }
        case 'equation': {
            return operand.every(term => validMathTree(term));
        }
        case 'inequality': {
           return operand.every(term => (validMathTree(term) || ['lt', 'gt', 'le', 'ge'].includes(term)));
        }
        case 'interval': {
            return tree.length !== 5
                ? false
                : !(['[', '('].includes(operand[0]) && [']', ')'].includes(operand[3]))
                    ? false
                    : validMathTree(operand[1]) && validMathTree(operand[2])
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
    return h <= 0x7F
        ? h
        : h < 0xC2
            ? false
            : h <= 0xDF && len > 1
                ? (h & 0x1F) << 6 | (ch[1].charCodeAt(0) & 0x3F)
                : h <= 0xEF && len > 2
                    ? (h & 0x0F) << 12 | (ch[1].charCodeAt(0) & 0x3F) << 6 | (ch[2].charCodeAt(0) & 0x3F)
                    : h <= 0xF4 && len > 3
                        ? (h & 0x0F) << 18 | (ch[1].charCodeAt(0) & 0x3F) << 12 | (ch[2].charCodeAt(0) & 0x3F) << 6 | (ch[3].charCodeAt(0) & 0x3F)
                        : h
}

/*
let result = utf8_ord('하');
//result = utf8_ord('10000');
console.log(JSON.stringify(result, null, 4));
*/
