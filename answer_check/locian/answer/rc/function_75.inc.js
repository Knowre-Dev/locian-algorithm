export function eqMulProp(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'equation'
        ? operand[0][0] === 'fraction'
            ? [operator, [operand[0][1][0]]]
            : operand[0][0] === 'addchain' && operand[0][1][0][0] === 'fraction'
                ? [operator, []]
                : tree
        : tree;
}

import { mulNegative } from '../rc/function_160.inc.js';
import { multFactor, findGCF, array2ChainTree } from './sub_functions.js';

export function eqMulPropUS(tree) {
    if (!Array.isArray(tree) || !['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }

    // Input now guaranteed to be a tree array representing equation or inequality

    // Find the common factors for all sides
    const gcf = findGCF(tree);
    // Here, elements in gcfArr are guaranteed to be positive,
    // so as to guarantee correct inequality directions
    const con = ['mul', gcf.const];
    const syms = gcf.syms.map(sym => ['mul', sym]);
    let factor = [con, ...syms];
    factor = array2ChainTree(factor);
    const factor_s = JSON.stringify(factor);
    if (factor_s === JSON.stringify(['natural', '1']) || factor_s === JSON.stringify(['natural', '0'])) {
        return tree; // No need to divide by 1
    }
    const [operator, ...operand] = tree;
    // this block executes for inequality signs (e.g., 'le', 'ge')
    const newOperand = operand.map(term => Array.isArray(term)
        ? multFactor(term, ['div', factor], true)
        : term);
    return mulNegative([operator, ...newOperand]);

    // NOTE: This function does not support division by negative common factor
    //     Use this function in conjunction with eqMulNeg() and ineqMulNeg()
    //     to handle such cases
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '0=0';
let tree_1 = LatexToTree(latex_1);
let tree_11 = eqMulPropUS(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
