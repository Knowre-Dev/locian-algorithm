import { addNegative } from '../rc/function_71.inc.js';

export function ineqMulNeg(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        let newOperand = [];
        if (operand[0][0] === 'negative') {
            newOperand = [operand[0][1]];
        } else if (operand[0][0] === 'addchain' && operand[0][1][0] === 'sub') {
            newOperand = [addNegative(['negative', operand[0]])];
        } else {
            return tree;
        }
        const operand_length = operand.length;
        for (let i = 1; i < operand_length; i++) {
            i % 2 !== 0 ? operand[i] === 'gt' ? newOperand.push('lt')
                : operand[i] === 'ge' ? newOperand.push('le')
                : operand[i] === 'lt' ? newOperand.push('gt')
                : newOperand.push('ge')
            : operand[i][0] === 'negative' ? newOperand.push(operand[i][1])
                : operand[i][0] === 'addchain' ? newOperand.push(addNegative(['negative', operand[i]]))
                : (operand[i][0] === 'natural' && operand[i][1] === '0') ? newOperand.push(operand[i])
                : newOperand.push(['negative', operand[i]]);
        }
        return [operator, ...newOperand];
    }
    return tree;
}

export function ineqMulNegUS(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator !== 'inequality') {
        return tree;
    }
    const [, ...operand] = tree;
    if (JSON.stringify(operand[0]) === JSON.stringify(['natural', '0'])) {
        const [, ...operand_1] = operand;
        for (const term_1 of operand_1) {
            // If you see any nonnegative argument,
            // just return the whole tree as it was before
            if (Array.isArray(term_1) && (term_1[0] !== 'negative' &&
                !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'))) {
                return [operator, ...operand];
            }
        }
    } else if (JSON.stringify(operand[operand.length - 1]) === JSON.stringify(['natural', '0'])) {
        const operand_1 = operand.slice(0, -1);
        for (const term_1 of operand_1) {
            if (Array.isArray(term_1) && (term_1[0] !== 'negative' &&
                !(term_1[0] === 'addchain' && term_1[1][0] === 'sub'))) {
                return [operator, ...operand];
            }
        }
    } else {
        return [operator, ...operand];
    }
    const newOperand = [];
    operand.forEach(subtree => {
        JSON.stringify(subtree) === JSON.stringify(['natural', '0']) ? newOperand.push(subtree)
        : subtree === 'gt' ? newOperand.push('lt')
        : subtree === 'ge' ? newOperand.push('le')
        : subtree === 'le' ? newOperand.push('ge')
        : subtree === 'lt' ? newOperand.push('gt')
        : subtree[0] === 'negative' ? newOperand.push(subtree[1])
        : newOperand.push(addNegative(['negative', subtree]));
    });
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
