// a(b(cd))-> a(bcd) -> abcd
export function 곱셈결합법칙(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        const term_1 = 곱셈결합법칙(term);
        // a(b(cd))-> a(bcd) -> abcd
        const is_mulchain = operator === 'mulchain' && term_1[0] === 'mul' && term_1[1][0] === 'mulchain';
        if (is_mulchain) {
            const [, ...term_rest] = term_1[1];
            newOperand.push(...term_rest);
        } else {
            newOperand.push(term_1);
        }
    }
    return [operator, ...newOperand];
}
/*
import { LatexToTree, compareMathTree } from '../checkmath.js';

let tree_1 = LatexToTree('a(b(cd))');
let tree_2 = LatexToTree('abcd');
tree_1 = 곱셈결합법칙(tree_1);
tree_2 = 곱셈결합법칙(tree_2);
const result_1 = JSON.stringify(tree_1, null, 4);
const result_2 = JSON.stringify(tree_2, null, 4);
// const result = compareMathTree(tree_1, tree_2);
console.log(result_1);
console.log(result_2);
// console.log(result);
*/
/*
import { LatexToTree } from '../checkmath.js';

const tree_1 = LatexToTree('a(b(cd))');
const result = 곱셈결합법칙(tree_1);
const input = JSON.stringify(tree_1, null, 4);
const output = JSON.stringify(result, null, 4);

console.log(input);
console.log(output);
*/

// a(b(cd))-> a(bcd) -> abcd
/*
export function 곱셈결합법칙2(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const newOperand = [];
    for (const it of operand) {
        const term = 곱셈결합법칙(it);
        const is괄호중첩 = operator === 'mulchain' && term[0] === 'mul' && term[1][0] === 'mulchain'
        if (is괄호중첩) {
            // term = ['mul', ['mulchain', ['mul', ['variable', 'a']],['mul', ['variable', 'b']]]
            // term[1] = ['mulchain', ['mul', ['variable', 'a']],['mul', ['variable', 'b']]
            const [, ...restOperand] = term[1]
            newOperand.push(...restOperand);
        } else {
            newOperand.push(term);
        }
    }
    return [operator].concat(newOperand);
}
*/
