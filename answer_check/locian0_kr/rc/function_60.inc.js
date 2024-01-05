export function rearrangeTreeEq(A, B) {
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
            : 0;
    }

    const [operatorA, ...operandA] = A[0] === 'negative' ? A[1] : A;
    const [operatorB, ...operandB] = B[0] === 'negative' ? B[1] : B;

    const place = [0, 0];
    const operator_entries = [operatorA, operatorB].entries();
    for (const [key, term] of operator_entries) {
        switch (term) {
            case 'negative': {
                place[key] = 1;
                break;
            }
            case 'fraction': {
                place[key] = 2;
                break;
            }
            default: {
                break;
            }
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
    const operandA_lehgth = operandA.length;
    const operandB_length = operandB.length
    if (operandA_lehgth > operandB_length) {
        return 1;
    }
    if (operandA_lehgth < operandB_length) {
        return -1;
    }

    const operandA_entries = operandA.entries();
    for (const [key, termA] of operandA_entries) {
        const temp = rearrangeTreeEq(termA, operandB[key]);
        if (temp !== 0) {
            return temp;
        }
    }
    return 0;
}
/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

let tree_1 = LatexToTree("[1]");
let tree_2 = LatexToTree("[1]");

tree_1 = rearrangeTreeEq(tree_1);
tree_2 = rearrangeTreeEq(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/
