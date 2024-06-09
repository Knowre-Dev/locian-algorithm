export function mulAssociative(tree) { // a(bc) => abc
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        term = mulAssociative(term);
        if (operator === 'mulchain') {
            const [op, [op_1, ...operand_1]] = term;
            newOperand = op === 'mul' && op_1 === 'mulchain'
                ? [...newOperand, ...operand_1]
                : [...newOperand, term];
        } else {
            newOperand = [...newOperand, term];
        }
    });
    return [operator, ...newOperand];
}
