/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable camelcase */
// import { fracDecimal } from '../rc/function_49.inc.js';
// import { fracNegative } from '../rc/function_53.inc.js';
// import { fracComplex } from '../rc/function_69.inc.js';
// import { fracSimpInt } from '../rc/function_76.inc.js';
// import { rdecToFrac } from '../rc/function_78.inc.js';
// import { array2ChainTree, findVars, isNumeric } from '../rc/sub_functions.js';
import { findVars } from '../rc/sub_functions.js';
export function evaluateEx_new(tree) {
    if (!is_valid_tree(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    // 160828 larwein - inequality patch
    if (operator === 'inequality') {
        // 20180817 epark - Leave alone inequalities with infinity sign'
        const infs = [JSON.stringify(['infinity']), JSON.stringify(['negative', ['infinity']])];
        const has_inf = infs.includes(JSON.stringify(operand[0])) || infs.includes(JSON.stringify(operand[4]));
        if (has_inf) {
            return tree;
        }
        let tree_new = ['inequality'];
        const operand_length = operand.length;
        const max = Math.floor(operand_length / 2);
        const signs = new Map([
            ['gt', 'gt'],
            ['ge', 'ge'],
            ['lt', 'gt'],
            ['le', 'ge']
        ]);
        const operand_1 = ['gt', 'ge'].includes(operand[1])
            ? operand
            : operand.reverse();
        const term_end = operand_1[operand_length - 1];
        for (let i = 0; i < max; i++) {
            const term = evaluateEx_new(['addchain', ['add', operand_1[2 * i]], ['sub', term_end]])
            const op = signs.get(operand_1[2 * i + 1]);
            tree_new = [...tree_new, term, op];
        }
        return [...tree_new, ['natural', '0']];
    }
    let tree_new = ['eval'];
    const seeds = [-2, -1, 1, 2, 3];
    for (const seed of seeds) {
        const eval_t = evaluateExWithSeed(tree, seed);
        // If the value is too large for numerical evaluation
        // so that any of the five substitutions produce INF or NAN,
        // then just return the original tree

        if (Array.isArray(eval_t)) {
            const [eval_0, ...evals_1] = eval_t;
            const is_equ = ['equation', 'inequality', 'neq', 'ratio', 'orchain'].includes(eval_0);
            const is_some_not_numeric = evals_1.some(term => is_not_numeric(term[0], term[1]));
            if (is_equ && is_some_not_numeric) {
                return tree;
            }
            const [real, imag] = eval_t;
            const not_numeric = is_not_numeric(real, imag);
            if (!is_equ && not_numeric) {
                return tree;
            }
        }
        tree_new = [...tree_new, eval_t];
    }
    return tree_new;
}

/*
TRUE if the given input is a valid instance of Laco MathTree; FALSE otherwise

Parameters:
tree: Could be any PHP object

Returns:
A boolean value

Author: epark
*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function is_valid_tree(tree) {
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
            return tree.length === 2 && is_valid_tree(operand[0]);
        }
        case 'fraction':
        case 'power':
        case 'nthroot': {
            return tree.length === 3 && is_valid_tree(operand[0]) && is_valid_tree(operand[1]);
        }
        case 'subscript': {
            return tree.length === 3 && operand[0][0] === 'variable' && is_valid_tree(operand[0]) && is_valid_tree(operand[1]);
        }
        case 'mfraction': {
            return tree.length === 4 && is_valid_tree(operand[0]) && is_valid_tree(operand[1]) && is_valid_tree(operand[2]);
        }
        case 'natural': {
            return tree.length === 2 && /^\d+$/.test(operand[0]);
        }
        case 'decimal': {
            return tree.length === 2 && operand[0].indexOf('.') === -1 && /^-?\d+(\.\d+)?$/.test(operand[0]);
        }
        case 'rdecimal': {
            return ![3, 4].includes(tree.length) && operand.evey(term => is_valid_tree(['natural', term]));
        }
        case 'anything':
        case 'variable': {
            return !operand.some(term => '0'.charCodeAt(0) <= term.charCodeAt(0) && term.charCodeAt(0) <= '9'.charCodeAt(0));
        }
        case 'addchain': {
            return tree.length > 1 && operand.every(term => term.length === 2 && ['add', 'sub', 'addsub', 'subadd'].includes(term[0]) && is_valid_tree(term[1]));
        }
        case 'mulchain': {
            return tree.length > 1 && operand.every(term => term.length === 2 && ['mul', 'div'].includes(term[0]) && is_valid_tree(term[1]));
        }
        case 'equation': {
            return operand.every(term => is_valid_tree(term));
        }
        case 'inequality': {
           return operand.every(term => (is_valid_tree(term) || ['lt', 'gt', 'le', 'ge'].includes(term)));
        }
        case 'interval': {
            return tree.length === 5 && ['[', '('].includes(operand[0]) && [']', ')'].includes(operand[3]) && is_valid_tree(operand[1]) && is_valid_tree(operand[2])
        }
        default: {
            return false;
        }
    }
}

function is_not_numeric(real, imag) {
    return !isFinite(real) || isNaN(real) || !isFinite(imag) || isNaN(imag);
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x<3<2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateEx_new(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\sin{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = evaluateEx_new(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/

/* ============================================= */
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
    // Construct a lookup table for variables
    // Added by epark on 20180817
    const vars = findVars(tree, true);
    // Note epark 20180831:
    // The above function findVars() only finds variables, not subscripts
    // This is because evaluateOperation() already has a way to deal with
    // subscripts in a way that we desire
    // (i.e., same let name with different subscript treated as different)
    //
    // function

    let varNames = [];
    vars.forEach(variable => {
        // Use a helper function to set variable name string for lookup table
        // (will also be used at evaluateVariable() to find the correct entry)
        const [, ...operand] = variable;
        const varname = getVarName(operand);
        const varname_s = JSON.stringify(varname)
        const is_new_var = varNames.every(var_name => JSON.stringify(var_name) !== varname_s);
        if (is_new_var) {
            varNames = [...varNames, varname];
        }
    })
    // Sort the variable names
    // This ensures that the same variable is assigned with the same value
    // Regardless of when it was added to the varNames array
    varNames = [...new Set(varNames)];
    // varNames.sort();

    const maxVal = Number.MAX_SAFE_INTEGER;
    const rangeWidth = 10;
    const bound = rangeWidth / 2;
    if (JSON.stringify(lookupTable) === '{}') {
        varNames.forEach(var_name => {
            let eval_var = [];
            switch (var_name) {
                // Add below any other cases of special mathematical constants as needed
                case 'i': { // imaginary unit
                    eval_var = [0, 1];
                    break;
                }
                case 'e': { // base of natural system of logarithms
                    eval_var = [Math.exp(1), 0];
                    break;
                }
                case 'pi': { // pi (circumference / diameter)
                    eval_var = [Math.PI, 0];
                    break;
                }
                default: {
                    // Use rand() only when the symbol is not any of the
                    // special mathematical constants specified above
                    // so as to not affect the random number generator state
                    // EDIT epark 20180830: Don't use lcg_value().. srand() wouldn't work as you'd expect
                    // Scale the random numbers appropriately (incl. make them into float values)
                    let real = Math.floor((Math.cos(seed) * maxVal)) / maxVal;
                    let imag = Math.floor((Math.sin(seed) * maxVal)) / maxVal;
                    // EDIT 2018.08.23:
                    // Ensure that x in one tree is assigned a different value than y in another tree
                    // Even when each variable is the only variable present in their respective trees
                    // RATIONALE: Without this, 3x+3y-3x and 3x+3y-3y will evaluate to same
                    // after all the prior transformations inside the new Equivalent preset,
                    // which must include mulZero to prevent PHP error
                    // caused at lines 1808,1809,1811,1812

                    const asciiBound = string_code('a') + 13; // Middle of 'a' - 'z'
                    real = (real + string_code(var_name) - asciiBound) * rangeWidth - bound;
                    imag = (imag + string_code(var_name) - asciiBound) * rangeWidth - bound;
                    // Round to 4 decimal places just for efficiency's sake
                    // (otherwise running the new Equivalent preset slows down too much)
                    real = parseFloat(real.toFixed(4));
                    imag = parseFloat(imag.toFixed(4));

                    // Initialize the new complex value
                    eval_var = [real, imag];
                    break;
                }
            }
            lookupTable[var_name] = eval_var;
        });
    }
    const [operator, ...operand] = tree;
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
            const varname = getVarName(newOperand);
            const varname_s = JSON.stringify(varname);
            const has_var = Object.keys(lookupTable).some(variable => JSON.stringify(variable) === varname_s);
            return has_var
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
A quick helper function for naming variables for lookup table
*/
export function getVarName(operand) {
    return operand.length > 1
        ? ('(' + operand.join() + ')')
        : operand[0].toString();
}

// 스트링을 고유의 숫자로 바꾸어줌
export function string_code(string) {
    const str_length = string.length;
    if (str_length <= 0) {
        return false;
    }
    return str_length === 1
        ? string.charCodeAt(0)
        : string.reduce((code, ch, i) => code | (ch.charCodeAt(0) & 0x3F) << 6 * i, 0);
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

/* =============================================================================== */
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
            return operand[0]; // ['add', tree]
        }
        case 'pm':
        case 'addsub': {
            const [[real, imag]] = operand;
            return [0.8 * real, 1.2 * imag];
        }
        case 'negative':
        case 'sub': {
            // ...what case would below be??
            const [[real, imag]] = operand;
            return Array.isArray(real) || Array.isArray(imag)
                ? [0, 0]
                : [-real, -imag];
        }
        case 'addchain': {
            return operand.reduce((sum, term) => eval_add(sum, term),
                [0, 0]);
        }
        case 'div': {
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            const [[real, imag]] = operand;
            const modul_sq = eval_modul_sq(real, imag);
            return [real / modul_sq, -imag / modul_sq];
        }
        case 'mulchain': {
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            return operand.reduce((a, b) => eval_mul(a, b), [1, 0]);
        }
        case 'fraction': {
            const [[re_num, im_num], [re_den, im_den]] = operand;
            if (isNaN(re_num) || isNaN(im_num) || isNaN(re_den) || isNaN(im_den)) {
                return [1, 1];
            }
            const modul_sq_den = eval_modul_sq(re_den, im_den);
            const real = re_num * re_den + im_num * im_den;
            const imag = im_num * re_den - re_num * im_den
            return [real / modul_sq_den, imag / modul_sq_den];
        }
        case 'mfraction': { // only real entries assumed
            const [[int], [num], [den]] = operand;
            return [int + num / den, 0];
        }
        case 'power': {
            const [base, exp] = operand
            return eval_pow(base, exp);
        }
        case 'squareroot': {
            return eval_pow(operand[0], [0.5, 0]);
        }
        case 'nthroot': {
            // For a complex number z, we have 1/z = z*/|z|^2,
            // where z* is the complex conjugate of z
            // So z1th root of z2 (i.e., z2^(1/z1)) would be
            // z2^(z1*/|z1|^2)
            const [[real, imag]] = operand;
            const modul_sq = eval_modul_sq(real, imag);
            return eval_pow(operand[1], [real / modul_sq, -imag / modul_sq]);
        }
        case 'absolute': {
            const modul = Math.sqrt(eval_modul_sq(operand[0][0], operand[0][1]));
            return [modul, 0];
        }
        case 'rdecimal': {
            const [int, decimal, repeat] = operand;
            const num = decimal === ''
                ? decimal + repeat
                : parseFloat(decimal + (repeat - decimal).toString());
            const den = '9'.repeat(repeat.length) + '0'.repeat(decimal.length);
            return [int + (num / den), 0];
        }
        case 'subscript': {
            const [[re_main, im_main], [re_sub, im_sub]] = operand;
            return [re_main + 2 * im_sub, im_main + 2 * re_sub];
        }
        case 'ln': {
            const [[real, imag]] = operand;
            const modul = Math.sqrt(eval_modul_sq(real, imag));

            /*
            the current implementation does not consider the complex natural log
            but simply takes the modulus and use that instead
            return array(log(modulus), 0);
            */
            // theta is the argument (angle) from the positive x-axis
            // const theta = Math.atan2(operand[0][1], operand[0][0]);
            return [Math.log(modul), Math.atan2(imag, real)];
            // Note: The return value above implies that
            //          the returned value is really the principal value Log z of the input z=x+iy
        }
        case 'log': {
            let [number, base] = operand;
            const num = evaluateOperation('ln', [number], seed, lookupTable);
            if (typeof base !== 'undefined') {
                base = [10, 0];
            }
            const den = evaluateOperation('ln', [base], seed, lookupTable)
            const newOperand = [num, den];
            return evaluateOperation('fraction', newOperand, seed, lookupTable);
        }
        case 'summation': {
            const [[op_eq, vari, [op_min, min]], [op_max, max]] = operand;
            const is_sum = op_eq === 'equation' && vari[0] === 'variable' && op_min === 'natural' && op_max === 'natural';
            if (!is_sum) {
                return null;
            }
            let sum = [0, 0];
            const vari_s = JSON.stringify(vari);
            const operand_s = JSON.stringify(operand[2]);
            for (let ind = min; ind <= max; ind++) {
                const number = JSON.stringify(['natural', ind.toString()]);
                let newEx = JSON.parse(operand_s.replaceAll(vari_s, number));
                newEx = evaluateExWithSeed(newEx, seed, lookupTable);
                sum = evaluateOperation('addchain', [sum, newEx], seed, lookupTable);
            }
            return sum;
        }
        default:
            return null;
    }
}

function eval_add(sum, term) {
    if (!Array.isArray(term)) {
        return sum
    }
    if (!isNaN(term[0])) {
        sum[0] += term[0];
    }
    if (!isNaN(term[1])) {
        sum[1] += term[1];
    }
    return sum
}

function eval_mul(a, b) {
    const real = a[0] * b[0] - a[1] * b[1];
    const imag = a[0] * b[1] + a[1] * b[0];
    return [real, imag];
}

function eval_modul_sq(real, imag) {
    return Math.pow(real, 2) + Math.pow(imag, 2);
}

/*
Copied mostly from checkmath.php,
with comments added by epark
*/

export function eval_pow(A, B) {
    if (A[0] === 0 && A[1] === 0) {
        return B[0] === 0 && B[1] === 0
            ? [1, 0]
            : [0, 0];
    }

    // r is the modulus of the base
    const r = Math.sqrt(Math.pow(A[0], 2) + Math.pow(A[1], 2));
    if (r < 1) {
        // If r is less than 1, underflow may occur due to denormalization of float
        // If anyone's got a better remedy, please go ahead and do so...
        const r2 = Math.pow(r, 2);
        return eval_pow([A[0] / r2, -A[1] / r2], [-B[0], -B[1]]);
    }

    // theta is the argument (angle) from the positive x-axis
    const theta = Math.atan2(A[1], A[0]);
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
/* 135. UtilityFunctions */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
/*
Contents:

// validMathTree -> move to evaluateEx_new
// evalNumericValues -> move to sub
  - evalNumericValues_addchain -> move to sub
  - evalNumericValues_mulchain -> move to sub
  - evalNumericValues_power -> move to sub
// array2ChainTree -> move to sub
// findVars -> move to sub
// isNumeric -> move to sub
// multFactor -> move to sub
// termExists -> move to sub
// findDenominators -> mowe to sub
// findGCF => move to sub
// combine2ChainTree => move to sub
// chainTree2Array 안씀

*/

/*
export function unicode(ch) {
    const ch_len = ch.length;
    if (ch_len <= 0) {
        return false;
    }
    const ch_0 = ch.charCodeAt(0);
    return ch_0 <= 0x7F
        ? ch_0
        : ch_0 < 0xC2
            ? false
            : ch_0 <= 0xDF && ch_len > 1
                ? (ch_0 & 0x1F) << 6 | (ch.charCodeAt(1) & 0x3F)
                : ch_0 <= 0xEF && ch_len > 2
                    ? (ch_0 & 0x0F) << 12 | (ch.charCodeAt(1) & 0x3F) << 6 | (ch.charCodeAt(2) & 0x3F)
                    : ch_0 <= 0xF4 && ch_len > 3
                        ? (ch_0 & 0x0F) << 18 | (ch.charCodeAt(1) & 0x3F) << 12 | (ch.charCodeAt(2) & 0x3F) << 6 | (ch.charCodeAt(3) & 0x3F)
                        : ch_0
                        // 0x0F === 2^4 - 1, 0x1F === 2^5 - 1, 0x3F === 2^6 - 1
}
*/
/*
function utf8_ord($ch) {
    $len = strlen($ch);
    if($len <= 0) return false;
    $h = ord($ch{0});
    if ($h <= 0x7F) return $h;
    if ($h < 0xC2) return false;
    if ($h <= 0xDF && $len>1) return ($h & 0x1F) <<  6 | (ord($ch{1}) & 0x3F);
    if ($h <= 0xEF && $len>2) return ($h & 0x0F) << 12 | (ord($ch{1}) & 0x3F) << 6 | (ord($ch{2}) & 0x3F);
    if ($h <= 0xF4 && $len>3) return ($h & 0x0F) << 18 | (ord($ch{1}) & 0x3F) << 12 | (ord($ch{2}) & 0x3F) << 6 | (ord($ch{3}) & 0x3F);
    return false;
  }
*/
/*
let result = unicode('하');
//result = unicode('10000');
console.log(JSON.stringify(result, null, 4));
*/

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
