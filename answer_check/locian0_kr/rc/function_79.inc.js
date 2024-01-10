export function decElimZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'decimal') {
        const [, ...operand] = tree;
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
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => decElimZero(term))];
}
