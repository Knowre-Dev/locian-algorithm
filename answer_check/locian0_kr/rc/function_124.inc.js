import { addNegative } from '../rc/function_71.inc.js';

export function ineqMulNeg(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'inequality' || (operand[0][0] !== 'negative' && !(operand[0][0] === 'addchain' && operand[0][1][0] === 'sub'))) {
        return tree;
    }

    let newOperand = [];
    if (operand[0][0] === 'negative') {
        newOperand = [operand[0][1]];
    } else if (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub') {
        newOperand = [addNegative(['negative', operand[0]])];
    }
    const max = Math.floor(operand.length / 2);
    for (let i = 1; i <= max; i++) {
        const term_odd = operand[2 * i - 1];
        const ineqs = new Map([
            ['gt', 'lt'],
            ['ge', 'le'],
            ['lt', 'gt'],
            ['le', 'ge']
        ]);
        const op = ineqs.get(term_odd);

        newOperand = [...newOperand, op];
        const term_even = operand[2 * i];
        const term_add = term_even[0] === 'negative'
            ? term_even[1]
            : term_even[0] === 'addchain'
                ? addNegative(['negative', term_even])
                : JSON.stringify(term_even) === JSON.stringify(['natural', '0'])
                    ? term_even
                    : ['negative', term_even];
        newOperand = [...newOperand, term_add];
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
    const condition = operand_1.some(term_1 => Array.isArray(term_1) && term_1[0] !== 'negative' && !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'));
    if (condition) {
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
        : ineqs.get(term)
            ? ineqs.get(term)
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
