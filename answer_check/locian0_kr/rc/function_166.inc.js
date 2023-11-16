import {addAssociative} from '../rc/function_45.inc.js';
import _ from 'lodash';

export function setAssociative(tree) {    
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
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
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}


