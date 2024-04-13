export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracPlusMinus(term))];
    }

    let num = fracPlusMinus(operand[0]);
    let den = fracPlusMinus(operand[1]);
    let sign = 1;
    const ops = new Map([
        ['negative', -1],
        ['pm', 2],
        ['mp', -2]
    ]);
    if (ops.has(num[0])) {
        [, num] = num;
        sign *= ops.get(num[0]);
    }
    if (ops.has(den[0])) {
        [, den] = den;
        sign *= ops.get(den[0])
    }
    return sign >= 2
        ? ['pm', [operator, num, den]]
        : sign <= -2
            ? ['mp', [operator, num, den]]
            : tree;
}
