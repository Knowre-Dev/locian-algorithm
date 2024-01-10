export function absToMul(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'absolute') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'variable') {
            return tree;
        }
        if (operand[0][0] === 'negative' && operand[0][1][0] === 'variable') {
            return [operator, ...operand[0].slice(1)];
        }
        if (operand[0][0] === 'mulchain') {
            const [, ...ntree] = operand[0];
            let vari = [];
            let nat = [];
            ntree.forEach(term_ntree => {
                term_ntree[1][0] === 'negative' ? term_ntree[1][1][0] === 'variable' ? vari = [...vari, [term_ntree[0], term_ntree[1][1]]]
                    : nat = [...nat, [term_ntree[0], term_ntree[1][1]]]
                : term_ntree[1][0] === 'variable' ? vari = [...vari, term_ntree]
                    : nat = [...nat, term_ntree];
            });
            return nat.length === 0 ? [operator, ['mulchain', ...vari]]
                : vari.length === 1 ? ['mulchain', ...nat, ...[[vari[0][0], ['absolute', vari[0][1]]]]]
                : ['mulchain', ...nat, ...[['mul', ['absolute', ['mulchain', ...vari]]]]];
        }
        if (operand[0][0] === 'negative') {
            operand[0][0] = 'absolute';
            return absToMul(operand[0]);
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => absToMul(term))];
}
