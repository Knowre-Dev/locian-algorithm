export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'fraction') {
            const newOperand = operand[0].reduce((terms, term_0) => Array.isArray(term_0) ? [...terms, ['power', term_0, operand[1]]]
                : terms, []);
            return ['fraction', ...newOperand];
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => powerFrac(term))];
}
