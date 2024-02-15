export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powerFrac(term))];
    }
    if (operand[0][0] !== 'fraction') {
        return tree;
    }
    const newOperand = operand[0].reduce((terms, term_0) => Array.isArray(term_0)
        ? [...terms, ['power', term_0, operand[1]]]
        : terms,
    []);
    return ['fraction', ...newOperand];
}
