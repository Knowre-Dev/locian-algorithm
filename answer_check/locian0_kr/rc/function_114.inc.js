// mulahcin sign정리  (-a)bc => -abc
export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulToNega(term))];
    }
    const [term_0, ...operand_1] = operand;
    const is_not_minus_one = term_0[1][0] === 'negative' && term_0[1][1][0] === 'natural' && term_0[1][1][1] !== '1';
    return is_not_minus_one
        ? ['negative', ['mulchain', ['mul', term_0[1][1]], ...operand_1]]
        : tree;
}
