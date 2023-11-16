import _ from 'lodash';

export function powIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'power') {
        if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
            operator = tree_1[0].shift();
            newOperand = tree_1[0];
        } else {
            newOperand = tree_1;
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(powIdentity(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
var tree1 = LatexToTree('x^2');
var tree2 = LatexToTree('x');
var tree11 = powIdentity(tree1);
var tree21 = powIdentity(tree2);
var result1 = JSON.stringify(tree11, null, 4);
var result2 = JSON.stringify(tree21, null, 4);
console.log(compareMathTree(result1, result2));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/