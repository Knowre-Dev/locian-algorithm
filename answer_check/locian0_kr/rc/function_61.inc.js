import {rearrangeTreeEq} from '../rc/function_60.inc.js';
import {rearrangeTreeAdd} from '../rc/function_74.inc.js';
import _ from 'lodash';

export function rearrangeTree(tree, types = []) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (JSON.stringify(tree) === JSON.stringify([])) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    for (let v of tree_1) {
        if (Array.isArray(v)) {
            newOperand.push(rearrangeTree(v, types));
        } else {
            newOperand.push(v);
        }
    }
    if (types.includes(operator)) {
        switch (operator) {
            case 'array':
            case 'mulchain':
            case 'equation':
            case 'neq':
                newOperand = newOperand.sort(rearrangeTreeEq);
                break;
            case 'addchain':
                newOperand = newOperand.sort(rearrangeTreeAdd);
                break;
            case 'inequality':
                let rightNum = 0;
                for (let i = 1; i < newOperand.length; i += 2) {
                    if (newOperand[i] === 'gt' || newOperand[i] === 'ge') {
                        rightNum++;
                    } else {
                        rightNum--;
                    }
                }
                if (rightNum < 0) {
                    let temp = [];
                    let newOperand_reverse = newOperand.reverse();
                    for (let v of newOperand_reverse) {
                        if (v === 'gt') {
                            temp.push('lt');
                        } else if (v === 'ge') {
                            temp.push('le');
                        } else if (v === 'lt') {
                            temp.push('gt');
                        } else if (v === 'le') {
                            temp.push('ge');
                        } else {
                            temp.push(v);
                        }
                    }
                    newOperand = temp;
                } else if (rightNum === 0) {
                    return 'ERROR-ineq';
                }
                break;
            case 'cap':
            case 'cup':
                newOperand = newOperand.sort(rearrangeTreeEq);
                
                break;
            default:
                break;
        }
    }
    return [operator].concat(newOperand);

    
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '1\\le \\frac{x}{2}+3\\le 3.4';
let tree_1 = LatexToTree(latex_1)
let tree_11 = rearrangeTree(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
