import { addCommutative } from '../rc/function_47.inc.js';
import { addFactor } from '../rc/function_72.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

export function powAddFactoredForm(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'power') {
        const [, ...operand] = tree;
        const base = sub_mulCommutative(addCommutative(operand[0]));
        const expo = operand[1];

        if (base[0] === 'addchain' && expo[0] === 'natural') {
            const fact = addFactor(base);
            if (fact[0] === 'mulchain') {
                fact.shift();
                const newOperand = fact.map(term => [term[0], ['power', term[1], expo]]);
                return ['mulchain', ...newOperand];
            }
            return [operator, base, expo];
        }
        return [operator, base, expo];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => powAddFactoredForm(term));
    return [operator, ...newOperand];
}
