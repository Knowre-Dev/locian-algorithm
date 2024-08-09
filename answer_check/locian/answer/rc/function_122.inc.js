//  frac의 power를 power들의 frac으로 (a/b)^c => a^c/b^c
export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powerFrac(term))];
    }
    const [base, exp] = operand;
    if (base[0] !== 'fraction') {
        return tree;
    }
    // base가  addchain || mulchain 인 경우만 frac으로
    const newOperand = base.reduce((terms, term_0) => Array.isArray(term_0)
        ? [...terms, ['power', term_0, exp]]
        : terms,
    []);
    return ['fraction', ...newOperand];
}
