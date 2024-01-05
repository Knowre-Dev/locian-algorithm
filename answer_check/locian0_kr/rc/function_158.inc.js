export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        let num = fracPlusMinus(operand[0]);
        let sign = 1;
        switch (num[0]) {
            case 'negative': {
                sign = -1;
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
        let den = fracPlusMinus(operand[1]);
        switch (den[0]) {
            case 'negative': {
                sign *= -1;
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
        return sign === -2 ? ['mp', [operator, num, den]]
            : sign === 2 ? ['pm', [operator, num, den]]
            : tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => fracPlusMinus(term))];
}
