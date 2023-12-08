export function fracIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];

    if (operator === 'fraction') {
        const tree_1 = tree.slice(1);
        let newOperand = [];
        if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
            operator = tree_1[0].shift();
            newOperand = tree_1[0];
        } else {
            newOperand = tree_1;
        }
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(fracIdentity(v));
    }

    return [operator].concat(newOperand);
}
