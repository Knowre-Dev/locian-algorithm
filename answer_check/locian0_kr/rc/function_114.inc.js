// mulahcin sign정리  (-a)bc => -abc
export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulToNega(term))];
    }
    const is_not_minus_one = operand[0][1][0] === 'negative' && operand[0][1][1][0] === 'natural' && operand[0][1][1][1] !== '1';
    if (!is_not_minus_one) {
        return tree;
    }
    const [term_1, ...operand_1] = operand;
    return ['negative', ['mulchain', ['mul', term_1[1][1]], ...operand_1]];
}
