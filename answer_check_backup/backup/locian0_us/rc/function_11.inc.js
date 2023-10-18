import {fracSimp} from '../rc/function_24.inc.js';

export function fracSeparation(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'fraction' && tree_1[0][0] === 'addchain') {
            operator = 'addchain';
            var den = fracSeparation(tree_1[1]);
            var tree_11 = tree_1[0].slice(1);
            for (var term of tree_11) {
                var nden;
                var sign;
                if (den[0] === 'negative') {
                    if (term[0] === 'add') {
                        sign = 'sub';
                    } else if (term[0] === 'sub') {
                        sign = 'add';
                    } else {
                        sign = term[0];
                    }
                    nden = den[1];
                } else if (den[0] === 'pm' || term[0] === 'addsub') {
                    sign = 'addsub';
                    nden = den[0] === 'pm' ? den[1] : den;
                } else if (den[0] === 'mp' || term[0] === 'subadd') {
                    sign = 'subadd';
                    nden = den[0] === 'mp' ? den[1] : den;
                } else {
                    sign = term[0];
                    nden = den;
                }
                //newOperand[] = [sign, fracSimp(['fraction', fracSeparation(term[1]), nden])];
                // 20180824 epark replaced above line with below to do recursion properly
                newOperand.push([
                    sign,
                    fracSeparation(fracSimp(['fraction', term[1], nden]))
                ]);
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(fracSeparation(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracSeparation;
var latex1 = '\\frac{a-b}{-2}';
var latex2 = '-\\frac{a}{2}+\\frac{b}{2}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/