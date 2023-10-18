

export function addPolyZero(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'addchain') {
            for (var term of tree_1) {
                if (term[0] === 'sub') {
                    if (checkZeroEquiv(term[1])) {
                        newOperand.push(['add', term[1]]);
                    } else {
                        newOperand.push(term);
                    }
                } else {
                    newOperand.push(term);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addPolyZero(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

export function checkZeroEquiv(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var result = false;
        switch (operator) {
            case 'fraction':
                result = checkZeroEquiv(tree_1[0]);
                break;
            
            case 'mulchain':
                for (var term of tree_1[0]) {
                    if (term[0] === 'natural' && term[1] == '0') {
                        result = true;
                    }
                }
                break;
            
            case 'natural':
                if (tree_1[0] == '0') {
                    result = true;
                }
                break;
            
            default:
                break;
        }
    }
    return result;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = addPolyZero;
var latex1 = '0x^3+x^2+0x+90';
var latex2 = '-0x^3+x^2-0x+90';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/