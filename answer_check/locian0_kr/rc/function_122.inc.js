export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let operator = tree[0];
    if (operator === 'power') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][0] === 'fraction') {
            operator = 'fraction';
            const newOperand = [];
            const tree_1_0 = tree_1[0];
            for (const t1 of tree_1_0) {
                if (Array.isArray(t1)) {
                    newOperand.push(['power', t1, tree_1[1]]);
                }
            }
            return [operator].concat(newOperand);
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(powerFrac(v));
    }
    return [operator].concat(newOperand);
}
