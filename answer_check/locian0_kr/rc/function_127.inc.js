export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'inequality') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][0] === 'negative') {
            const temp = [];
            const tree_2 = tree_1.reverse();
            for (const v of tree_2) {
                Array.isArray(v) ? v[0] === 'negative' ? temp.push(v[1])
                                : temp.push(['negative', v])
                : temp.push(v);
            }
            return [operator].concat(temp);
        }
        return tree;
    }
    return tree;
}
