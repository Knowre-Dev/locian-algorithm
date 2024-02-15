import { addCommutative } from '../rc/function_47.inc.js';
import { addFactor } from '../rc/function_72.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

export function powAddFactoredForm(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'power') {
        return [operator, ...operand.map(term => powAddFactoredForm(term))];
    }
    const base = sub_mulCommutative(addCommutative(operand[0]));
    const [, expo] = operand;
    const condition = base[0] === 'addchain' && expo[0] === 'natural';
    if (!condition) {
        return [operator, base, expo];
     }
    const [operator_1, ...operand_1] = addFactor(base);
    if (operator_1 === 'mulchain') {
        return ['mulchain', ...operand_1.map(term => [term[0], ['power', term[1], expo]])];
    }
    return [operator, base, expo];
}
