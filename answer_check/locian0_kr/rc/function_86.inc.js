// 소수만앞에 0일 없을 때 추가시켜줌 .001 => 0.001
export function decIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'decimal': {
            return operand[0].charAt(0) === '.'
                ? [operator, '0' + operand[0]]
                : tree;
        }
        case 'rdecimal': {
            return operand[0] === ''
                ? [operator, '0', operand[1], operand[2]]
                : tree;
        }
        default: {
            return [operator, ...operand.map(term => decIdentity(term))];
        }
    }
}
