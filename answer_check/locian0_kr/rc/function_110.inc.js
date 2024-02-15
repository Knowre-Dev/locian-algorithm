import { fracSimpInt } from '../rc/function_76.inc.js';

export function mfracEquiv(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mfraction') {
        return [operator, ...operand.map(term => mfracEquiv(term))];
    }
    const nfrac = fracSimpInt(['fraction', operand[1], operand[2]]);
    return nfrac[0] === 'fraction'
        ? [operator, operand[0], nfrac[1], nfrac[2]]
        : ['natural', (parseInt(operand[0][1]) + parseInt(nfrac[1])).toString()];
}
