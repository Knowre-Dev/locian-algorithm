import { fracDecimal } from '../rc/function_49.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracComplex } from '../rc/function_69.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';
import { mulNegative } from '../rc/function_160.inc.js';

// ======================================================== //

export function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

export function math_dirac(r) {
    return r
        ? 0
        : 1;
}

export function math_sign(r) {
    return r
        ? Math.abs(r) / r
        : 0;
}

export function math_step(r, sign) {
    return r
        ? (r + sign * Math.abs(r)) / (2 * r)
        : 0;
}

export function sign_change(addchain) {
    const [operator, ...operand] = addchain;
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    const new_operand = operand.map(term => typeof signs.get(term[0]) !== 'undefined'
        ? [signs.get(term[0]), term[1]]
        : term);
    return [operator, ...new_operand];
}

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

export function array2ChainTree(operand, evalNumeric = false) {
    // For any invalid input, just return the input back
    const is_not_appl = !Array.isArray(operand) || operand.length === 0 || operand[0].length === 0;
    if (is_not_appl) {
        return operand;
    }

    const ops = new Map();
    ops.set('add', 'addchain');
    ops.set('sub', 'addchain');
    ops.set('addsub', 'addchain');
    ops.set('subadd', 'addchain');
    ops.set('mul', 'mulchain');
    ops.set('div', 'mulchain');
    const [[op]] = operand;
    if (!ops.has(op)) {
        return operand;
         // Can only handle addchain or mulchain; return the input array otherwise
    }
    const operator = ops.get(op);
    // Optional: Evaluate all numerical terms into a single term
    if (evalNumeric) {
        let numers = [];
        let others = [];
        operand.forEach(term => {
            const [, term_1] = term;
            isNumeric(term_1, false, false)
                ? numers = [...numers, term]
                : others = [...others, term];
        });
        let numers_c = array2ChainTree(numers);
        operand = others;

        if (numers_c.length) {
            numers_c = evalNumericValues(numers_c);
            if (operator === 'addchain') {
                const is_empty_operand = operand.length === 0 || JSON.stringify(numers_c) !== JSON.stringify(['natural', '0']);
                if (is_empty_operand) {
                    operand = numers_c[0] === 'negative'
                        ? [['sub', numers_c[1]], ...operand]
                        : [['add', numers_c], ...operand];
                }
            } else {
                operand = [['mul', numers_c], ...operand];
            }
        }
    }

    // If there is only one operand, just return that operand

    const signs = new Map([
        ['addsub', 'pm'],
        ['subadd', 'pm'],
        ['sub', 'negative']
    ]);
    const [[op_0, term_0]] = operand;
    return operand.length === 1
        ? signs.has(op_0)
            ? [signs.get(op_0), term_0]
            : op_0 === 'div'
                ? ['fraction', ['natural', '1'], term_0]
                : term_0
        : [operator, ...operand];
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

export function evalNumericValues(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'natural':{
            return tree;
        }
        case 'decimal': {
            return evalNumericValues(fracDecimal(tree));
        }
        case 'rdecimal': {
            return evalNumericValues(rdecToFrac(tree));
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
    let operand_a = [];
    let operand_as = [];
    operand.forEach(term => {
        ['add', 'sub'].includes(term[0])
            ? operand_a = [...operand_a, term]
            : operand_as = [...operand_as, ['addsub', term[1]]];
    });
    if (operand_a.length === 0) {
        return ['addchain', ...operand_as];
    }
    let num = 0;
    let den = 1;
    operand_a.forEach(term => {
        const [op, term_1] = term;
        const term_a = op === 'negative'
            ? term_1[1]
            : term_1
        const sign = ['sub', 'negative'].includes(op)
            ? -1
            : 1;
        const [operator_a] = term_a;
        let num_f;
        let den_f = 1;
        if (operator_a === 'fraction') {
            [, [, num_f], [, den_f]] = term_a;
        } else {
            [, num_f] = term_a
        }
        den *= den_f;
        num = num * den_f + sign * den * num_f / den_f;
    });
    const g = gcd(num, den);
    num /= g;
    den /= g;

    // Construct the output tree as a fraction, and then simplify before returning
    const num_t = ['natural', Math.abs(num).toString()];
    const den_t = ['natural', den.toString()];
    let tree = ['fraction', num_t, den_t];
    tree = tree = fracSimpInt(tree);
    if (operand_as.length === 0) {
        return num > 0
            ? tree
            : ['negative', tree]
    }
    const op = num > 0
        ? 'add'
        : 'sub';
    return ['addchain', [op, tree], ...operand_as];
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
    let num = 1;
    let den = 1;
    operand.forEach(term => {
        let [op, term_1] = term;
        // Account for any negative
        if (term_1[0] === 'negative') {
            num *= -1;
            [, term_1] = term_1;
        }
        const [operator_1] = term_1;
        let num_f;
        let den_f = 1;
        if (operator_1 === 'fraction') {
            [, [, num_f], [, den_f]] = term_1;
        } else {
            [, num_f] = term_1;
        }

        if (op === 'div') {
            [num_f, den_f] = [den_f, num_f];
        }
        if (num_f === 0) {
            return ['natural', '0'];
        }
        num *= num_f;
        den *= den_f;
    });
    // Construct the output tree as a fraction, and then simplify before returning
    const num_t = ['natural', Math.abs(num).toString()];
    const den_t = ['natural', den.toString()];
    let tree = ['fraction', num_t, den_t];
    if (num < 0) {
        tree = ['negative', tree];
    }
    return fracSimpInt(tree);
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
    const [operator_b, operand_b] = base;
    const [operator_e, ...operand_e] = exp;
    base = operator_b === 'negative'
        ? operand_b[1]
        : operand_b;
    let num_e = operator_e === 'fraction'
        ? operand_e[0]
        : exp;
    let den_e = operator_e === 'fraction'
        ? operand_e[1]
        : ['natural', '1'];
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate
    // let is_recipro = false;
    const [operator_n, operand_n] = num_e;
    const [operator_d, operand_d] = den_e
    num_e = operator_n === 'negative'
        ? operand_n[1]
        : operand_n;
    den_e = operator_d === 'negative'
        ? operand_d[1]
        : operand_d;
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate

    // Evaluation
    // work with absolute value of base for now, will see why later
    // Factor out any integer result possible
    const exp_f = Math.floor(num_e / den_e);
    if (Math.log(Number.MAX_SAFE_INTEGER) / Math.log(base) < exp_f) {
        return ['power', ...operand];
    }
    const pow_quo = Math.pow(base, exp_f);
    const exp_res = num_e % den_e;
    const pow_rem = Math.pow(base, exp_res / den_e);
    // Here, pow() quietly returns FALSE for inputs like pow(-1, 1 / 2)
    // that was why we work with the absolute value
    // and deal with the sign last
    // so that we can put imaginary unit i properly

    let newOperand = []; // construct as a mulchain, and then simplify later
    if (Number.isInteger(pow_rem)) {
        newOperand = [['mul', ['natural', (pow_quo * pow_rem).toString()]]];
    } else {
        if (pow_quo !== 1) {
            newOperand = [['mul', ['natural', pow_quo.toString()]]];
        }
        const base_t = ['natural', base];
        const exp_t = ['fraction', ['natural', exp_res.toString()], ['natural', den_e]];
        const term = ['power', base_t, exp_t];
        newOperand = [...newOperand, ['mul', term]];
    }
    // Deal with imaginary number case and negative result case here
    // Watch out for any imaginary number case
    const sign = operator_b === 'negative'
        ? -1
        : 1;
    const is_imag = sign === -1 && num_e % 2 === 1 && den_e % 2 === 0;
    const sign_t = is_imag
        ? -Math.pow(-1, exp % 2)
        : Math.pow(sign, num_e % 2);
    if (is_imag) {
        newOperand = [...newOperand, ['mul', ['variable', 'i']]];
    }
    const is_reci = operator_n !== operator_d && [operator_n, operator_d].includes('negative')
    let tree = array2ChainTree(newOperand);
    if (is_reci) {
        tree = ['fraction', ['natural', '1'], tree];
    }
    return sign_t < 0
        ? ['negative', tree]
        : tree;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '3^2';
let tree_1 = LatexToTree(latex_1);
tree_1 = [['mul', tree_1]];
let tree_11 = array2ChainTree(tree_1, true);
console.log(JSON.stringify(tree_11, null, 4))
*/

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
        const [, den] = operand;
        const [operator_d, operand_d] = den;
        return positive && operator_d === 'negative'
            ? [operand_d]
            : [den];
    }

    let dens = [];
    operand.forEach(term => {
        const sub_dens = findDenominators(term, unique);
        const terms_add = sub_dens.reduce((terms, term_d) => !unique && dens.some(value => JSON.stringify(value) === JSON.stringify(term_d))
            ? [...terms, term_d, term_d]
            : [...terms, term_d],
        dens);
        dens = [...dens, ...terms_add];
    });
    return dens;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{a}{c}+\\frac{b}{c}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findDenominators(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/

/* =========================================================== */

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

export function findGCF(tree = null) {
    let CFs = {
        const: ['natural', '1'],
        syms: []
    };
    if (!Array.isArray(tree)) {
        return CFs;
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
            CFs.const = tree;
            return CFs;
        }
        case 'variable': {
            CFs.syms = [...CFs.syms, tree];
            return CFs;
        }
        case 'mulchain': {
            let con = 1;
            let syms = [];
            operand.forEach(term => {
                // only consider multiplications (divisions would end up in denominators)
                if (term[0] === 'mul') {
                    const subCFs = findGCF(term[1]);
                    con *= subCFs.const[1];
                    syms = subCFs.syms.reduce((terms, symb) => terms.every(sym => JSON.stringify(sym) !== JSON.stringify(symb))
                        ? [...terms, symb]
                        : terms,
                    syms);
                }
            });

            CFs.const = ['natural', con.toString()];
            CFs.syms = syms;
            return CFs;
        }
        case 'addchain':
        case 'equation':
        case 'inequality': {
            const [term_0, ...operand_1] = operand;
            if (Array.isArray(term_0)) {
                const subtree = operator === 'addchain'
                    ? term_0[1]
                    : term_0;
                CFs = findGCF(subtree);
            }
            operand_1.forEach(term => {
                // this is the case for inequality signs (e.g., 'le', 'ge')
                if (Array.isArray(term)) {
                    const subtree = operator === 'addchain'
                        ? term[1]
                        : term;
                    const subCFs = findGCF(subtree);
                    // For numerical constants, update the array with GCF
                    const a = parseInt(CFs.const[1]);
                    const b = parseInt(subCFs.const[1]);
                    CFs.const = ['natural', gcd(a, b).toString()];
                    // For variables,
                    // only count the vars already in commonFactorArr['sym']
                    CFs.syms = subCFs.syms.reduce((syms, sym) => [...syms, ...CFs.syms.filter(sym_1 => JSON.stringify(sym) === JSON.stringify(sym_1))], []);
                }
            });
            return CFs;
        }
        default: {
            return CFs;
        }
    }
}

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
        let vars = [];
        operand.forEach(term => {
            const term_c = ['addchain', 'mulchain'].includes(operator)
                ? term[1]
                : term;
            const vars_c = findVars(term_c, option);
            const vars_c_filter = vars_filter(vars_c, vars);
            vars = [...vars, ...vars_c_filter];
        });
        return vars;
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
            let vars = [];
            operand.forEach(term => {
                let [op, term_m] = term;
                if (term_m[0] === 'negative') {
                    [, term_m] = term_m;
                }
                const has_vars = findVars(term_m, option).length > 0;
                if (has_vars) {
                    vars = [...vars, [op, term_m]];
                    // This way, same variable multiplied twice (e.g., ['variable', 'x'])
                    // will be parsed as a mulchain
                    // (e.g., ['mulchain', ['mul', ['variable', 'x']], ['mul', ['variable', 'x']]])
                    // rather than just as one variable (e.g., ['variable', 'x'])
                }
            });
            vars = array2ChainTree(vars);
            return vars.length > 0
                ? [vars]
                : [];
        }
        case 'addchain': {
            let vars = [];
            operand.forEach(term => {
                let [, term_a] = term;
                if (term_a[0] === 'negative') {
                    [, term_a] = term_a;
                }
                const vars_a = findVars(term_a, option);
                const vars_a_filter = vars_filter(vars_a, vars);
                vars = [...vars, ...vars_a_filter];
            });
            return vars;
        }
        default: {
            return [];
        }
    }
}

function vars_filter(vars_1, vars) {
    return vars_1.filter(var_1 => vars.every(vari => JSON.stringify(vari) !== JSON.stringify(var_1)));
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'c*c^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = findGCF(tree_1);
console.log(JSON.stringify(tree_11.get('const'), null, 4));
console.log(JSON.stringify(tree_11.get('sym'), null, 4));
*/

/* =============================================================== */
/*
Applies multiplicative term factor to each term in tree, and then returns the new tree.

Parameters:
tree: A Laco tree
factor: A Laco data object (e.g., ['natural', '5'], ['variable', 'x'])
is_simp_frac: An option to remove from the denominator (if present)
            rather than appending to the numerator
            (applicable only for fraction tree)
            Option set to FALSE by default

Returns:
A new Laco tree

Author: epark
*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export function multFactor(tree, term_f, is_simp_frac = false) {
    const is_not_appl = !Array.isArray(tree) || !Array.isArray(term_f) || term_f.length === 0 || !['mul', 'div'].includes(term_f[0])
    if (is_not_appl) {
        return tree;
    }
    const [operator, ...operand] = tree;
    const [operator_f, operand_f] = term_f;
    const frac_function = tree_1 => fracSimpVar(fracSimpInt(fracNegative(tree_1)));
    switch (operator) {
        case 'fraction': {
            const idx = operator_f === 'mul'
                ? 0
                : 1;
            // mul => (a/b)*c => (ac)/b
            // div => (a/b)*(1/c) => a/(bc)
            const has_same = is_simp_frac && JSON.stringify(operand_f) === JSON.stringify(operand[1 - idx]);
            has_same
                ? operand[1 - idx] = ['natural', '1']
                : operand[idx] = combine2ChainTree(operand_f, operand[idx], 'mul');
            const frac = [operator, ...operand];
            const newTree = mulNegative(frac_function(frac));
            return is_simp_frac
                ? frac_function(newTree)
                : newTree;
        }
        case 'addchain': {
            let newTree = ['addchain'];
            operand.forEach(term => {
                term[1] = multFactor(term[1], term_f, is_simp_frac);
                newTree = [...newTree, term];
            });
            newTree = addAdjacentSigns(newTree);
            return is_simp_frac
                ? frac_function(newTree)
                : newTree;
        }
        default: {
            let newTree = operator_f === 'mul'
                ? combine2ChainTree(operand_f, tree, 'mul')
                : ['fraction', tree, operand_f];
            newTree = mulNegative(newTree);
            return is_simp_frac
                ? frac_function(newTree)
                : newTree;
        }
    }
}

export function combine2ChainTree(tree1, tree2, subtype = null) {
    const is_not_appl = !Array.isArray(tree1) || tree1.length === 0 || !Array.isArray(tree2) || tree2.length === 0;
    if (is_not_appl) {
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
    const is_subtype_mul = ['mul', 'div'].includes(subtype);
    const tree1_1 = type_match(operator_1, is_subtype_add, is_subtype_mul)
        ? operand_1
        : [[subtype, tree1]];
    const tree2_1 = type_match(operator_2, is_subtype_add, is_subtype_mul)
        ? operand_2
        : [[subtype, tree2]];
    return array2ChainTree([...tree1_1, ...tree2_1]);
}

function type_match(operator, is_subtype_add, is_subtype_mul) {
    return (operator === 'addchain' && is_subtype_add) || (operator === 'mulchain' && is_subtype_mul);
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
    if (['natural', 'decimal', 'rdecimal'].includes(operator)) {
        return true;
    }
    if (operator === 'absolute') {
        return isNumeric(operand[0]);
    }
    if (operator === 'negative') {
        return !excNegative && isNumeric(operand[0]);
    }
    if (!['fraction', 'power'].includes(operator)) {
        return false;
    }
    if (recursive) {
        // The second term in logical AND evaluates only if tree is a fraction
        // fracIsNumeric = fracIsNumeric && isNumeric(tree[1], excNegative, recursive);
        return isNumeric(operand[0], excNegative, recursive) && isNumeric(operand[1], excNegative, recursive);
    }
    if (operator === 'fraction') {
        const [[op_num], [op_den]] = operand;
        if (op_num === 'natural' && op_den === 'natural') {
            return true;
        }
    }
    if (operator === 'power') {
        const [[op_base, term_base], [op_exp]] = operand;
        const is_numeric_base = op_base === 'natural' || (op_base === 'negative' && term_base[0] === 'natural');
        if (is_numeric_base && op_exp === 'natural') {
            return true;
        }
    }
    return false;
    /*
    const is_numeric_frac = operator === 'fraction' && operand[0][0] === 'natural' && operand[1][0] === 'natural';
    const is_numeric_pow = operator === 'power' && (operand[0][0] === 'natural' || (operand[0][0] === 'negative' && operand[0][1][0] === 'natural')) && operand[1][0] === 'natural';
    return is_numeric_frac || is_numeric_pow;
    */
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
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);
let tree_11 = isNumeric(tree_1, false, false);
console.log(JSON.stringify(tree_11, null, 4))
*/

/*
Returns TRUE if the given term exists in the given tree, FALSE otherwise

Parameters:
term: Any subtree in Laco format (e.g., ['variable', 'x'], ['natural', '10'])
tree: A Laco tree
recursive: An optional boolean that activates recursive call (to search ALL subtrees)
                 (defaults to TRUE)
exclude_pow: An optional boolean that excludes power terms from consideration
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
export function termExists(term, tree, recursive = true, exclude_pow = false) {
    const term_string = JSON.stringify(term);
    if (term_string === JSON.stringify(tree)) {
        return true;
    }
    if (!Array.isArray(tree)) {
        return false;
    }
    if (!recursive) {
        const [operator, ...operand] = tree;
        const has_term = operand.some(term_1 => ['addchain', 'mulchain'].includes(operator)
            ? JSON.stringify(term_1[1]) === term_string
            : JSON.stringify(term_1) === term_string);
        return has_term && !(operator === 'power' && exclude_pow);
    }
    for (const term_1 of tree) {
        if (termExists(term, term_1, recursive, exclude_pow)) {
            const [operator_1, ...operand_1] = term_1;
            const has_term = operand_1.some(term_subtree => JSON.stringify(term_subtree) === term_string);
            return !(has_term && operator_1 === 'power' && exclude_pow);
        }
    }
    return false; // added
}
