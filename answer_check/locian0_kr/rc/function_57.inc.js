export function divIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        let newOperand = [];
        const div_one = JSON.stringify(['div', ['natural', '1']]);
        operand.forEach(term => {
            if (JSON.stringify(term) !== div_one) {
                newOperand = [...newOperand, term];
            }
        });
        return newOperand.length === 1 ? newOperand[0][1] : [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => divIdentity(term))];
}
