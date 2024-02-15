export function powerOne(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'power'
        ? JSON.stringify(operand[0]) === JSON.stringify(['natural', '1'])
            ? ['natural', '1']
            : tree
        : [operator, ...operand.map(term => powerOne(term))];
}
