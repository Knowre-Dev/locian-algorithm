// absoulte에서 negative 제거

export function absToMul(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'absolute') {
        return [operator, ...operand.map(term => absToMul(term))];
    }
    // operator === 'absolute'
    const [[operator_1, ...operand_1]] = operand;
    if (operator_1 === 'variable') {
        return tree;
    }
    if (operator_1 === 'negative') {
        return operand_1[0][0] === 'variable'
            ? [operator, ...operand_1]
            : absToMul(['absolute', ...operand_1]);
    }
    if (operator_1 !== 'mulchain') {
        return tree;
    }
    let vars = [];
    let others = [];
    // 변수와 다른 것들 분리 및 negative 제거
    operand_1.forEach(term => {
        const [op, term_1] = term;
        term_1[0] === 'negative'
            ? term_1[1][0] === 'variable'
                ? vars = [...vars, [op, term_1[1]]]
                : others = [...others, [op, term_1[1]]]
            : term_1[0] === 'variable'
                ? vars = [...vars, term]
                : others = [...others, term];
    });
    return others.length === 0
        ? [operator, ['mulchain', ...vars]]
        : vars.length === 1
            ? ['mulchain', ...others, ...[[vars[0][0], ['absolute', vars[0][1]]]]]
            : ['mulchain', ...others, ...[['mul', ['absolute', ['mulchain', ...vars]]]]];
}
