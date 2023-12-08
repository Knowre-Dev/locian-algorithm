export function powerOne(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'power') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1') {
            return ['natural', '1']
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(powerOne(v));
    }
    return [operator].concat(newOperand);
}
