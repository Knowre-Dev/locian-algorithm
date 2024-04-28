import { addCommutative } from '../rc/function_47.inc.js';
import { addFactor } from '../rc/function_72.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';
// power에서  base가  addchain 일때, factorize시켜 분리  (ab+ac)^d => a^d(b+c)^d
export function powAddFactoredForm(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powAddFactoredForm(term))];
    }
    let [base, expo] = operand
    base = sub_mulCommutative(addCommutative(base));
    if (!(base[0] === 'addchain' && expo[0] === 'natural')) {
        return [operator, base, expo];
     }
    const [operator_b, ...operand_b] = addFactor(base);
    return operator_b === 'mulchain'
        ? ['mulchain', ...operand_b.map(term => [term[0], ['power', term[1], expo]])]
        : [operator, base, expo];
}
