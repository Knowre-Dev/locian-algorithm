export function ineqSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        if (operand.length === 3) {
            if ((operand[0][0] === vari[0] && operand[0][1] === vari[1]) || operand[0][0] === 'variable') {
                return [operator, ['infinity'], 'gt', ...operand];
            }
            return [...tree, 'gt', ['negative', ['infinity']]];
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(ineqSetNot(term));
    }
    return [operator, ...newOperand];
}
