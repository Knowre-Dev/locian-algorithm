export function mulFracSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];

    if (operator === 'fraction') {
        const tree_1 = tree.slice(1);
        if (tree_1[1][0] === 'mulchain') {
            if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1') {
                operator = 'mulchain';
                const tree_1_1 = tree_1[1];
                const newOperand = [];
                for (const t1 of tree_1_1) {
                    if (Array.isArray(t1)) {
                        newOperand.push([
                            t1[0],
                            ['fraction', tree_1[0], t1[1]]
                        ]);
                    }
                }
                return [operator].concat(newOperand);
            }
            return tree;
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mulFracSeparation(v));
    }
    return [operator].concat(newOperand);
}
