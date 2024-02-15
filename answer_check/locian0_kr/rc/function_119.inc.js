export function natElimZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'natural'
        ? [operator, operand[0].replaceAll(new RegExp('^0+(?!$)', 'g'), '')]
        : [operator, ...operand.map(term => natElimZero(term))];
}
