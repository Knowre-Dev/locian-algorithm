import { fracSimpInt } from '../rc/function_76.inc.js';
// mfraction을 단순화 시켜줌 14/2 => 2
export function mfracEquiv(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'mfraction') {
        const operand_new = operand.map(term => mfracEquiv(term));
        return [operator, ...operand_new];
        // return [operator, ...operand.map(term => mfracEquiv(term))];
    }
    const [nat, num, den] = operand;
    const frac = fracSimpInt(['fraction', num, den]);
    return frac[0] === 'fraction'
        ? [operator, nat, frac[1], frac[2]]
        : ['natural', (parseInt(nat[1]) + parseInt(frac[1])).toString()];
}
