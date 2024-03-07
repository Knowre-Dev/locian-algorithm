export function expToFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return fracFirst([operator, ...operand.map(term => expToFrac(term))]);
    }
    if (operand[1][0] !== 'negative') {
        return fracFirst(tree);
    }
    let newOperand = [];
    const [, [, newPower]] = operand;
    // 밑이 분수일 경우
    const one = JSON.stringify(['natural', '1']);
    if (operand[0][0] === 'fraction') {
        newOperand = JSON.stringify(operand[0][1]) === one
            ? operand[0][2]
            : ['fraction', operand[0][2], operand[0][1]];
        return JSON.stringify(newPower) === one
            ? newOperand
            : ['power', newOperand, newPower];
    }
    // 최종 형태 분수, 1/(exp) 의 형태
    return JSON.stringify(newPower) === one
        ? ['fraction', ['natural', '1'], operand[0]]
        : ['fraction', ['natural', '1'], ['power', operand[0], newPower]];
}

export function fracFirst(tree) {
    const [operator] = tree;
    if (operator !== 'mulchain') {
        return tree;
    }
    const [, ...operand] = tree;
    let frac = [];
    let other = [];
    operand.forEach(term => {
        term[0] === 'mul' && term[1][0] === 'fraction'
            ? frac = [...frac, term]
            : other = [...other, term];
    });
    return [operator, ...frac, ...other];
}
