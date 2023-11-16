

export function mulAssociative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        for (var [k, v] of tree_1.entries()) {
            var term = mulAssociative(v);
            if (operator === 'mulchain' && 
                term[0] === 'mul' && 
                term[1][0] === 'mulchain') {
                
                for (var [tk, tv] of term[1].entries()) {
                    if (tk !== 0) {
                        newOperand.push(tv);
                    }
                }
            } else {
                newOperand.push(term);
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulAssociative;
var latex1 = '(ab)c';
var latex2 = 'abc';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/