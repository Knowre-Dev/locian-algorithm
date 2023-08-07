export function fracMfrac(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'mfraction' && parseInt(tree_1[1][1]) < parseInt(tree_1[2][1])) {
            var num = ['natural', (parseInt(tree_1[0][1]) * parseInt(tree_1[2][1])+ parseInt(tree_1[1][1])).toString()];
            var den = tree_1[2];

            operator = 'fraction';
            newOperand.push(num);
            newOperand.push(den);
        } else {
            for (var v of tree_1) {
                newOperand.push(fracMfrac(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracMfrac;
var latex1 = '2\\frac{4}{3}';
var latex2 = '3\\frac{1}{4}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/