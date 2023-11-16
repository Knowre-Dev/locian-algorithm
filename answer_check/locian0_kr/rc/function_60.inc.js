import _ from 'lodash';

export function rearrangeTreeEq(A, B) {
    
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
    var A_1 = _.cloneDeep(A);
    var B_1 = _.cloneDeep(B);
    var operatorA;
    var operandA;
    if (A_1[0] === 'negative') {
        operatorA = A_1[1][0];
        //operandA = A_1[1].splice(1);
        operandA = A_1[1].slice(1);
    } else {
        operatorA = A_1[0];
        //operandA = A_1.splice(1);
        operandA = A_1.slice(1);
    }
    
    var operatorB;
    var operandB;
    if (B_1[0] === 'negative') {
        operatorB = B_1[1][0];
        
        operandB = B_1[1].slice(1);
    } else {
        operatorB = B_1[0];
        
        operandB = B_1.slice(1);
    }
    
    var place = [0, 0];
    var opflag;
    for (var [k, term] of [operatorA, operatorB].entries()) {
        switch (term) {
            case 'add':
            case 'sub':
            case 'addsub':
            case 'subadd':
                opflag = false;
                break;
            case 'negative':
                place[k] = 1;
                break;
            case 'fraction':
                place[k] = 2;
                break;
            default:
                opflag = true;               
                break;
        }
    }
    if (place[0] < place[1]) {
        return 1;
    }
    if (place[0] > place[1]) {
        return -1;
    }
    if (operatorA > operatorB) {
        return 1;
    }
    if (operatorA < operatorB) {
        return -1;
    } 
    if (operandA.length > operandB.length) {
        return 1;
    }
    if (operandA.length < operandB.length) {
        return -1;
    } 
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
/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

var tree_1 = LatexToTree("[1]");
var tree_2 = LatexToTree("[1]");

tree_1 = rearrangeTreeEq(tree_1);
tree_2 = rearrangeTreeEq(tree_2);
var result_1 = JSON.stringify(tree_1, null, 4);
var result_2 = JSON.stringify(tree_2, null, 4);
var result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/
