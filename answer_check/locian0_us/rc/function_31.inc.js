import {rearrangeTreeEq} from '../rc/function_17.inc.js';

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
    var operandA = A_1.slice(1);
    var operandB = B_1.slice(1);    
    var opflag = ['add', 'sub', 'addsub', 'subadd'].includes(operatorA);
    if (operatorA > operatorB && !opflag) {
        return 1;
    } else if (operatorA < operatorB && !opflag) {
        return -1;
    } else if (['add', 'sub'].includes(operatorA) && operatorB, ['addsub', 'subadd'].includes(operatorB)) {
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

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = eqMulNeg;
var latex1 = '-c=a-b';
var latex2 = 'c=-a+b';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/