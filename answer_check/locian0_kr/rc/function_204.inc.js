import { addNegative } from '../rc/function_71.inc.js';

export function addNegaToSub(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => addNegative(term))];
    }
    const [term_0, ...operand_1] = operand;
    const new_term_0 = term_0[0] === 'add' && term_0[1][0] === 'negative'
        ? ['sub', term_0[1][1]]
        : term_0[0] === 'add' && term_0[1][0] === 'positive'
            ? ['add', term_0[1][1]]
            : term_0;
    return [operator, new_term_0, ...operand_1];
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
