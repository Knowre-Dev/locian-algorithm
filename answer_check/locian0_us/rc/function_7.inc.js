
export function negParenthesis(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'addchain') {
            if (tree_1[0][0] === 'add' && tree_1[0][1][0] === 'negative') {
                tree_1[0] = ['sub', tree_1[0][1][1]];
            } else if (Array.isArray(tree_1[0]) &&
                tree_1[0][0] === 'add' && 
                tree_1[0][1][0] === 'mulchain' && 
                tree_1[0][1][1][0] === 'mul' && 
                tree_1[0][1][1][1][0] === 'negative') {
                tree_1[0][1][1][1] = tree_1[0][1][1][1][1];
                tree_1[0] = ['sub', tree_1[0][1]];
            }
            newOperand = tree_1;
        } else if (operator === 'negative' && 
            Array.isArray(tree_1[0]) &&
            tree_1[0][0] === 'mulchain') {
            tree_1[0][1][1] = ['negative', tree_1[0][1][1]];
            operator = tree_1[0].shift();
            newOperand = tree_1[0];
        } else {
            for (var v of tree_1) {
                newOperand.push(negParenthesis(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    //print_r(tree); echo "<br />";echo "<br />";
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = negParenthesis;
var latex1 = '+(-3)+2';
var latex2 = '-3+1';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/