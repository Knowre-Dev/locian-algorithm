import _ from 'lodash';

export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let sign = 1;
    let newOperand = [];
    if (operator === 'fraction') {
        let num = fracPlusMinus(tree_1[0]);
        let den = fracPlusMinus(tree_1[1]);
        if (num[0] === 'negative') {
            sign = -1 * sign;
            num = num[1];
        } else if (num[0] === 'mp') {
            sign = -2;
            num = num[1];
        } else if (num[0] === 'pm') {
            sign = 2;
            num = num[1];
        }
    
        if (den[0] === 'negative') {
            sign = -1 * sign;
            den = den[1];
        } else if (den[0] === 'mp') {
            sign = Math.abs(sign) === 1 ? -2 : sign * (-1);
            den = den[1];
        } else if (den[0] === 'pm') {
            sign = Math.abs(sign) === 1 ? 2 : sign;
            den = den[1];
        }
        if (Math.abs(sign) > 1) {
            newOperand = [num, den];
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(fracPlusMinus(v));
        }
    }
    
    if (sign === -2) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'mp';
    } else if (sign === 2) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'pm';
    }
    return [operator].concat(newOperand);
    
    
}

