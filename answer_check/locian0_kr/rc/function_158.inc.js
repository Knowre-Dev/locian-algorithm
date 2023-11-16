import _ from 'lodash';

export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var sign = 1;
    var newOperand = [];
    if (operator === 'fraction') {
        var num = fracPlusMinus(tree_1[0]);
        var den = fracPlusMinus(tree_1[1]);
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
        for (var v of tree_1) {
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
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

