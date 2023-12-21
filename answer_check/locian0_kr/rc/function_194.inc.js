export function mulToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const power = {};
        const varNum = [];
        for (const term of operand) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'variable') {
                    if (!Object.prototype.hasOwnProperty.call(power, term[1][1])) {
                        power[term[1][1]] = [];
                    }
                    power[term[1][1]].push(term[1]);
                } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                    varNum.push(term);
                } else {
                    varNum.push(term);
                }
            } else {
                varNum.push(term);
            }
        }
        const power_values = Object.values(power);
        for (const term of power_values) {
            const term_length = term.length;
            term_length > 1 ? varNum.push(['mul', ['power', term[0], ['natural', (term_length).toString()]]])
            : varNum.push(['mul', term[0]]);
        }
        return varNum.length === 1 ? varNum[0][1] : [operator, ...varNum];
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(mulToExp(term));
    }
    return [operator, ...newOperand];
}
