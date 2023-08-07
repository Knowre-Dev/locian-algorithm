

export function ineqSetNot(tree, variable = ['anything', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var variable_1 = JSON.parse(JSON.stringify(variable));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();        
        
        var newOperand = [];
        if (operator === 'inequality') {
            if (tree_1.length == 3) {
                if ((JSON.stringify(tree_1[0][0]) === JSON.stringify(variable_1[0]) && JSON.stringify(tree_1[0][1]) === JSON.stringify(variable_1[1])) || tree_1[0][0] === 'variable') {
                    newOperand.push(['infinity']);
                    newOperand.push('gt');
                    newOperand = newOperand.concat(tree_1);
                } else {
                    newOperand = tree_1;
                    newOperand.push('gt');
                    newOperand.push(['negative', ['infinity']]);
                }
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(ineqSetNot(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = ineqSetNot;
var latex1 = 'a\\geb';
var latex2 = '\\infty>a\\geb';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/