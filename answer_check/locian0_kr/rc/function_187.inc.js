// a^(-c/d)꼴을 분수꼴로

export function expToFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        const tree_new = [operator, ...operand.map(term => expToFrac(term))];
        return fracFirst(tree_new);
    }
    const [base, [op_e, exp]] = operand;
    if (op_e !== 'negative') {
        return fracFirst(tree);
    }
    // 밑이 분수일 경우
    const one = JSON.stringify(['natural', '1']);
    if (base[0] === 'fraction') {
        const [, num_b, den_b] = base;
        const base_new = JSON.stringify(num_b) === one
            ? den_b
            : ['fraction', den_b, num_b];
        return JSON.stringify(exp) === one
            ? base_new
            : ['power', base_new, exp];
    }
    // 최종 형태 분수, 1/(exp) 의 형태

    const den_new = JSON.stringify(exp) === one
        ? base
        : ['power', base, exp]
    return ['fraction', ['natural', '1'], den_new];
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
        const [op, [op_1]] = term;
        op === 'mul' && op_1 === 'fraction'
            ? fracs = [...fracs, term]
            : others = [...others, term];
    });
    return [operator, ...fracs, ...others];
}
