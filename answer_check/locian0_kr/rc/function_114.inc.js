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
    const [first_term, ...term_rest] = operand;
    return ['negative', ['mulchain', ['mul', first_term[1][1]], ...term_rest]];
}
