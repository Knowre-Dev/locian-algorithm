

export function powDecomposition(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'power') {
            var base = powDecomposition(tree_1[0]);
            var expo = powDecomposition(tree_1[1]);
            if (base[0] === 'addchain' && expo[0] === 'natural' && expo[1] != '0') {
                operator = 'mulchain';
                for (var i = 0; i < parseInt(expo[1]); i++) {                    
                    newOperand.push(['mul', base]);    
                }                   
            } else {
                newOperand = [base, expo];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(powDecomposition(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = powDecomposition;
var latex1 = '(4+a)^{0}';
var latex2 = '1';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/