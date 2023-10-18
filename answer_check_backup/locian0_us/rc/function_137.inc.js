

export function mulNegative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1) || tree_1.length < 1) {
        return tree_1;
    }
    
    var operator = tree_1.shift();
    var operand = tree_1;
    var newOperand = [];
    var sign = 1;
    if (operator == 'negative') {
        var newsubtree = mulNegative(operand[0]);
        if (newsubtree[0] == 'negative') {
            return newsubtree[1];
        }
        return [operator, newsubtree];
    }
    if (operator == 'mulchain') {
        for (var mterm of operand) {
            if (mterm[1][0] == 'negative') {
                sign = -1 * sign;
                mterm[1] = mterm[1][1];
            }
            newOperand.push(mterm);
        }
        
    } else {
        for (var subtree of operand) {
            var newsubtree = mulNegative(subtree);
            if (operator == 'fraction' && newsubtree[0] == 'negative') {
                sign = -1 * sign;
                newsubtree = newsubtree[1];
            }
            newOperand.push(newsubtree);
        }
    }
    
    tree_1 = [operator].concat(newOperand);
    if (sign == -1) {
        tree_1 = ['negative', tree_1];
    }
    return tree_1;
    
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulNegative;
var latex1 = '3';
var latex2 = '(-(-3))';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/