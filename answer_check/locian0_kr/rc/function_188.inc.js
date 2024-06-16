export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'nthroot': {
            const [index, radi] = operand;
            const [op_r] = radi;
            switch (op_r) {
                case 'mulchain': { // 루트 안이 곱셈식일 경우
                    return radi.map(term =>
                        Array.isArray(term)
                            ? [term[0], rootToExp(['nthroot', index, term[1]])]
                            : term);
                }
                case 'power': { // 루트 안이 거듭제곱일 경우
                    const [, base_r, exp_r] = radi;
                    return ['power', base_r, ['fraction', exp_r, index]];
                }
                default: {
                    return ['power', radi, ['fraction', ['natural', '1'], index]];
                }
            }
        }
        case 'squareroot': {
            return rootToExp(['nthroot', ['natural', '2'], ...operand]);
        }
        default: {
            return [operator, ...operand.map(term => rootToExp(term))];
        }
    }
}
