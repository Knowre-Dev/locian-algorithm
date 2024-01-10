import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function fracSeparation(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator === 'fraction' && operand[0][0] === 'addchain') {
        const merge = ['fraction', addFactoredForm(operand[0]), addFactoredForm(operand[1])];
        const simple = (JSON.stringify(fracSimp(merge)) === JSON.stringify(merge) && JSON.stringify(fracSimpVar(merge)) === JSON.stringify(merge));
        const den = fracSeparation(operand[1]);
        const [, ...operand_0] = operand[0];
        let newOperand = [];
        operand_0.forEach(term => {
            let sign;
            let nden;
            if (den[0] === 'negative') {
                sign = term[0] === 'add' ? 'sub'
                    : term[0] === 'sub' ? 'add'
                    : term[0];
                nden = den[1];
            } else if (den[0] === 'pm' || term[0] === 'addsub') {
                sign = 'addsub';
                nden = den[0] === 'pm' ? den[1] : den;
            } else if (den[0] === 'mp' || term[0] === 'subadd') {
                sign = 'subadd';
                nden = den[0] === 'mp' ? den[1] : den;
            } else {
                sign = term[0];
                nden = den;
            }
            newOperand = simple ? [...newOperand, [sign, fracSimp(['fraction', fracSeparation(term[1]), nden])]]
                : [...newOperand, [sign, ['fraction', fracSeparation(term[1]), nden]]];
        });
        return ['addchain', ...newOperand];
    }
    return [operator, ...operand.map(term => fracSeparation(term))];
}
