import _ from 'lodash';

export function powDecomposition(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'power') {
        let base = powDecomposition(tree_1[0]);
        let expo = powDecomposition(tree_1[1]);
        if (base[0] === 'addchain' && expo[0] === 'natural') {
            operator = 'mulchain';
            let expo_int = parseInt(expo[1]);
            for (let i = 0; i < expo_int; i++) {                    
                newOperand.push(['mul', base]);    
            }                   
        } else {
            newOperand = [base, expo];
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(powDecomposition(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}

/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
        let tree1 = LatexToTree('x^2');
        let tree2 = LatexToTree('x\\times x');
        let tree11 = powDecomposition(tree1);
        let tree21 = powDecomposition(tree2);
        let result1 = JSON.stringify(tree11, null, 4);
        let result2 = JSON.stringify(tree21, null, 4);
        console.log(compareMathTree(result1, result2));
        console.log(JSON.stringify(tree11, null, 4));
        console.log(JSON.stringify(tree21, null, 4));
*/