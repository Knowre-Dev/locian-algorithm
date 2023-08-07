import {addNegative} from '../rc/function_28.inc.js';

export function eqMulNeg(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'equation' && 
            (tree_1[0][0] === 'negative' || (tree_1[0][0] === 'addchain' && tree_1[0][1][0] === 'sub'))) {
            if (tree_1[0][0] === 'negative') {
                newOperand.push(tree_1[0][1]);
            } else {
                newOperand.push(addNegative(['negative', tree_1[0]]));
            }
            
            if (tree_1[1][0] === 'negative') {
                newOperand.push(tree_1[1][1]);
            } else if (tree_1[1][0] === 'addchain') {
                newOperand.push(addNegative(['negative', tree_1[1]]));
            } else if (tree_1[1][0] === 'natural' && tree_1[1][1] === '0') {
                newOperand.push(tree_1[1]);
            } else {
                newOperand.push(['negative', tree_1[1]]);
            }
        } else {
            newOperand = tree_1;
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = eqMulNeg;
var latex1 = '-c=a-b';
var latex2 = 'c=-a+b';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/