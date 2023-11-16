import _ from 'lodash';

export function powDecomposition(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'power') {
        var base = powDecomposition(tree_1[0]);
        var expo = powDecomposition(tree_1[1]);
        if (base[0] === 'addchain' && expo[0] === 'natural') {
            operator = 'mulchain';
            var expo_int = parseInt(expo[1]);
            for (var i = 0; i < expo_int; i++) {                    
                newOperand.push(['mul', base]);    
            }                   
        } else {
            newOperand = [base, expo];
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(powDecomposition(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
        var tree1 = LatexToTree('x^2');
        var tree2 = LatexToTree('x\\times x');
        var tree11 = powDecomposition(tree1);
        var tree21 = powDecomposition(tree2);
        var result1 = JSON.stringify(tree11, null, 4);
        var result2 = JSON.stringify(tree21, null, 4);
        console.log(compareMathTree(result1, result2));
        console.log(JSON.stringify(tree11, null, 4));
        console.log(JSON.stringify(tree21, null, 4));
*/