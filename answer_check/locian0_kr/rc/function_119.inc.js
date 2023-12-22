export function natElimZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    if (operator === 'natural') {
        const [, ...operand] = tree;
        return [operator, operand[0].replaceAll(new RegExp('^0+(?!$)', 'g'), '')];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => natElimZero(term));
    return [operator, ...newOperand];
}
