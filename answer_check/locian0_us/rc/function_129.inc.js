

export function fracPlusMinus(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var sign = 1;
        var newOperand = [];
        if (operator === 'fraction') {
            var num = fracPlusMinus(tree_1[0]);
            var den = fracPlusMinus(tree_1[1]);
            
            if (num[0] === 'negative') {
                sign = -1 * sign;
                num = num[1];
            } else if (num[0] === 'mp') {
                sign = -2;
                num = num[1];
            } else if (num[0] === 'pm') {
                sign = 2;
                num = num[1];
            }
            
            if (den[0] === 'negative') {
                sign = -1 * sign;
                den = den[1];
            } else if (num[0] === 'mp') {
                sign = Math.abs(sign) == 1 ? -2 : -1 * sign;
                den = den[1];
            } else if (num[0] === 'pm') {
                sign = Math.abs(sign) == 1 ? 2 : sign;
                den = den[1];
            }
            if (Math.abs(sign) > 1) {
                newOperand = [num, den];
            } else {
                newOperand = tree_1;
            }
            /* } elseif (operator === 'addchain') {
            foreach (tree as term) {                
                if (term[1][0] === 'fraction') {
                    nterm = fracPlusMinus(term[1]);        
                    if (nterm[0] === 'pm') {
                        if (term[0] === 'sub' || term[0] === 'subadd') {
                            newOperand[] = ['mp', nterm[1]];                            
                        } else {
                            newOperand[] = ['pm', nterm[1]];
                        }
                    } else {
                        newOperand[] = [term[0], nterm];
                    }
                } else {
                    newOperand[] = term;
                }
            }*/
        } else {
            for (var v of tree_1) {
                newOperand.push(fracPlusMinus(v));
            }
        }
        
        if (sign === -2) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'mp';
        } else if (sign === 2) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'pm';
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracPlusMinus;
var latex1 = '\\frac{\\mp4\\sqrt{2}}{3}';
var latex2 = '\\frac{\\pm4\\sqrt{2}}{-3}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/