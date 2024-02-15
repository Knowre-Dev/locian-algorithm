import { rearrangeTreeEq } from '../rc/function_60.inc.js';

export function rearrangeTreeAdd(A, B) {
    if (Array.isArray(A) && !Array.isArray(B)) {
        return 1;
    }
    if (!Array.isArray(A) && Array.isArray(B)) {
        return -1;
    }
    if (!Array.isArray(A) && !Array.isArray(B)) {
        return typeof A > typeof B
            ? 1
            : typeof A < typeof B
                ? -1
                : A > B
                    ? 1
                    : A < B
                        ? -1
                        : 0
    }
    const [operatorA, ...operandA] = A;
    const [operatorB, ...operandB] = B;
    const opflag = ['add', 'sub', 'addsub', 'subadd'].includes(operatorA);
    if (operatorA > operatorB && !opflag) {
        return 1;
    }
    if (operatorA < operatorB && !opflag) {
        return -1;
    }
    if (['add', 'sub'].includes(operatorA) && ['addsub', 'subadd'].includes(operatorB)) {
        return -1;
    }
    if (['addsub', 'subadd'].includes(operatorA) && ['add', 'sub'].includes(operatorB)) {
        return 1;
    }
    const operandA_length = operandA.length;
    const operandB_length = operandB.length;
    if (operandA_length > operandB_length) {
        return 1;
    }
    if (operandA_length < operandB_length) {
        return -1;
    }
    const operandA_entries = operandA.entries();
    for (const [key, term] of operandA_entries) {
        const temp = rearrangeTreeEq(term, operandB[key]);
        if (temp !== 0) {
            return temp;
        }
    }
    return 0;
}
