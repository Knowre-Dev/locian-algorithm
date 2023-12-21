export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'negative') {
            const newOperand = [];
            const operand_reverse = operand.reverse();
            for (const term_reverse of operand_reverse) {
                Array.isArray(term_reverse) ? term_reverse[0] === 'negative' ? newOperand.push(term_reverse[1])
                    : newOperand.push(['negative', term_reverse])
                : newOperand.push(term_reverse);
            }
            return [operator, ...newOperand];
        }
        return tree;
    }
    return tree;
}
