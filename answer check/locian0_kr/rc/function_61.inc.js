import {rearrangeTreeEq} from '../rc/function_60.inc.js';
import {rearrangeTreeAdd} from '../rc/function_74.inc.js';

export function rearrangeTree(tree, types = []) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        if (JSON.stringify(tree_1) == JSON.stringify([])) {
            return tree_1;
        }
        var operator = tree_1.shift();
        var newOperand = [];
        for (var v of tree_1) {
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
                    var rightNum = 0;
                    for (var i = 1; i < newOperand.length; i += 2) {
                        if (newOperand[i] === 'gt' || newOperand[i] === 'ge') {
                            rightNum++;
                        } else {
                            rightNum--;
                        }
                    }
                    if (rightNum < 0) {
                        var temp = [];
                        var newOperand_reverse = newOperand.reverse();
                        for (var v of newOperand_reverse) {
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
                    } else if (rightNum == 0) {
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
        tree_1 = [operator].concat(newOperand);

    }
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '1\\le \\frac{x}{2}+3\\le 3.4';
var tree_1 = LatexToTree(latex_1)
var tree_11 = rearrangeTree(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
