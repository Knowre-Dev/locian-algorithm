export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'fraction') {
            let newOperand = [];
            const [operand_0] = operand;
            operand_0.forEach(term_0 => {
                if (Array.isArray(term_0)) {
                    newOperand = [...newOperand, ['power', term_0, operand[1]]];
                }
            });
            return ['fraction', ...newOperand];
        }
        return tree;
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => powerFrac(term))];
}
