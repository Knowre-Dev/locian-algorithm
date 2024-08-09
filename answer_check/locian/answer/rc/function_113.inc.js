// mulchain의 constant 계산
export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => mulConstCal(term))];
    }
    let number = 1;
    let has_number = false
    let others = [];
    operand.forEach(term => {
        const [op, term_1] = term;
        let nat;
        term_1[0] === 'natural'
            ? [nat, has_number] = [term_1[1], true]
            : term_1[0] === 'power' && term_1[1][0] === 'natural' && term_1[2][0] === 'natural'
                ? [nat, has_number] = [Math.pow(term_1[1][1], term_1[2][1]), true]
                : others = [...others, term];
        if (typeof nat !== 'undefined') {
            number = op === 'mul'
                ? number * nat
                : number / nat;
        }
    });
    if (!has_number) {
        return tree;
    }
    const natural = ['natural', number.toString()];
    return others.length === 0
        ? natural
        : [operator, ['mul', natural], ...others];
}
