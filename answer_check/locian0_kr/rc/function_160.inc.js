export function mulNegative(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            const newsubtree = mulNegative(tree[1]);
            if (newsubtree[0] === 'negative') {
                return newsubtree[1];
            }
            return [operator, newsubtree];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            let sign = 1;
            for (const mterm of operand) {
                if (mterm[1][0] === 'negative') {
                    sign *= -1;
                    mterm[1] = mterm[1][1];
                }
                newOperand.push(mterm);
            }
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = [];
            let sign = 1;
            for (const term of operand) {
                let ner_term = mulNegative(term);
                if (operator === 'fraction' && ner_term[0] === 'negative') {
                    sign *= -1;
                    ner_term = ner_term[1];
                }
                newOperand.push(ner_term);
            }
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
    }
}
