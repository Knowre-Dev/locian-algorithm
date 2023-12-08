export function mulPowSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];

    if (operator === 'power') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][0] === 'mulchain') {
            operator = 'mulchain';
            const newOperand = [];
            const tree_1_0 = tree_1[0];
            for (const t1 of tree_1_0) {
                if (Array.isArray(t1)) {
                    newOperand.push([t1[0], ['power', t1[1], tree_1[1]]]);
                }
            }
            return [operator].concat(newOperand);
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mulPowSeparation(v));
    }
    return [operator].concat(newOperand);
}
