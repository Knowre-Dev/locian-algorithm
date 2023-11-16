import {checkZeroEquiv} from '../rc/function_80.inc.js';
import _ from 'lodash';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);

    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'mulchain') {
        var zero = false;
        for (var term of tree_1) {
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
        for (var v of tree_1) {
            newOperand.push(mulZero(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

