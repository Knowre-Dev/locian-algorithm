export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        operand.forEach(term => {
            if (!(term[1][0] === 'natural' && term[1][1] === '0')) {
                newOperand.push(term);
            }
        });
        const newOperand_length = newOperand.length;
        return newOperand_length === 0 ? ['natural', '0']
            : newOperand_length === 1 ? newOperand[0][0] === 'add' ? newOperand[0][1]
                : newOperand[0][0] === 'sub' ? ['negative', newOperand[0][1]]
                : newOperand[0][0] === 'addsub' ? ['pm', newOperand[0][1]]
                : newOperand[0][0] === 'subadd' ? ['mp', newOperand[0][1]]
                : [operator, ...newOperand]
            : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => addIdentity(term));
    return [operator, ...newOperand];
}
