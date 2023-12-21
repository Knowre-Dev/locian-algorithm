export function negParenthesis(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'add' && operand[0][1][0] === 'negative') {
            operand[0] = ['sub', operand[0][1][1]];
        }
        return [operator, ...operand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => negParenthesis(term));
    return [operator, ...newOperand];
}
