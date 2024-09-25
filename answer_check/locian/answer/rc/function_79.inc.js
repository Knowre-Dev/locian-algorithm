// 소수에서 불필요한 0제거 1.00 => 1
export function decElimZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'decimal') {
        return [operator, ...operand.map(term => decElimZero(term))];
    }
    let [number] = operand;
    number = operand[0].replace(/0+$/, ''); ;
    return number.charAt(number.length - 1) === '.'
        ? ['natural', number.replace(/.$/, '')]
        : [operator, number];
}
