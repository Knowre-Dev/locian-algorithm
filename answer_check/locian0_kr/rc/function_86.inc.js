export function decIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    switch (operator) {
        case 'decimal': {
            const tree_1 = tree.slice(1);
            if (tree_1[0].substr(0, 1) === '.') {
                const newOperand = [];
                newOperand.push('0' + tree_1[0]);
                return [operator].concat(newOperand);
            }
            return tree;
        }
        case 'rdecimal': {
            const tree_1 = tree.slice(1);
            if (tree_1[0] === '') {
                const newOperand = [];
                newOperand.push('0');
                newOperand.push(tree_1[1]);
                newOperand.push(tree_1[2]);
                return [operator].concat(newOperand);
            }
            return tree;
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(decIdentity(v));
            }
            return [operator].concat(newOperand);
        }
    }
}
