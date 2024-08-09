// a(b(cd))-> a(bcd) -> abcd
export function 곱셈결합법칙(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    let newOperand = [];
    operand.forEach(term => {
        term = 곱셈결합법칙(term);
        // a(b(cd))-> a(bcd) -> abcd
        const [op, term_1] = term;
        const is_mulchain = operator === 'mulchain' && op === 'mul' && term_1[0] === 'mulchain';
        const terms_new = is_mulchain
            ? term_1.slice(1)
            : [term];
        newOperand = [...newOperand, ...terms_new];
    });
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
const result = compareMathTree(tree_1, tree_2);
console.log(result_1);
console.log(result_2);
console.log(result);
*/
