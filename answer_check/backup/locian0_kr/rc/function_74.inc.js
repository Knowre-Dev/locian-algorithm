import {rearrangeTreeEq} from '../rc/function_60.inc.js';

export function rearrangeTreeAdd(A, B) {
    var A_1 = JSON.parse(JSON.stringify(A));
    var B_1 = JSON.parse(JSON.stringify(B));
    if (Array.isArray(A_1) && !Array.isArray(B_1)) {
        return 1;
    } else if (!Array.isArray(A_1) && Array.isArray(B_1)) {
        return -1;
    } else if (!Array.isArray(A_1) && !Array.isArray(B_1)) {
        if (typeof A_1 > typeof B_1) {
            return 1;
        } else if (typeof A_1 < typeof B_1) {
            return -1;
        } else if (A_1 > B_1) {
            return 1;
        } else if (A_1 < B_1) {
            return -1;
        } else {
            return 0;
        }
    }
    
    var operatorA = A_1[0];
    var operatorB = B_1[0];
    var operandA = A_1.splice(1);
    var operandB = B_1.splice(1);    
    var opflag = ['add', 'sub', 'addsub', 'subadd'].includes(operatorA);
    if (operatorA > operatorB && !opflag) {
        return 1;
    } else if (operatorA < operatorB && !opflag) {
        return -1;
    } else if (['add', 'sub'].includes(operatorA) && ['addsub', 'subadd'].includes(operatorB)) {
        return -1;
    } else if (['addsub', 'subadd'].includes(operatorA) && ['add', 'sub'].includes(operatorB)) {
        return 1;
    } else {
        if (operandA.length > operandB.length) {
            return 1;
        } else if (operandA.length < operandB.length) {
            return -1;
        } else {
            for (var [k, v] of operandA.entries()) {
                var temp = rearrangeTreeEq(v, operandB[k]);
                if (temp === 0) {
                    continue;
                } else {
                    return temp;
                }
            }
            return 0;
        }
    }
}



