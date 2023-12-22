export function fracIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        const is_one = operand[1][0] === 'natural' && operand[1][1] === '1';
        return is_one ? operand[0] : tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => fracIdentity(term));
    return [operator, ...newOperand];
}
