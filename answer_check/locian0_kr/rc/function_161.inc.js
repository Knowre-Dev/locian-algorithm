export function divFrac(tree) {
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
    let newOperand = [operand[0]];
    const [, ...operand_1] = operand;
    newOperand = [...newOperand, ...operand_1.map(term => (term[0] === 'div' && newOperand.pop()[0] === 'mul')
        ? ['mul', ['fraction', divFrac(newOperand.pop()[1]), divFrac(term[1])]]
        : divFrac(term))];
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
