export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'fraction') {
        let num = fracPlusMinus(operand[0]);
        let sign = 1;
        switch (num[0]) {
            case 'negative': {
                sign = -1;
                [, num] = num;
                break;
            }
            case 'mp': {
                sign = -2;
                [, num] = num;
                break;
            }
            case 'pm': {
                sign = 2;
                [, num] = num;
                break;
            }
        }
        let den = fracPlusMinus(operand[1]);
        switch (den[0]) {
            case 'negative': {
                sign *= -1;
                [, den] = den;
                break;
            }
            case 'mp': {
                sign = Math.abs(sign) === 1
                    ? -2
                    : sign * (-1);
                [, den] = den;
                break;
            }
            case 'pm': {
                sign = Math.abs(sign) === 1
                    ? 2
                    : sign;
                [, den] = den;
                break;
            }
        }
        return sign === -2
            ? ['mp', [operator, num, den]]
            : sign === 2
                ? ['pm', [operator, num, den]]
                : tree;
    }
    return [operator, ...operand.map(term => fracPlusMinus(term))];
}
