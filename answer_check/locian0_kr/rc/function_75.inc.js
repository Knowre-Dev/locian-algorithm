export function eqMulProp(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'equation') {
        const [, ...operand] = tree;
        return operand[0][0] === 'fraction' ? [operator, [operand[0][1][0]]]
            : (operand[0][0] === 'addchain' && operand[0][1][0][0] === 'fraction') ? [operator, []]
            : [operator, ...operand];
    }
    return tree;
}

import { array2ChainTree, findGCF, multFactor } from '../rc/function_152.inc.js';
import { mulNegative } from '../rc/function_160.inc.js';

export function eqMulPropUS(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    if (!['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }

    // Input now guaranteed to be a tree array representing equation or inequality

    // Find the common factors for all sides
    const gcfArr = findGCF(tree);
    // Here, elements in gcfArr are guaranteed to be positive,
    // so as to guarantee correct inequality directions
    let factor = [['mul', gcfArr.const], ...gcfArr.sym.map(sym => ['mul', sym])];
    factor = array2ChainTree(factor);

    if (JSON.stringify(factor) === JSON.stringify(['natural', '1']) ||
        JSON.stringify(factor) === JSON.stringify(['natural', '0'])) {
        return tree; // No need to divide by 1
    }
    let newtree = [tree[0]];
    const [, ...operand] = tree;
    for (const subtree of operand) {
        if (!Array.isArray(subtree)) {
            // this block executes for inequality signs (e.g., 'le', 'ge')
            newtree = [...newtree, subtree];
            continue;
        }
        newtree = [...newtree, multFactor(subtree, ['div', factor], true)];
    }
    return mulNegative(newtree);

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
