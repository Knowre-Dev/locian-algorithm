/*
Combines an addchain with at least one fraction into a single fraction
*/
import { mulIdentity } from '../rc/function_56.inc.js';
// import { array2ChainTree } from '../rc/function_152.inc.js';
// import { array2ChainTree, findDenominators, findGCF, multFactor } from '../rc/function_152.inc.js';
import { mulAssociative } from '../rc/function_157.inc.js';
import { findDenominators, findGCF, multFactor, array2ChainTree } from '../rc/sub_functions.js';

export function fracCombine(tree) {
    if (!Array.isArray(tree) || tree.length === 0) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return [operator, ...operand.map(term => fracCombine(term))];
    }
    let den = findDenominators(tree, true);// 분모 수집
    if (den.length === 0) { // 분모가 없는 경우
        return tree;
    }
    den = den.map(term => ['mul', term]);
    den = array2ChainTree(den); // 분모들로 mulchain 형성
    const GCF = findGCF(den);// 분모들의  쵀대공인수(GCF) 계산

    if (GCF.syms.length !== 0) { // GCF의 인자 중에서 symbol이 있는 경우
        const terms = [['mul', GCF.const], ...GCF.syms.map(value_1 => ['mul', value_1])];
        den = ['mulchain', ...terms];
    }
    const mul_function = (tree_1, term) => mulIdentity(mulAssociative(multFactor(tree_1, term, true)));
    const newOperand = operand.map(term => [term[0], mul_function(term[1], ['mul', den])]); // addchain 각 term에 den 곱함
    return ['fraction', array2ChainTree(newOperand), den]; // 전체를 den으로 나눔
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(x-\\frac{5}{2})^2+(y+\\frac{5}{2})^{2}=\\frac{25}{2}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracCombine(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
