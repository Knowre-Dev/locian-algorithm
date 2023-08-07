import {checkZeroEquiv} from '../rc/function_80.inc.js';

export function mulZero(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
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
    }
    return tree_1;
}

