export function addPolyZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const operator = tree[0];
    if (operator === 'addchain') {
        const tree_1 = tree.slice(1);
        const newOperand = [];
        for (const term of tree_1) {
            term[0] === 'sub' ? checkZeroEquiv(term[1]) ? newOperand.push(['add', term[1]])
                                : newOperand.push(term)
            : newOperand.push(term);
        }
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(addPolyZero(v));
    }
    return [operator].concat(newOperand);
}

export function checkZeroEquiv(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }

    const operator = tree[0];
    switch (operator) {
        case 'fraction': {
            const tree_1 = tree.slice(1);
            return checkZeroEquiv(tree_1[0]);
        }
        case 'mulchain': {
            const tree_1 = tree.slice(1);
            const tree_1_0 = tree_1[0];
            let result = false
            for (const term of tree_1_0) {
                if (term[0] === 'natural' && term[1] === '0') {
                    result = true;
                }
            }
            return result;
        }
        case 'natural': {
            const tree_1 = tree.slice(1);
            let result = false
            if (tree_1[0] === '0') {
                result = true;
            }
            return result;
        }
        default: {
            return false;
        }
    }
}
