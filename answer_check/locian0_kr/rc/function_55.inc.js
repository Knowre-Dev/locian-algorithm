export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        let newOperand = [];
        const zero = JSON.stringify(['natural', '0']);
        operand.forEach(term => {
            if (JSON.stringify(term[1]) !== zero) {
                newOperand = [...newOperand, term];
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
    return [operator, ...operand.map(term => addIdentity(term))];
}
