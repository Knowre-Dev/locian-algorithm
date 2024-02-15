import { mulCommutative } from '../rc/function_46.inc.js';

export function sub_mulCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        return [operator, ...operand.map(term => sub_mulCommutative(term))];
    }
    const array = operand.flat(Infinity);
    return !array.includes('natural') && !array.includes('decimal')
        ? [operator, ...mulCommutative(tree).slice(1)] // 문자만 있는 경우
        : !array.includes('variable') // 숫자만 있는 경우
            ? [operator, ...mulCommutative(tree).slice(1)]
            : !array.includes('addchain') // 숫자, 문자 섞여있는 경우
                ? sub_deter(tree) // 단항식
                    ? [operator, ...mulCommutative(tree).slice(1)]
                    : tree
                : sub_deter(tree)
                    ? operand.some(term => term[1][0] === 'addchain' && term[1][1][1][0] === 'mulchain' && !sub_deter(term[1][1][1]))
                        ? tree
                        : [operator, ...mulCommutative(tree).slice(1)]
                    : tree;
}

/*
deleted function
export function sort_array(array) {
    let arr = [];
    array.forEach(term => {
        arr = !Array.isArray(term) ? [...arr, term]
            : [...arr, ...sort_array(term)];
    });
    return arr;
}
*/
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\mfrac[1]{7}{3}';
const tree_1 = LatexToTree(latex_1);
const tree_11 = sort_array(tree_1);
// const result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
export function sub_deter(tree = null) {
    // 결과가 true면 정렬함, false면 정렬 안함

    if (!Array.isArray(tree)) {
        return true;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, , ...operand] = tree;
        return !operand.some(term => (term[0] === 'div' || ['natural', 'decimal', 'fraction', 'negative'].includes(term[1][0])));
    }
    const [, ...operand] = tree;
    return !operand.some(term => !sub_deter(term));
}
