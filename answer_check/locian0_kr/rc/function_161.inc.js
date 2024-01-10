export function divFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        let newOperand = [operand[0]];
        const [, ...operand_1] = operand;
        const operand_length = operand.length;
        for (const term of operand_1) {
            if (term[0] === 'div' && newOperand[newOperand.length - 1][0] === 'mul') {
                if (operand_length === 2) {
                    return ['fraction', divFrac(newOperand.pop()[1]), divFrac(term[1])];
                }
                newOperand = [...newOperand, ['mul', ['fraction', divFrac(newOperand.pop()[1]), divFrac(term[1])]]];
            } else {
                newOperand = [...newOperand, divFrac(term)];
            }
        }
        return newOperand.length === 1 ? newOperand[0][1]
            : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => divFrac(term))];
}
