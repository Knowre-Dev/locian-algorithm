export function mulToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const power = {};
        let varNum = [];
        operand.forEach(term => {
            term[0] === 'mul' ? term[1][0] === 'variable' ? power[term[1][1]] = !Object.prototype.hasOwnProperty.call(power, term[1][1]) ? [term[1]]
                    : [...power[term[1][1]], term[1]]
                : (term[1][0] === 'power' && term[1][1][0] === 'variable') ? varNum = [...varNum, term]
                : varNum = [...varNum, term]
            : varNum = [...varNum, term];
        });
        const power_values = Object.values(power);
        power_values.forEach(term => {
            const term_length = term.length;
            varNum = term_length > 1 ? [...varNum, ['mul', ['power', term[0], ['natural', (term_length).toString()]]]]
            : [...varNum, ['mul', term[0]]];
        });
        return varNum.length === 1 ? varNum[0][1] : [operator, ...varNum];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => mulToExp(term));
    return [operator, ...newOperand];
}
