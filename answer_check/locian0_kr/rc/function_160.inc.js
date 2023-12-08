export function mulNegative(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const operator = tree[0];
    switch (operator) {
        case 'negative': {
            const newsubtree = mulNegative(tree.slice(1)[0]);
            if (newsubtree[0] === 'negative') {
                return newsubtree[1];
            }
            return [operator, newsubtree];
        }
        case 'mulchain': {
            const operand = tree.slice(1);
            const newOperand = [];
            let sign = 1;
            for (const mterm of operand) {
                if (mterm[1][0] === 'negative') {
                    sign = -1 * sign;
                    mterm[1] = mterm[1][1];
                }
                newOperand.push(mterm);
            }
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
        default: {
            const operand = tree.slice(1);
            const newOperand = [];
            let sign = 1;
            for (const subtree of operand) {
                let newsubtree = mulNegative(subtree);
                if (operator === 'fraction' && newsubtree[0] === 'negative') {
                    sign = -1 * sign;
                    newsubtree = newsubtree[1];
                }
                newOperand.push(newsubtree);
            }
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
    }
}
