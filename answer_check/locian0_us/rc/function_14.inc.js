export function divIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'mulchain') {
            for (var v of tree_1) {
                if (v[0] !== 'div' || v[1][0] !== 'natural' || v[1][1] !== '1') {
                    newOperand.push(v);
                }
            }
            
            if (newOperand.length == 1) {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(divIdentity(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = divIdentity;
var latex1 = '(-a)\\div1+2';
var latex2 = '-a\\div1+2';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/