export function mulToExp(tree = null) { // mulchian to expnetial aaa => a^3
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulToExp(term))];
    }
    const powers = new Map();
    let newOperand = [];
    operand.forEach(term => {
        const [op, [op_1, term_11]] = term;
        op === 'mul' && op_1 === 'variable'
            ? powers.set(term_11, !powers.has(term_11)
                ? 1
                : powers.get(term_11) + 1)
            : newOperand = [...newOperand, term]
    });
    powers.forEach((exp, base) => {
        base = ['variable', base];
        const term_new = exp === 1
            ? base
            : ['power', base, ['natural', exp.toString()]]
        newOperand = [...newOperand, ['mul', term_new]];
    });
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
