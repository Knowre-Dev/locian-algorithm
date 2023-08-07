

export function fracComplex(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var numArr = [];
        var denArr = [];
        var newOperand;
        if (operator === 'fraction') {
            var num = fracComplex(tree_1[0]);
            var den = fracComplex(tree_1[1]);
            if (num[0] === 'fraction') {
                numArr.push(num[1]);
                denArr.push(num[2]);
            } else {
                numArr.push(num);
            }
            if (den[0] === 'fraction') {
                denArr.push(den[1]);
                numArr.push(den[2]);
            } else {
                denArr.push(den);
            }
            
            var newNum = [];
            if (numArr.length > 1) {
                newNum = ['mulchain'];
                for (var term of numArr) {
                    if (term[0] == 'mulchain') {
                        var term_1 = term.slice(1);
                        for (var t of term_1) {
                            newNum.push(t);
                        }
                    } else {
                        newNum.push(['mul', term]);
                    }
                }
            } else {
                newNum = numArr[0];
            }
            
            var newDen = [];
            if (denArr.length > 1) {
                newDen = ['mulchain'];
                for (var term of denArr) {
                    if (term[0] == 'mulchain') {
                        var term_1 = term.slice(1);
                        for (var t of term_1) {
                            newDen.push(t);
                        }
                    } else {
                        newDen.push(['mul', term]);
                    }
                }
            } else {
                newDen = denArr[0];
            }
            newOperand = [newNum, newDen];
        } else {
            newOperand = [];
            for (var v of tree_1) {
                newOperand.push(fracComplex(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracComplex;
var latex1 = '\\frac{\\frac{a}{b}}{\\frac{c}{\\frac{d}{e}}}';
var latex2 = '\\frac{da}{bce}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/