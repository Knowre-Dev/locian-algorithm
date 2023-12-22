export function powDecomposition(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        const newOperand = [];
        const base = powDecomposition(operand[0]);
        const expo = powDecomposition(operand[1]);
        if (base[0] === 'addchain' && expo[0] === 'natural') {
            const expo_int = parseInt(expo[1]);
            for (let i = 0; i < expo_int; i++) {
                newOperand.push(['mul', base]);
            }
            return ['mulchain', ...newOperand];
        }
        return [operator, base, expo];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powDecomposition(term));
    return [operator, ...newOperand];
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
