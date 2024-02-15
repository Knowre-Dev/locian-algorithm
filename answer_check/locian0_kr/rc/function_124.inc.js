import { addNegative } from '../rc/function_71.inc.js';

export function ineqMulNeg(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'inequality') {
        return tree;
    }

    let newOperand = [];
    if (operand[0][0] === 'negative') {
        newOperand = [operand[0][1]];
    } else if (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub') {
        newOperand = [addNegative(['negative', operand[0]])];
    } else {
        return tree;
    }
    const max = Math.floor(operand.length / 2);
    for (let i = 1; i <= max; i++) {
        const term_odd = operand[2 * i - 1];
        newOperand = term_odd === 'gt'
            ? [...newOperand, 'lt']
            : term_odd === 'ge'
                ? [...newOperand, 'le']
                : term_odd === 'lt'
                    ? [...newOperand, 'gt']
                    : [...newOperand, 'ge']
        const term_even = operand[2 * i];
        newOperand = term_even[0] === 'negative'
            ? [...newOperand, term_even[1]]
            : term_even[0] === 'addchain'
                ? [...newOperand, addNegative(['negative', term_even])]
                : (JSON.stringify(term_even) === JSON.stringify(['natural', '0']))
                    ? [...newOperand, term_even]
                    : [...newOperand, ['negative', term_even]];
    }
    return [operator, ...newOperand];
}

export function ineqMulNegUS(tree) {
    if (!Array.isArray(tree) || tree[0] !== 'inequality') {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (JSON.stringify(operand[0]) === JSON.stringify(['natural', '0'])) {
        // If you see any nonnegative argument,
        // just return the whole tree as it was before
        const [, ...operand_1] = operand;
        if (operand_1.some(term_1 => Array.isArray(term_1) &&
            term_1[0] !== 'negative' &&
            !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'))) {
            return tree;
        }
    } else if (JSON.stringify(operand[operand.length - 1]) === JSON.stringify(['natural', '0'])) {
        const operand_1 = operand.slice(0, -1);
        if (operand_1.some(term_1 => Array.isArray(term_1) &&
            term_1[0] !== 'negative' &&
            !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'))) {
            return tree;
        }
    } else {
        return tree;
    }
    const zero = JSON.stringify(['natural', '0']);
    const newOperand = operand.map(term => JSON.stringify(term) === zero
        ? term
        : term === 'gt'
            ? 'lt'
            : term === 'ge'
                ? 'le'
                : term === 'le'
                    ? 'ge'
                    : term === 'lt'
                        ? 'gt'
                        : term[0] === 'negative'
                            ? term[1]
                            : addNegative(['negative', term]));
    return [operator, ...newOperand];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '-ab<0';
let latex_2 = '-ab<0';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);

let tree_11 = ineqMulNeg(tree_1);
let tree_21 = ineqMulNegUS(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
