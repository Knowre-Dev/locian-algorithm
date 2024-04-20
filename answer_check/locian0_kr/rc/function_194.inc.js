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
        term[0] === 'mul' && term[1][0] === 'variable'
            ? powers.set(term[1][1], !powers.has(term[1][1])
                ? [term[1]]
                : [...powers.get(term[1][1]), term[1]])
            : newOperand = [...newOperand, term]
    });
    powers.forEach(term => {
        const term_length = term.length;
        newOperand = term_length > 1
            ? [...newOperand, ['mul', ['power', term[0], ['natural', (term_length).toString()]]]]
            : [...newOperand, ['mul', term[0]]];
    });
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
