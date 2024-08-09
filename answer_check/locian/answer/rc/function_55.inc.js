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
    const length_new = newOperand.length;
    const signs = new Map([
        ['sub', 'negative'],
        ['addsub', 'pm'],
        ['subadd', 'mp']
    ]);
    const [[op_0, term_0]] = newOperand;
    return length_new === 0
        ? ['natural', '0']
        : length_new === 1 && op_0 === 'add'
                ? term_0
                : length_new === 1 && signs.has(op_0)
                    ? [signs.get(op_0), term_0]
                    : [operator, ...newOperand];
}
