import { rearrangeTreeEq } from '../rc/function_60.inc.js';

export function rearrangeTreeAdd(A, B) {
    const is_array_A = Array.isArray(A);
    const is_array_B = Array.isArray(B);
    if (is_array_A !== is_array_B) {
        return is_array_A
            ? 1
            : -1;
    }
    if (!is_array_A && !is_array_B) {
        return typeof A > typeof B || (typeof A === typeof B && A > B)
            ? 1
            : typeof A < typeof B || A < B
                ? -1
                : 0;
    }
    const [operatorA, ...operandA] = A;
    const [operatorB, ...operandB] = B;
    const is_includes_A_1 = ['add', 'sub'].includes(operatorA);
    const is_includes_A_2 = ['addsub', 'subadd'].includes(operatorA);
    const is_includes_B_1 = ['add', 'sub'].includes(operatorB);
    const is_includes_B_2 = ['addsub', 'subadd'].includes(operatorB);
    if ((operatorA > operatorB && !is_includes_A_1 && !is_includes_A_2) || (is_includes_A_2 && is_includes_B_1)) {
        return 1;
    }
    if ((operatorA < operatorB && !is_includes_A_1 && !is_includes_A_2) || (is_includes_A_1 && is_includes_B_2)) {
        return -1;
    }
    const length_A = operandA.length;
    const length_B = operandB.length;
    if (length_A > length_B) {
        return 1;
    }
    if (length_A < length_B) {
        return -1;
    }
    let result = 0;
    operandA.find((term, key) => {
        result = rearrangeTreeEq(term, operandB[key]);
        return result !== 0;
    });
    return result;
}
