

export function intervalSetNot(tree, variable = ['variable', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var variable_1 = JSON.parse(JSON.stringify(variable));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'interval') {
            operator = 'inequality';
            newOperand = [
                tree_1[2],
                tree_1[3] == ')' ? 'gt' : 'ge',
                variable_1,
                tree_1[0] == '(' ? 'gt' : 'ge',
                tree_1[1]
            ];
            
        } else if (operator === 'tuple') { // jhshin
            operator = 'inequality';
            newOperand = [
                tree_1[1],
                'gt',
                variable,
                'gt',
                tree_1[0]
            ];
        } else if (operator === 'setname') {
            if (tree_1[0] === 'real') {
                operator = 'inequality';
                newOperand = [
                    ['infinity'],
                    'gt',
                    variable_1,
                    'gt',
                    ['negative', ['infinity']]
                ];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(intervalSetNot(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
        
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = intervalSetNot;
var latex1 = '(-3,5]';
var latex2 = '5\\ge x\\gt -3';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/