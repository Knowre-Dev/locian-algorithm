export function expToFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    let newOperand = [];
    if (operator === 'power') {
        if (operand[1][0] === 'negative') {
            const newPower = operand[1][1];
            // 밑이 분수일 경우
            if (operand[0][0] === 'fraction') {
                newOperand = (operand[0][1][0] === 'natural' && operand[0][1][1] === '1') ? operand[0][2]
                    : ['fraction', operand[0][2], operand[0][1]];
                if (newPower[0] === 'natural' && newPower[1] === '1') {
                    return newOperand;
                }
                return ['power', ...[newOperand], newPower];
            }
            // 최종 형태 분수, 1/(exp) 의 형태
            newOperand = (newPower[0] === 'natural' && newPower[1] === '1') ? ['fraction', ['natural', '1'], operand[0]]
                : ['fraction',
                    ['natural', '1'],
                    ['power', operand[0], newPower]
                ];
            return newOperand;
        }
        return fracFirst(tree);
    }
    for (const term of operand) {
        newOperand.push(expToFrac(term));
    }
    return fracFirst([operator, ...newOperand]);
}

export function fracFirst(tree) {
    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const frac = [];
        const other = [];
        for (const term of operand) {
            if (term[0] === 'mul' && term[1][0] === 'fraction') {
                frac.push(term);
            } else {
                other.push(term);
            }
        }
        return [operator, ...frac, ...other];
    }
    return tree;
}
