import { fracSimpInt } from '../rc/function_76.inc.js';

export function mfracEquiv(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'mfraction') {
        const tree_1 = tree.slice(1);
        const nfrac = fracSimpInt(['fraction', tree_1[1], tree_1[2]]);
        if (nfrac[0] === 'fraction') {
            const newOperand = [];
            newOperand.push(tree_1[0]);
            newOperand.push(nfrac[1]);
            newOperand.push(nfrac[2]);
            return [operator].concat(newOperand);
        }
        operator = 'natural';
        const newOperand = [];
        newOperand.push((parseInt(tree_1[0][1]) + parseInt(nfrac[1])).toString());
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mfracEquiv(v));
    }
    return [operator].concat(newOperand);
}
