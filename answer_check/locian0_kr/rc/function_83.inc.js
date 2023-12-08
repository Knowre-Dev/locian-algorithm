export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'addchain') {
        const tree_1 = tree.slice(1);
        const newOperand = [];
        for (const term of tree_1) {
            const nterm = addAdjacentSigns(term[1]);
            if (nterm[0] === 'negative') {
                switch (term[0]) {
                    case 'add': {
                        newOperand.push(['sub', nterm[1]]);
                        break;
                    }
                    case 'sub': {
                        newOperand.push(['add', nterm[1]]);
                        break;
                    }
                    default: {
                        newOperand.push([term[0], nterm[1]]);
                    }
                }
            } else {
                newOperand.push([term[0], nterm]);
            }
        }
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(addAdjacentSigns(v));
    }
    return [operator].concat(newOperand);
}
