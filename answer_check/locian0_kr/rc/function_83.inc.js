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
        const nterm = addAdjacentSigns(term[1]);
        newOperand = nterm[0] === 'negative'
            ? signs.get(term[0])
                ? [...newOperand, [signs.get(term[0]), nterm[1]]]
                : [...newOperand, [term[0], nterm[1]]]
            : [...newOperand, [term[0], nterm]];
    });
    return [operator, ...newOperand];
}
