export function absToMul(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    let newOperand = [];

    if (operator === 'absolute') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][0] === 'variable') {
            return tree;
        }
        if (tree_1[0][0] === 'negative' && tree_1[0][1][0] === 'variable') {
            const ntree = tree_1[0].slice(1);
            return [operator].concat(ntree);
        }
        if (tree_1[0][0] === 'mulchain') {
            const ntree = tree_1[0].slice(1);
            const vari = [];
            const nat = [];
            for (const nt of ntree) {
                if (nt[1][0] === 'negative') {
                    nt[1][1][0] === 'variable' ? vari.push([nt[0], nt[1][1]])
                    : nat.push([nt[0], nt[1][1]]);
                } else {
                    nt[1][0] === 'variable' ? vari.push(nt)
                    : nat.push(nt);
                }
            }
            if (nat.length === 0) {
                newOperand.push(['mulchain'].concat(vari));
                return [operator].concat(newOperand);
            }
            if (vari.length === 1) {
                return ['mulchain'].concat(nat, [[vari[0][0], ['absolute', vari[0][1]]]]);
            }
            return ['mulchain'].concat(nat, [['mul', ['absolute', ['mulchain'].concat(vari)]]]);
        }
        if (tree_1[0][0] === 'negative') {
            tree_1[0][0] = 'absolute';
            newOperand = absToMul(tree_1[0]);
            operator = newOperand.shift();
            return [operator].concat(newOperand);
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    for (const v of tree_1) {
        newOperand.push(absToMul(v));
    }
    return [operator].concat(newOperand);
}
