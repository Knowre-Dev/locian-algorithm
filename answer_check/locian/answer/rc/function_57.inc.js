export function divIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => divIdentity(term))];
    }
    const div_one = JSON.stringify(['div', ['natural', '1']]);
    const newOperand = operand.filter(term => JSON.stringify(term) !== div_one);
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
