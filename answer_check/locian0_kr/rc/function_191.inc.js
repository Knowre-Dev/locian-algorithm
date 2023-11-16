import _ from 'lodash';

export function nthrootToSquareroot(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var newOperand = [];
    var operator = tree_1.shift();
    if (operator === 'nthroot' && JSON.stringify(tree_1[0]) === JSON.stringify([])) {
        operator = 'squareroot';
        newOperand = [tree_1[1]];         
    } else {
        for (var v of tree_1) {
            newOperand.push(nthrootToSquareroot(v));
        }           
    }
    tree_1 = [operator].concat(newOperand);
    
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