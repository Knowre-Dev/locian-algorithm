export function nthrootToSquareroot(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    
    
    if (Array.isArray(tree_1)) {
        var newOperand = [];
        var operator = tree_1.shift();
        if (operator === 'nthroot' && JSON.stringify(tree_1[0]) == JSON.stringify([])) {
            operator = 'squareroot';
            newOperand = [tree_1[1]];         
        } else {
            for (var [k, v] of tree_1.entries()) {
                newOperand.push(nthrootToSquareroot(v));
            }           
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex = '\\nthroot[]{2}';
var tree1 = LatexToTree(latex);
var tree11 = nthrootToSquareroot(tree1);
var result1 = JSON.stringify(tree11, null, 4);
console.log(result1);
*/