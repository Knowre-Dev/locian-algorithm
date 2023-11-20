import {addAssociative} from '../rc/function_45.inc.js';
import _ from 'lodash';

export function setAssociative(tree) {    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    for (let v of tree_1) {
        let term = addAssociative(v);
        if (operator === term[0]) {
            term.shift();
            newOperand = newOperand.concat(term);
            
        } else {
            newOperand.push(term);
        }
    }
    return [operator].concat(newOperand);
    
    
}


