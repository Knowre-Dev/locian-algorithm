export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'fraction') {
            const newOperand = [];
            const operand_0 = operand[0];
            for (const term_0 of operand_0) {
                if (Array.isArray(term_0)) {
                    newOperand.push(['power', term_0, operand[1]]);
                }
            }
            return ['fraction', ...newOperand];
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powerFrac(term));
    return [operator, ...newOperand];
}
