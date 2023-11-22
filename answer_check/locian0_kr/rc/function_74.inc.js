import {rearrangeTreeEq} from '../rc/function_60.inc.js';
import _ from 'lodash';

export function rearrangeTreeAdd(A, B) {
    
    if (Array.isArray(A) && !Array.isArray(B)) {
        return 1;
    }
    if (!Array.isArray(A) && Array.isArray(B)) {
        return -1;
    }
    if (!Array.isArray(A) && !Array.isArray(B)) {

        return typeof A > typeof B ? 1
            : typeof A < typeof B ? -1
            : A > B ? 1
            : A < B ? -1
            : 0
      
    }
    
    let operatorA = A[0];
    let operatorB = B[0];
    let operandA = A.slice(1);
    let operandB = B.slice(1);    
    let opflag = ['add', 'sub', 'addsub', 'subadd'].includes(operatorA);
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
    if (operandA.length > operandB.length) {
        return 1;
    } 
    if (operandA.length < operandB.length) {
        return -1;
    } 
    let operandA_entries = operandA.entries();
    for (let [k, v] of operandA_entries) {
        let temp = rearrangeTreeEq(v, operandB[k]);
        if (temp === 0) {
            continue;
        } else {
            return temp;
        }
    }
    return 0;
    
    
}



