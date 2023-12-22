export function powerOne(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        return (operand[0][0] === 'natural' && operand[0][1] === '1') ? ['natural', '1']
            : tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powerOne(term));
    return [operator, ...newOperand];
}
