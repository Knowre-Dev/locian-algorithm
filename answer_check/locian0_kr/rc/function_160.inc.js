export function mulNegative(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            const newOperand = mulNegative(tree[1]);
            return newOperand[0] === 'negative' ? newOperand[1]
                : [operator, newOperand];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let newOperand = [];
            let sign = 1;
            operand.forEach(mterm => {
                if (mterm[1][0] === 'negative') {
                    sign *= -1;
                    [, [, mterm[1]]] = mterm;
                }
                newOperand = [...newOperand, mterm];
            });
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        default: {
            const [, ...operand] = tree;
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                let ner_term = mulNegative(term);
                if (operator === 'fraction' && ner_term[0] === 'negative') {
                    sign *= -1;
                    [, ner_term] = ner_term;
                }
                newOperand = [...newOperand, ner_term];
            });
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
    }
}
