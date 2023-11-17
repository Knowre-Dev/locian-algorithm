import {addNegative} from '../rc/function_71.inc.js';
import _ from 'lodash';

export function eqMulNeg(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
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
    return [operator].concat(newOperand);
    
   
}


