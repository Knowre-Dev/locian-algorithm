export function mulAssociative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        const term = mulAssociative(v);
        if (operator === 'mulchain' &&
            term[0] === 'mul' &&
            term[1][0] === 'mulchain') {
            const term_1_entries = term[1].entries();
            for (const [tk, tv] of term_1_entries) {
                if (tk !== 0) {
                    newOperand.push(tv);
                }
            }
        } else {
            newOperand.push(term);
        }
    }
    return [operator].concat(newOperand);
}
