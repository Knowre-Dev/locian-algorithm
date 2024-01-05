export function mulPowSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        if (operand[0][0] === 'mulchain') {
            const newOperand = [];
            const operand_0 = operand[0];
            operand_0.forEach(term_0 => {
                if (Array.isArray(term_0)) {
                    newOperand.push([term_0[0], ['power', term_0[1], operand[1]]]);
                }
            });
            return ['mulchain', ...newOperand];
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => mulPowSeparation(term));
    return [operator, ...newOperand];
}
