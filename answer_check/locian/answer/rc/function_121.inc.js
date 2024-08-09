// power의 base가 mulchain인 경우 항분리 (abc)^2 => a^2b^2c^2
export function mulPowSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => mulPowSeparation(term))];
    }
    const [base, exp] = operand;
    if (base[0] !== 'mulchain') {
        return tree;
    }
    const newOperand = base.reduce((terms, term_0) => Array.isArray(term_0)
        ? [...terms, [term_0[0], ['power', term_0[1], exp]]]
        : terms,
    []);
    return ['mulchain', ...newOperand];
}
