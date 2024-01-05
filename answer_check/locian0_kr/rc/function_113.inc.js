export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        let nterm = [];
        const varterm = [];

        operand.forEach(term => {
            term[1][0] === 'power' ? (term[1][1][0] === 'natural' && term[1][2][0] === 'natural') ? nterm.push([term[0], ['natural', Math.pow(term[1][1][1], term[1][2][1]).toString()]])
                : varterm.push(term)
            : term[1][0] === 'natural' ? nterm.push(term)
            : varterm.push(term);
        });
        if (nterm.length !== 0) {
            const [first] = nterm;
            [, ...nterm] = nterm;
            let value = first[1][1];
            nterm.forEach(nt => {
                if (nt[0] === 'mul') {
                    value *= nt[1][1]
                } else if (nt[0] === 'div') {
                    value /= nt[1][1];
                }
            });
            return varterm.length === 0 ? ['natural', value.toString()]
            : [operator, ['mul', ['natural', value.toString()]], ...varterm];
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => mulConstCal(term));
    return [operator, ...newOperand];
}
