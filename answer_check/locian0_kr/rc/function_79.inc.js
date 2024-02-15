export function decElimZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (operator !== 'decimal') {
        return [operator, ...operand.map(term => decElimZero(term))];
    }
    const decArr = operand[0].split('');
    while (decArr[decArr.length - 1] === '0') {
        decArr.splice(-1);
    }
    if (decArr[decArr.length - 1] === '.') {
        operator = 'natural';
        decArr.splice(-1);
    }
    return [operator, decArr.join('')];
}
