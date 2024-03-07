import { rearrangeTreeEq } from '../rc/function_60.inc.js';
import { rearrangeTreeAdd } from '../rc/function_74.inc.js';

export function rearrangeTree(tree, types = []) {
    if (!Array.isArray(tree) || tree.length === 0) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = operand.map(term => rearrangeTree(term, types));
    if (!types.includes(operator)) {
        return [operator, ...newOperand];
    }
    switch (operator) {
        case 'array':
        case 'cap':
        case 'cup':
        case 'equation':
        case 'mulchain':
        case 'neq': {
            return [operator, ...newOperand.sort(rearrangeTreeEq)];
        }
        case 'addchain': {
            return [operator, ...newOperand.sort(rearrangeTreeAdd)];
        }
        case 'inequality': {
            let rightNum = 0;
            const max = Math.floor(newOperand.length / 2);
            for (let i = 1; i <= max; i++) {
                ['gt', 'ge'].includes(newOperand[2 * i - 1])
                    ? rightNum++
                    : rightNum--
            }
            if (rightNum < 0) {
                const newOperand_reverse = newOperand.reverse();
                const ineqs = new Map([
                    ['gt', 'lt'],
                    ['ge', 'le'],
                    ['lt', 'gt'],
                    ['le', 'ge']
                ]);
                const temp = newOperand_reverse.map(term_reverse =>
                    ineqs.get(term_reverse)
                        ? ineqs.get(term_reverse)
                        : term_reverse);
                return [operator, ...temp];
            }
            return rightNum === 0
                ? 'ERROR-ineq'
                : [operator, ...newOperand];
        }
        default: {
            return [operator, ...newOperand];
        }
    }
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree_1 = LatexToTree(latex_1)
let tree_11 = rearrangeTree(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
