import { rearrangeTreeEq } from '../rc/function_60.inc.js';
import { rearrangeTreeAdd } from '../rc/function_74.inc.js';

export function rearrangeTree(tree, types = []) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (JSON.stringify(tree) === JSON.stringify([])) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        Array.isArray(term) ? newOperand.push(rearrangeTree(term, types))
            : newOperand.push(term)
    }
    if (!types.includes(operator)) {
        return [operator, ...newOperand];
    }
    switch (operator) {
        case 'array':
        case 'mulchain':
        case 'equation':
        case 'neq': {
            return [operator, ...newOperand.sort(rearrangeTreeEq)];
        }
        case 'addchain': {
            return [operator, ...newOperand.sort(rearrangeTreeAdd)];
        }
        case 'inequality': {
            let rightNum = 0;
            const newOperand_length = newOperand.length;
            for (let i = 1; i < newOperand_length; i += 2) {
                (newOperand[i] === 'gt' || newOperand[i] === 'ge') ? rightNum++
                    : rightNum--
            }
            if (rightNum < 0) {
                const temp = [];
                const newOperand_reverse = newOperand.reverse();
                for (const term_reverse of newOperand_reverse) {
                    term_reverse === 'gt' ? temp.push('lt')
                    : term_reverse === 'ge' ? temp.push('le')
                    : term_reverse === 'lt' ? temp.push('gt')
                    : term_reverse === 'le' ? temp.push('ge')
                    : temp.push(term_reverse)
                }
                return [operator, ...temp];
            }
            return rightNum === 0 ? 'ERROR-ineq'
                : [operator, ...newOperand];
        }
        case 'cap':
        case 'cup': {
           return [operator, ...newOperand.sort(rearrangeTreeEq)];
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
