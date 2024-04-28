import { addCommutative } from '../rc/function_47.inc.js';
import { sign_change } from '../rc/sub_functions.js';
// 지수가 짝수일 때 base 부호 정리 (-a)^2 => a^2

export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powBaseSort(term))];
    }
    let [base, expo] = operand;
    base = addCommutative(base);
    return base[0] === 'addchain' && base[1][0] === 'sub' && expo[1] % 2 === 0
        ? [operator, sign_change(base), expo]
        : base[0] === 'negative' && expo[1] % 2 === 0
            ? powBaseSort([operator, base[1], expo])
            : [operator, base, expo];
    // 지우지 말것
    /*
    return base[0] === 'addchain' && base[1][0] === 'sub' && expo[1] % 2 === 0
        ? [operator, sign_change(base), expo]
        : base[0] === 'negative' && expo[1] % 2 === 0
            ? [operator, ...powBaseSort([base[1], expo])]
            : [operator, base, expo];
        */
}
