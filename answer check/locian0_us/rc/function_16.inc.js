
export function powIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'power') {
            if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
                operator = tree_1[0].shift();
                newOperand = tree_1[0];
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(powIdentity(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = powIdentity;
var latex1 = '(a^1)^1';
var latex2 = 'a^1';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/