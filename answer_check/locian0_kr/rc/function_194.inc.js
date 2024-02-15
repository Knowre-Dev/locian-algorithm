export function mulToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulToExp(term))];
    }
    const power = {};
    let varNum = [];
    operand.forEach(term => {
        term[0] === 'mul'
            ? term[1][0] === 'variable'
                ? power[term[1][1]] = !Object.prototype.hasOwnProperty.call(power, term[1][1])
                    ? [term[1]]
                    : [...power[term[1][1]], term[1]]
                : varNum = [...varNum, term]
            : varNum = [...varNum, term];
    });
    Object.values(power).forEach(term => {
        const term_length = term.length;
        varNum = term_length > 1
            ? [...varNum, ['mul', ['power', term[0], ['natural', (term_length).toString()]]]]
            : [...varNum, ['mul', term[0]]];
    });
    return varNum.length === 1
        ? varNum[0][1]
        : [operator, ...varNum];
}
