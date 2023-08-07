import {rearrangeTreeEq} from '../rc/function_17.inc.js';
import {rearrangeTreeAdd} from '../rc/function_31.inc.js';


export function rearrangeTree(tree, types = []) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
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
                    newOperand.sort(rearrangeTreeEq);
                    break;
            
                case 'addchain':
                    newOperand.sort(rearrangeTreeAdd);
                    break;

                case 'inequality':
                    var rightNum = 0;
                    var l = newOperand.length;
                    for (var i = 1; i < l; i +=2 ) {
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
            
                default:
                    break;
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = rearrangeTree;
var latex1 = 'xy';
var latex2 = 'yx';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/