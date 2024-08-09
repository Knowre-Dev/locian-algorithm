export function negParenthesis(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => negParenthesis(term))];
    }
    if (operand[0][0] === 'add' && operand[0][1][0] === 'negative') {
        operand[0] = ['sub', operand[0][1][1]];
    }
    return [operator, ...operand];
}
