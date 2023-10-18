import {fracSimp} from '../rc/function_67.inc.js';

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
                var mul;
                if (int == '0') {
                    num = parseInt(rdec);
                } else {
                    mul = parseInt(int) * Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(int);
                }
                var den = (9 * Math.pow(10, rdec.length - 1)).toString();
                
                var frac = fracSimp(['fraction', ['natural', num], ['natural', den]]);
                operator = frac.shift();
                newOperand = frac;
            } else {
                var int = tree_1[0];
                var dec = tree_1[1];
                var rdec = tree_1[2];
                var mul;
                var num
                if (int == '0') {
                    mul = parseInt(dec) * Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(dec);
                } else {
                    mul = parseInt(int + dec)* Math.pow(10, rdec.length) + parseInt(rdec);
                    num = mul - parseInt(int + dec);
                }
                var den = (9 * Math.pow(10, rdec.length + dec.length - 1)).toString();
                
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
import {LatexToTree} from '../checkmath.js';
var latex_1 = '0.\\overline{2}';
var latex_2 = '0.1\\overline{2}';
var tree_1 = rdecToFrac(LatexToTree(latex_1));
var tree_2 = rdecToFrac(LatexToTree(latex_2));
var result_1 = JSON.stringify(tree_1, null, 4);
var result_2 = JSON.stringify(tree_2, null, 4);
console.log(result_1 == result_2);
console.log(JSON.stringify(tree_1, null, 4));
console.log(JSON.stringify(tree_2, null, 4));
*/