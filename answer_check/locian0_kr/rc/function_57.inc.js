export function divIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        for (const term of operand) {
            if (term[0] !== 'div' || term[1][0] !== 'natural' || term[1][1] !== '1') {
                newOperand.push(term);
            }
        }
        return newOperand.length === 1 ? newOperand[0][1] : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => divIdentity(term));
    return [operator, ...newOperand];
}
