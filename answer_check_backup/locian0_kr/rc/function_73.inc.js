import {addNegative} from '../rc/function_71.inc.js';

export function eqMulNeg(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'equation' && 
            (tree_1[0][0] === 'negative' || (tree_1[0][0] === 'addchain' && tree_1[0][1][0] === 'sub'))) {
            if (tree_1[0][0] === 'negative') {
                newOperand.push(tree_1[0][1]);
            } else {
                newOperand.push(addNegative(['negative', tree_1[0]]));
            }
            
            if (tree_1[1][0] === 'negative') {
                newOperand.push(tree_1[1][1]);
            } else if (tree_1[1][0] === 'addchain') {
                newOperand.push(addNegative(['negative', tree_1[1]]));
            } else if (tree_1[1][0] === 'natural' && tree_1[1][1] === '0') {
                newOperand.push(tree_1[1]);
            } else {
                newOperand.push(['negative', tree_1[1]]);
            }
        } else {
            newOperand = tree_1;
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


