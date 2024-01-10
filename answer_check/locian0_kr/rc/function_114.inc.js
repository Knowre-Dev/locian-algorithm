export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        let [, ...operand] = tree;
        const is_not_minus_one = (operand[0][1][0] === 'negative' && operand[0][1][1][0] === 'natural' && operand[0][1][1][1] !== '1');
        if (is_not_minus_one) {
            const [first_term] = operand;
            [, ...operand] = operand;
            return ['negative', ['mulchain', ['mul', first_term[1][1]], ...operand]];
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => mulToNega(term))];
}
