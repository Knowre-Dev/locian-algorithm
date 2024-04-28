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
        const nterm = addAdjacentSigns(term[1]);
        const term_add = nterm[0] === 'negative'
            ? signs.has(term[0])
                ? [signs.get(term[0]), nterm[1]]
                : [term[0], nterm[1]]
            : [term[0], nterm];
        newOperand = [...newOperand, term_add];
    });
    return [operator, ...newOperand];
}
