export function absToMul(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'absolute') {
        return [operator, ...operand.map(term => absToMul(term))];
    }
    const [[operator_1, ...operand_1]] = operand;
    if (operator_1 === 'variable') {
        return tree;
    }
    if (operator_1 === 'negative' && operand_1[0][0] === 'variable') {
        return [operator, ...operand_1];
    }
    if (operator_1 === 'mulchain') {
        let vari = [];
        let nat = [];
        operand_1.forEach(term => {
            term[1][0] === 'negative'
                ? term[1][1][0] === 'variable'
                    ? vari = [...vari, [term[0], term[1][1]]]
                    : nat = [...nat, [term[0], term[1][1]]]
                : term[1][0] === 'variable'
                    ? vari = [...vari, term]
                    : nat = [...nat, term];
        });
        return nat.length === 0
            ? [operator, ['mulchain', ...vari]]
            : vari.length === 1
                ? ['mulchain', ...nat, ...[[vari[0][0], ['absolute', vari[0][1]]]]]
                : ['mulchain', ...nat, ...[['mul', ['absolute', ['mulchain', ...vari]]]]];
    }
    return operator_1 === 'negative'
        ? absToMul(['absolute', ...operand_1])
        : tree;
}
