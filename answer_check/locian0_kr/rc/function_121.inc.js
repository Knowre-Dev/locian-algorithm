export function mulPowSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'mulchain') {
            const newOperand = operand[0].reduce((terms, term_0) => Array.isArray(term_0) ? [...terms, [term_0[0], ['power', term_0[1], operand[1]]]]
                : terms, [])
            return ['mulchain', ...newOperand];
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => mulPowSeparation(term))];
}
