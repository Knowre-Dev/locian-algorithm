export function natElimZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];

    if (operator === 'natural') {
        const tree_1 = tree.slice(1);
        const newOperand = [];
        newOperand.push(tree_1[0].replaceAll(new RegExp('^0+(?!$)', 'g'), ''));
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(natElimZero(v));
    }
    return [operator].concat(newOperand);
}
