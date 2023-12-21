export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const nterm = [];
        const varterm = [];

        for (const term of operand) {
            if (term[1][0] === 'power') {
                if (term[1][1][0] === 'natural' && term[1][2][0] === 'natural') {
                    let base = term[1][1][1];
                    const top = term[1][2][1];
                    for (let i = 1; i < top; i++) {
                        base = base * base;
                    }
                    nterm.push([term[0], ['natural', base.toString()]]);
                } else {
                    varterm.push(term);
                }
            } else if (term[1][0] === 'natural') {
                nterm.push(term);
            } else {
                varterm.push(term);
            }
        }

        if (nterm.length !== 0) {
            const first = nterm.shift();
            let value = first[1][1];
            for (const nt of nterm) {
                if (nt[0] === 'mul') {
                    value *= nt[1][1]
                } else if (nt[0] === 'div') {
                    value /= nt[1][1];
                }
            }

            if (varterm.length === 0) {
                return ['natural', value.toString()];
            }
            return [operator, ['mul', ['natural', value.toString()]], ...varterm];
        }
        return tree;
    }
    const newOperand = [];
    const [, ...operand] = tree;
    for (const term of operand) {
        newOperand.push(mulConstCal(term));
    }
    return [operator, ...newOperand];
}
