export function divFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        const operand_length = operand.length;
        for (let k = 0; k < operand_length; k++) {
            if (k === 0) {
                newOperand.push(operand[k]);
            } else if (operand[k][0] === 'div' && newOperand[newOperand.length - 1][0] === 'mul') {
                if (operand_length === 2) {
                    return ['fraction', divFrac(newOperand.pop()[1]), divFrac(operand[k][1])];
                }
                newOperand.push(['mul', ['fraction', divFrac(newOperand.pop()[1]), divFrac(operand[k][1])]]);
            } else {
                newOperand.push(divFrac(operand[k]));
            }
        }
        return newOperand.length === 1 ? newOperand[0][1]
            : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(divFrac(term));
    }
    return [operator, ...newOperand];
}
