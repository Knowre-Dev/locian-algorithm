export function mulFracSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;

    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => mulFracSeparation(term))];
    }
    if (operand[1][0] === 'mulchain' && JSON.stringify(operand[0]) === JSON.stringify(['natural', '1'])) {
        const newOperand = operand[1].reduce((terms, term_1) => Array.isArray(term_1)
            ? [...terms, [term_1[0], ['fraction', operand[0], term_1[1]]]]
            : terms,
        []);
        return ['mulchain', ...newOperand];
    }
    return tree;
}
