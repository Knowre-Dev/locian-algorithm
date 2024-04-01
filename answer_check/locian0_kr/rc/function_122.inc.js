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
    const [num, den] = operand;
    const newOperand = num.reduce((terms, term_0) => Array.isArray(term_0)
        ? [...terms, ['power', term_0, den]]
        : terms,
    []); // num이  addchain || mulchain 인 경우만 frac으로
    return ['fraction', ...newOperand];
}
