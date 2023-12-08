export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    let sign = 1;
    let newOperand = [];
    if (operator === 'fraction') {
        const tree_1 = tree.slice(1);
        let num = fracPlusMinus(tree_1[0]);
        let den = fracPlusMinus(tree_1[1]);
        switch (num[0]) {
            case 'negative': {
                sign = -1 * sign;
                num = num[1];
                break;
            }
            case 'mp': {
                sign = -2;
                num = num[1];
                break;
            }
            case 'pm': {
                sign = 2;
                num = num[1];
                break;
            }
        }
        switch (den[0]) {
            case 'negative': {
                sign = -1 * sign;
                den = den[1];
                break;
            }
            case 'mp': {
                sign = Math.abs(sign) === 1 ? -2 : sign * (-1);
                den = den[1];
                break;
            }
            case 'pm': {
                sign = Math.abs(sign) === 1 ? 2 : sign;
                den = den[1];
                break;
            }
        }
        Math.abs(sign) > 1 ? newOperand = [num, den]
        : newOperand = tree_1
    } else {
        const tree_1 = tree.slice(1);
        for (const v of tree_1) {
            newOperand.push(fracPlusMinus(v));
        }
    }

    if (sign === -2) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'mp';
        return [operator].concat(newOperand);
    }
    if (sign === 2) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'pm';
        return [operator].concat(newOperand);
    }
    return [operator].concat(newOperand);
}
