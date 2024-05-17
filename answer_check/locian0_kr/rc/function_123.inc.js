// 1/(ab) => 1/a*1/b
export function mulFracSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;

    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => mulFracSeparation(term))];
    }
    const [num, den] = operand;
    const is_num_one = JSON.stringify(num) === JSON.stringify(['natural', '1']) && den[0] === 'mulchain';
    if (is_num_one) {
        const newOperand = den.reduce((terms, term_1) => Array.isArray(term_1)
            ? [...terms, [term_1[0], ['fraction', num, term_1[1]]]]
            : terms,
        []);
        return ['mulchain', ...newOperand];
    }
    return tree;
}
