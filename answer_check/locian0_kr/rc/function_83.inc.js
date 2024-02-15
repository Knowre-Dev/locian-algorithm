export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => addAdjacentSigns(term))];
    }
    let newOperand = [];
    operand.forEach(term => {
        const nterm = addAdjacentSigns(term[1]);
        newOperand = nterm[0] === 'negative'
            ? term[0] === 'add'
                ? [...newOperand, ['sub', nterm[1]]]
                : term[0] === 'sub'
                    ? [...newOperand, ['add', nterm[1]]]
                    : [...newOperand, [term[0], nterm[1]]]
            : [...newOperand, [term[0], nterm]];
    });
    return [operator, ...newOperand];
}
