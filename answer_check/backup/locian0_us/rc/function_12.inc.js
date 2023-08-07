export function addIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'addchain') {
            for (var v of tree_1) {
                if (!(v[1][0] === 'natural' && v[1][1] === '0')) {
                    newOperand.push(v);
                }
            }
            if (newOperand.length == 0) {
                operator = 'natural';
                newOperand = ['0'];
            } else if (newOperand.length == 1) {
                if (newOperand[0][0] === 'add') {
                    operator = newOperand[0][1].shift();
                    newOperand = newOperand[0][1];
                } else if (newOperand[0][0] === 'sub') {
                    operator = 'negative';
                    newOperand = [newOperand[0][1]];
                } else if (newOperand[0][0] === 'addsub') {
                    operator = 'pm';
                    newOperand = [newOperand[0][1]];
                } else if (newOperand[0][0] === 'subadd') {
                    operator = 'mp';
                    newOperand = [newOperand[0][1]];
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addIdentity(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = addIdentity;
var latex1 = 'x+3';
var latex2 = 'x-0+3';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/