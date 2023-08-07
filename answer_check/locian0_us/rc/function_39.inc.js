import {checkZeroEquiv} from '../rc/function_37.inc.js';

export function mulZero(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'mulchain') {
            var zero = false;
            for (var term of tree_1) {
                if (checkZeroEquiv(term[1])) {
                    zero = true;
                }
            }
            if (zero) {
                operator = 'natural';
                newOperand.push('0');
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(mulZero(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulZero;
var latex1 = 'frac{x^4y^4}{xy}';
var latex2 = '\\frac{0*x}{2}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/