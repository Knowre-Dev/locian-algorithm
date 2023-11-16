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
        if (typeof A > typeof B) {
            return 1;
        } 
        if (typeof A < typeof B) {
            return -1;
        } 
        if (A > B) {
            return 1;
        } 
        if (A < B) {
            return -1;
        } 
        return 0;
        
    }
    let A_1 = _.cloneDeep(A);
    let B_1 = _.cloneDeep(B);
    let operatorA = A_1[0];
    let operatorB = B_1[0];
    let operandA = A_1.splice(1);
    let operandB = B_1.splice(1);    
    let opflag = ['add', 'sub', 'addsub', 'subadd'].includes(operatorA);
    if (operatorA > operatorB && !opflag) {
        return 1;
    } 
    if (operatorA < operatorB && !opflag) {
        return -1;
    } if (['add', 'sub'].includes(operatorA) && ['addsub', 'subadd'].includes(operatorB)) {
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
    for (let [k, v] of operandA.entries()) {
        let temp = rearrangeTreeEq(v, operandB[k]);
        if (temp === 0) {
            continue;
        } else {
            return temp;
        }
    }
    return 0;
    
    
}



