import { addNegative } from '../rc/function_71.inc.js';

export function addNegaToSub(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        const operand_new = operand.map(term => addNegative(term));
        return [operator, ...operand_new];
    }
    const [term_0, ...terms_1] = operand;
    const [op_0, [op_10, term_11]] = term_0;
    const term_0_new = op_0 === 'add' && op_10 === 'negative'
        ? ['sub', term_11]
        : op_0 === 'add' && op_10 === 'positive'
            ? ['add', term_11]
            : term_0;
    return [operator, term_0_new, ...terms_1];
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '(+2)+2';
let latex_2 = '+2+2';
let tree1 = addNegaToSub(LatexToTree(latex_1));
let tree2 = addNegaToSub(LatexToTree(latex_2));
let result1 = JSON.stringify(tree1, null, 4);
let result2 = JSON.stringify(tree2, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree1, null, 4));
console.log(JSON.stringify(tree2, null, 4));
*/
