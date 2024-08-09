export function rearrangeTreeEq(A, B) {
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
    const [operatorA, ...operandA] = A[0] === 'negative'
        ? A[1]
        : A;
    const [operatorB, ...operandB] = B[0] === 'negative'
        ? B[1]
        : B;
    const place = [];
    const operators = new Map([
        ['negative', 1],
        ['fraction', 2]
    ]);
    place[0] = operators.has(operatorA)
        ? operators.get(operatorA)
        : 0;
    place[1] = operators.has(operatorB)
        ? operators.get(operatorB)
        : 0;
    if (place[0] < place[1] || (place[0] === place[1] && operatorA > operatorB)) {
        return 1;
    }
    if (place[0] > place[1] || operatorA < operatorB) {
        return -1;
    }
    const length_A = operandA.length;
    const length_B = operandB.length
    if (length_A > length_B) {
        return 1;
    }
    if (length_A < length_B) {
        return -1;
    }
    let result = 0;
    operandA.find((termA, key) => {
        result = rearrangeTreeEq(termA, operandB[key]);
        return result !== 0;
    });
    return result;
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
