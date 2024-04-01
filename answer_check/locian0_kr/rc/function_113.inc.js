export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulConstCal(term))];
    }
    let nterm = [];
    let varterm = [];
    operand.forEach(term => {
        term[1][0] === 'natural'
            ? nterm = [...nterm, term]
            : term[1][0] === 'power' && term[1][1][0] === 'natural' && term[1][2][0] === 'natural'
                ? nterm = [...nterm, [term[0], ['natural', Math.pow(term[1][1][1], term[1][2][1]).toString()]]]
                : varterm = [...varterm, term]
    });
    if (nterm.length === 0) {
        return tree;
    }
    let [[, [, value]]] = nterm;
    [, ...nterm] = nterm;
    nterm.forEach(nt => {
        nt[0] === 'mul'
            ? value *= nt[1][1]
            : value /= nt[1][1];
    });
    return varterm.length === 0
        ? ['natural', value.toString()]
        : [operator, ['mul', ['natural', value.toString()]], ...varterm];
}
