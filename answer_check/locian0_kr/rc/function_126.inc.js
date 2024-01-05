import { mulCommutative } from '../rc/function_46.inc.js';

export function sub_mulCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mulchain') {
        const [, ...operand] = tree;
        const array = sort_array(operand);
        if (!array.includes('natural') && !array.includes('decimal')) { // 문자만 있는 경우
            return [operator, ...mulCommutative(tree).slice(1)];
        }
        // 숫자가 있는 경우
        if (!array.includes('variable')) { // 숫자만 있는 경우
            return [operator, ...mulCommutative(tree).slice(1)];
        }
        // 숫자, 문자 섞여있는 경우
        if (!array.includes('addchain')) { // 단항식
            return sub_deter(tree) === false ? tree
                : [operator, ...mulCommutative(tree).slice(1)];
        }
        if (sub_deter(tree) === true) {
            for (const term of operand) {
                if (term[1][0] === 'addchain') {
                    if (term[1][1][1][0] === 'mulchain' && sub_deter(term[1][1][1]) === false) {
                        return tree;
                    }
                }
            }
            return [operator, ...mulCommutative(tree).slice(1)];
        }
        return tree;
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => sub_mulCommutative(term));
    return [operator, ...newOperand];
}

export function sort_array(array) {
    let arr = [];
    array.forEach(term => {
        !Array.isArray(term) ? arr.push(term)
        : arr = [...arr, ...sort_array(term)];
    });
    return arr;
}

export function sub_deter(tree = null) {
    // 결과가 true면 정렬함, false면 정렬 안함

    if (!Array.isArray(tree)) {
        return true;
    }

    const operator = tree[0];
    if (operator === 'mulchain') {
        const [, , ...operand] = tree;
        for (const term of operand) {
            if (term[0] !== 'mul') {
                return false;
            }
            if (['natural', 'decimal', 'fraction', 'negative'].includes(term[1][0])) {
                return false;
            }
        }
        return true;
    }
    const [, ...operand] = tree;
    for (const term of operand) {
        if (sub_deter(term) === false) {
            return false;
        }
    }
    return true;
}
