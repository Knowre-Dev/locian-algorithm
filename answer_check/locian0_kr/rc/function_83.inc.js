// addchain sign 정리 -(-a+b) => a-b

export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => addAdjacentSigns(term))];
    }
    let newOperand = [];
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    operand.forEach(term => {
        let [op, term_1] = term;
        term_1 = addAdjacentSigns(term_1);
        const term_new = term_1[0] === 'negative'
            ? signs.has(op)
                ? [signs.get(op), term_1[1]]
                : [op, term_1[1]]
            : [op, term_1];
        newOperand = [...newOperand, term_new];
    });
    return [operator, ...newOperand];
}
