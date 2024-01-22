export function ineqSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        return operand.length === 3 ? ((operand[0][0] === vari[0] && operand[0][1] === vari[1]) || operand[0][0] === 'variable') ? [operator, ['infinity'], 'gt', ...operand]
                : [...tree, 'gt', ['negative', ['infinity']]]
            : tree
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => ineqSetNot(term))];
}
