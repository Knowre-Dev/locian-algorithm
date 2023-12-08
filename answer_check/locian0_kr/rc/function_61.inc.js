import { rearrangeTreeEq } from '../rc/function_60.inc.js';
import { rearrangeTreeAdd } from '../rc/function_74.inc.js';

export function rearrangeTree(tree, types = []) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (JSON.stringify(tree) === JSON.stringify([])) {
        return tree;
    }

    // eslint-disable-next-line prefer-const
    let operator = tree[0];
    const tree_1 = tree.slice(1);
    let newOperand = [];
    for (const v of tree_1) {
        Array.isArray(v) ? newOperand.push(rearrangeTree(v, types))
            : newOperand.push(v)
    }
    if (!types.includes(operator)) {
        return [operator].concat(newOperand);
    }
    switch (operator) {
        case 'array':
        case 'mulchain':
        case 'equation':
        case 'neq': {
            newOperand = newOperand.sort(rearrangeTreeEq);
            return [operator].concat(newOperand);
        }
        case 'addchain': {
            newOperand = newOperand.sort(rearrangeTreeAdd);
            return [operator].concat(newOperand);
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
                for (const v of newOperand_reverse) {
                    v === 'gt' ? temp.push('lt')
                    : v === 'ge' ? temp.push('le')
                    : v === 'lt' ? temp.push('gt')
                    : v === 'le' ? temp.push('ge')
                    : temp.push(v)
                }
                newOperand = temp;
                return [operator].concat(newOperand);
            }
            if (rightNum === 0) {
                return 'ERROR-ineq';
            }
            return [operator].concat(newOperand);
        }
        case 'cap':
        case 'cup': {
            newOperand = newOperand.sort(rearrangeTreeEq);
            return [operator].concat(newOperand);
        }
        default: {
            return [operator].concat(newOperand);
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
