export function divFrac(tree) { // div => frac
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => divFrac(term))];
    }
    if (operand.length === 2 && operand[1] === 'div') {
        return ['fraction', divFrac(operand[0][1]), divFrac(operand[1][1])];
    }
    const [operand_0, ...operand_1] = operand;
    const newOperand_1 = operand_1.map(term => (term[0] === 'div' && newOperand.pop()[0] === 'mul')
    ? ['mul', ['fraction', divFrac(newOperand.pop()[1]), divFrac(term[1])]]
    : divFrac(term))
    const newOperand = [operand_0, ...newOperand_1];
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
