import {checkZeroEquiv} from '../rc/function_80.inc.js';
import _ from 'lodash';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    
    let newOperand = [];
    if (operator === 'mulchain') {
        let zero = false;
        for (let term of tree_1) {
            if (checkZeroEquiv(term[1])) {
                zero = true;
            }
        }
        if (zero) {
            operator = 'natural';
            newOperand.push('0');
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(mulZero(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}

