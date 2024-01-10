export function divIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        let newOperand = [];
        operand.forEach(term => {
            if (term[0] !== 'div' || term[1][0] !== 'natural' || term[1][1] !== '1') {
                newOperand = [...newOperand, term];
            }
        });
        return newOperand.length === 1 ? newOperand[0][1] : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => divIdentity(term))];
}
