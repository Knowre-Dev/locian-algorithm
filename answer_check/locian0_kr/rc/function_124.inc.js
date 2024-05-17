// ineqwuatliy 부호 정렬
import { sign_change } from '../rc/sub_functions.js';
export function ineqMulNeg(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const is_first_not_nega = operator !== 'inequality' || (operand[0][0] !== 'negative' && !(operand[0][0] === 'addchain' && operand[0][1][0] === 'sub'));
    if (is_first_not_nega) {
        return tree;
    }
    // operand = [term, op, term, op, term]
    let newOperand = [];
    if (operand[0][0] === 'negative') {
        newOperand = [operand[0][1]];
    } else if (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub') {
        newOperand = [sign_change(operand[0])];
    }
    const max = Math.floor(operand.length / 2);
    const ineqs = new Map([
        ['gt', 'lt'],
        ['ge', 'le'],
        ['lt', 'gt'],
        ['le', 'ge']
    ]);
    const zero = JSON.stringify(['natural', '0']);
    for (let i = 1; i <= max; i++) {
        newOperand = [...newOperand, ineqs.get(operand[2 * i - 1])];
        const term_even = operand[2 * i];
        const term_new = term_even[0] === 'negative'
            ? term_even[1]
            : term_even[0] === 'addchain'
                ? sign_change(term_even)
                : JSON.stringify(term_even) === zero
                    ? term_even
                    : ['negative', term_even];
        newOperand = [...newOperand, term_new];
    }
    return [operator, ...newOperand];
}

export function ineqMulNegUS(tree) {
    if (!Array.isArray(tree) || tree[0] !== 'inequality') {
        return tree;
    }
    const [operator, ...operand] = tree;
    const zero = JSON.stringify(['natural', '0']);

    // If you see any nonnegative argument,
    // just return the whole tree as it was before
    let operand_1;
    if (JSON.stringify(operand[0]) === zero) {
        [, ...operand_1] = operand;
    } else if (JSON.stringify(operand[operand.length - 1]) === zero) {
        operand_1 = operand.slice(0, -1);
    } else {
        return tree;
    }
    const is_not_nega = operand_1.some(term_1 => Array.isArray(term_1) && term_1[0] !== 'negative' && !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'));
    if (is_not_nega) {
        return tree;
    }
    const ineqs = new Map([
        ['gt', 'lt'],
        ['ge', 'le'],
        ['lt', 'gt'],
        ['le', 'ge']
    ]);
    const newOperand = operand.map(term => JSON.stringify(term) === zero
        ? term
        : ineqs.has(term)
            ? ineqs.get(term)
            : term[0] === 'negative'
                ? term[1]
                : sign_change(term));
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
