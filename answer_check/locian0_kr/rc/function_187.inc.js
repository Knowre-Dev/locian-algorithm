// a^(-c/d)꼴을 분수꼴로

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
    const [base, [, power]] = operand;
    // 밑이 분수일 경우
    const one = JSON.stringify(['natural', '1']);
    if (base[0] === 'fraction') {
        const new_base = JSON.stringify(base[1]) === one
            ? base[2]
            : ['fraction', base[2], base[1]];
        return JSON.stringify(power) === one
            ? new_base
            : ['power', new_base, power];
    }
    // 최종 형태 분수, 1/(exp) 의 형태
    return JSON.stringify(power) === one
        ? ['fraction', ['natural', '1'], base]
        : ['fraction', ['natural', '1'], ['power', base, power]];
}

// mulchain에서 frac을 앞쪽에 위치시킴
export function fracFirst(tree) {
    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return tree;
    }

    let fracs = [];
    let others = [];
    operand.forEach(term => {
        term[0] === 'mul' && term[1][0] === 'fraction'
            ? fracs = [...fracs, term]
            : others = [...others, term];
    });
    return [operator, ...fracs, ...others];
}
