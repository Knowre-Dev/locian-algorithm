export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'inequality') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'negative') {
            const operand_reverse = operand.reverse();
            const newOperand = operand_reverse.map(term_reverse =>
                Array.isArray(term_reverse) ? term_reverse[0] === 'negative' ? term_reverse[1]
                    : ['negative', term_reverse]
                : term_reverse);
            return [operator, ...newOperand];
        }
        return tree;
    }
    return tree;
}
