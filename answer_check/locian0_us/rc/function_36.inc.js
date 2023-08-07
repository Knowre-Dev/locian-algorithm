

export function decElimZero(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'decimal') {
            var decArr = tree_1[0].split('');
            
            while (decArr[decArr.length - 1] == '0') {
                decArr.splice(-1);
            }
            
            if (decArr[decArr.length-1] == '.') {
                operator = 'natural';
                decArr.splice(-1);
            }
            
            var dec = decArr.join('');
            newOperand.push(dec);
        } else {
            for (var v of tree_1) {
                newOperand.push(decElimZero(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = decElimZero;
var latex1 = '5.10+1.90';
var latex2 = '1.0000';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/