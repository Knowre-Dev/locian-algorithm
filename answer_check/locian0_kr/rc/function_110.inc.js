import { fracSimpInt } from '../rc/function_76.inc.js';

export function mfracEquiv(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'mfraction') {
        const [, ...operand] = tree;
        const nfrac = fracSimpInt(['fraction', operand[1], operand[2]]);
        if (nfrac[0] === 'fraction') {
            return [operator, operand[0], nfrac[1], nfrac[2]];
        }
        return ['natural', (parseInt(operand[0][1]) + parseInt(nfrac[1])).toString()];
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(mfracEquiv(term));
    }
    return [operator, ...newOperand];
}
