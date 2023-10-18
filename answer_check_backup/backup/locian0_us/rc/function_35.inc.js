import {fracSimp} from '../rc/function_24.inc.js';

export function rdecToFrac(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'rdecimal') {
            if (tree_1[1] == '') {
                var int = tree_1[0];
                var rdec = tree_1[2];
                var num;
                if (int == '0') {
                    num = parseInt(rdec);
                } else {
                    var mul = parseInt(int) * Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(int);
                }
                num = num.toString();
                var den = (Math.pow(10, rdec.length) - 1).toString();
                var frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
                operator = frac.shift();
                newOperand = frac;
            } else {
                var int = tree_1[0];
                var dec = tree_1[1];
                var rdec = tree_1[2];
                var num;
                if (int == '0') {
                    var mul = parseInt(dec) * Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(dec);
                } else {
                    var mul = parseInt(int + dec) * Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(int + dec);
                }
                num = num.toString(); 
                var den = (Math.pow(10, rdec.length + dec.length) - Math.pow(10, dec.length)).toString();
                
                var frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
                operator = frac.shift();
                newOperand = frac;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(rdecToFrac(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = rdecToFrac;
var latex1 = '\\frac{137}{180}';
var latex2 = '0.76\\overline{1}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/