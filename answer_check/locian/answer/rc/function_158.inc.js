export function fracPlusMinus(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracPlusMinus(term))];
    }
    const newOperand = operand.map(term => fracPlusMinus(term));
    let sign = 1;
    const ops = new Map([
        ['negative', -1],
        ['pm', 2],
        ['mp', -2]
    ]);
    newOperand.forEach((term, key) => {
        const [op_term] = term;
        if (ops.has(op_term)) {
            [, newOperand[key]] = term;
            sign *= ops.get(op_term);
        }
    })
    const new_tree = [operator, ...newOperand];
    return sign >= 2
        ? ['pm', new_tree]
        : sign <= -2
            ? ['mp', new_tree]
            : tree;
}
