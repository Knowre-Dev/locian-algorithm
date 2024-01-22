export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'negative') {
            let newOperand = [];
            const operand_reverse = operand.reverse();
            operand_reverse.forEach(term_reverse => {
                newOperand = Array.isArray(term_reverse) ? term_reverse[0] === 'negative' ? [...newOperand, term_reverse[1]]
                        : [...newOperand, ['negative', term_reverse]]
                    : [...newOperand, term_reverse];
            });
            return [operator, ...newOperand];
        }
        return tree;
    }
    return tree;
}
