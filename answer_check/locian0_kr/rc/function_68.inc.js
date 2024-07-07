export function powDecomposition(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        const operand_new = operand.map(term => powDecomposition(term));
        return [operator, ...operand_new];
    }
    let newOperand = [];
    let [base, exp] = operand;
    base = powDecomposition(base);
    exp = powDecomposition(exp);
    if (base[0] === 'addchain' && exp[0] === 'natural') {
        const [, max] = exp;
        for (let i = 0; i < max; i++) {
            newOperand = [...newOperand, ['mul', base]];
        }
        return ['mulchain', ...newOperand];
    }
    return [operator, base, exp];
}

/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
        let tree1 = LatexToTree('x^2');
        let tree2 = LatexToTree('x\\times x');
        let tree11 = powDecomposition(tree1);
        let tree21 = powDecomposition(tree2);
        let result1 = JSON.stringify(tree11, null, 4);
        let result2 = JSON.stringify(tree21, null, 4);
        console.log(compareMathTree(result1, result2));
        console.log(JSON.stringify(tree11, null, 4));
        console.log(JSON.stringify(tree21, null, 4));
*/
