export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = [];
        for (const term of operand) {
            const nterm = addAdjacentSigns(term[1]);
            nterm[0] === 'negative' ? term[0] === 'add' ? newOperand.push(['sub', nterm[1]])
                : term[0] === 'sub' ? newOperand.push(['add', nterm[1]])
                : newOperand.push([term[0], nterm[1]])
            : newOperand.push([term[0], nterm]);
        }
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => addAdjacentSigns(term));
    return [operator, ...newOperand];
}
