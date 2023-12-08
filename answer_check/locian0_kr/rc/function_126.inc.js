import { mulCommutative } from '../rc/function_46.inc.js';

export function sub_mulCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    let newOperand = [];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        const array = sort_array(tree_1);
        if (!array.includes('natural') && !array.includes('decimal')) { // 문자만 있는 경우
            newOperand = mulCommutative([operator].concat(tree_1));
            newOperand.shift();
        } else { // 숫자가 있는 경우
            if (!array.includes('variable')) { // 숫자만 있는 경우
                newOperand = mulCommutative([operator].concat(tree_1));
                newOperand.shift();
            } else { // 숫자, 문자 섞여있는 경우
                if (!array.includes('addchain')) { // 단항식
                    const merge = [operator].concat(tree_1);
                    if (sub_deter(merge) === false) {
                        newOperand = tree_1;
                    } else {
                        newOperand = mulCommutative(merge);
                        newOperand.shift();
                    }
                } else {
                    const merge = [operator].concat(tree_1);
                    if (sub_deter(merge) === true) {
                        let deter2 = true;
                        for (const t of tree_1) {
                            if (t[1][0] === 'addchain') {
                                if (t[1][1][1][0] === 'mulchain') {
                                    deter2 = sub_deter(t[1][1][1]);
                                }
                                if (deter2 === false) {
                                    break;
                                }
                            }
                        }

                        if (deter2 === false) {
                            newOperand = tree_1;
                        } else {
                            newOperand = mulCommutative(merge);
                            newOperand.shift();
                        }
                    } else {
                        newOperand = tree_1;
                    }
                }
            }
        }
    } else {
        const tree_1 = tree.slice(1);
        for (const t of tree_1) {
            newOperand.push(sub_mulCommutative(t));
        }
    }

    return [operator].concat(newOperand);
}

export function sort_array(A) {
    let arr = [];
    for (const v of A) {
        !Array.isArray(v) ? arr.push(v)
        : arr = arr.concat(sort_array(v));
    }
    return arr;
}

export function sub_deter(tree = null) {
    // 결과가 true면 정렬함, false면 정렬 안함

    if (!Array.isArray(tree)) {
        return true;
    }

    const operator = tree[0];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        tree_1.shift();
        for (const t of tree_1) {
            if (t[0] !== 'mul') {
                return false;
            } else {
                switch (t[1][0]) {
                    case 'natural': {
                        return false;
                    }
                    case 'decimal': {
                        return false;
                    }
                    case 'fraction': {
                        return false;
                    }
                    case 'negative': {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    const tree_1 = tree.slice(1);
    for (const t of tree_1) {
        if (sub_deter(t) === false) {
            return false;
        }
    }
    return true;
}
