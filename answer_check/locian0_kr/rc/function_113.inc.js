export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        const nterm = [];
        const varterm = [];

        for (const t of tree_1) {
            if (t[1][0] === 'power') {
                if (t[1][1][0] === 'natural' && t[1][2][0] === 'natural') {
                    let base = t[1][1][1];
                    const top = t[1][2][1];
                    for (let i = 1; i < top; i++) {
                        base = base * base;
                    }
                    nterm.push([t[0], ['natural', base.toString()]]);
                } else {
                    varterm.push(t);
                }
            } else if (t[1][0] === 'natural') {
                nterm.push(t);
            } else {
                varterm.push(t);
            }
        }

        if (nterm.length !== 0) {
            const first = nterm.shift();
            let value = first[1][1];
            for (const nt of nterm) {
                if (nt[0] === 'mul') {
                    value = value * nt[1][1]
                } else if (nt[0] === 'div') {
                    value = value / nt[1][1];
                }
            }

            if (varterm.length === 0) {
                return ['natural', value.toString()];
            }
            return [operator, ['mul', ['natural', value.toString()]]].concat(varterm);
        }
        return tree;
    }
    const newOperand = [];
    const tree_1 = tree.slice(1);
    for (const v of tree_1) {
        newOperand.push(mulConstCal(v));
    }
    return [operator].concat(newOperand);
}
