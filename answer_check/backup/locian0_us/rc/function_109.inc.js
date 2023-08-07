import {fracSimpInt} from '../rc/function_33.inc.js';

export function mfracEquiv(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'mfraction') {
            var nfrac = fracSimpInt(['fraction', tree_1[1], tree_1[2]]);
            if (nfrac[0] === 'fraction') {
                newOperand.push(tree_1[0]);
                newOperand.push(nfrac[1]);
                newOperand.push(nfrac[2]);
            } else {
                newOperand = tree_1;
                /*
                operator = 'natural';
                newOperand[] = strval(intval(tree[0][1])+intval(nfrac[1]));
                */
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(mfracEquiv(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mfracEquiv;
var latex1 = '25';
var latex2 = '24\\frac{4}{4}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/