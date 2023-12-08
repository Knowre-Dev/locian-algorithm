import { checkZeroEquiv } from '../rc/function_80.inc.js';

export function mulZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        let newOperand = [];
        let zero = false;
        for (const term of tree_1) {
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
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mulZero(v));
    }
    return [operator].concat(newOperand);
}
