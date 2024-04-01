export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => addIdentity(term))];
    }
    const zero = JSON.stringify(['natural', '0']);
    const newOperand = operand.filter(term => JSON.stringify(term[1]) !== zero);
    const newOperand_length = newOperand.length;
    const signs = new Map([
        ['sub', 'negative'],
        ['addsub', 'pm'],
        ['subadd', 'mp']
    ]);
     return newOperand_length === 0
        ? ['natural', '0']
        : newOperand_length === 1 && newOperand[0][0] === 'add'
                ? newOperand[0][1]
                : newOperand_length === 1 && signs.get(newOperand[0][0])
                    ? [signs.get(newOperand[0][0]), newOperand[0][1]]
                    : [operator, ...newOperand];
}
