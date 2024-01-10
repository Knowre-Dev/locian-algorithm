export function expToFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'power') {
        if (operand[1][0] === 'negative') {
            let newOperand = [];
            const newPower = operand[1][1];
            // 밑이 분수일 경우
            if (operand[0][0] === 'fraction') {
                newOperand = (operand[0][1][0] === 'natural' && operand[0][1][1] === '1') ? operand[0][2]
                : ['fraction', operand[0][2], operand[0][1]];
                return (newPower[0] === 'natural' && newPower[1] === '1') ? newOperand
                : ['power', ...[newOperand], newPower];
            }
            // 최종 형태 분수, 1/(exp) 의 형태
            newOperand = (newPower[0] === 'natural' && newPower[1] === '1') ? ['fraction', ['natural', '1'], operand[0]]
            : ['fraction', ['natural', '1'], ['power', operand[0], newPower]];
            return newOperand;
        }
        return fracFirst(tree);
    }
    return fracFirst([operator, ...operand.map(term => expToFrac(term))]);
}

export function fracFirst(tree) {
    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        let frac = [];
        let other = [];
        operand.forEach(term => {
            (term[0] === 'mul' && term[1][0] === 'fraction') ? frac = [...frac, term]
            : other = [...other, term];
        });
        return [operator, ...frac, ...other];
    }
    return tree;
}
