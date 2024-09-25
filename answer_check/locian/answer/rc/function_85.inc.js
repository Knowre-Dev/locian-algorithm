export function ineqSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    return operator === 'inequality'
        ? operand.length === 3
            ? (operand[0][0] === vari[0] && operand[0][1] === vari[1]) || operand[0][0] === 'variable'
                ? [operator, ['infinity'], 'gt', ...operand]
                : [...tree, 'gt', ['negative', ['infinity']]]
            : tree
        : [operator, ...operand.map(term => ineqSetNot(term))];
}
