export function decElimZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'decimal') {
        return [operator, ...operand.map(term => decElimZero(term))];
    }
    const number = operand[0].replace(/0+$/, '');
    return number.charAt(number.length - 1) === '.'
        ? ['natural', number.replace(/.$/, '')]
        : [operator, number];
}
