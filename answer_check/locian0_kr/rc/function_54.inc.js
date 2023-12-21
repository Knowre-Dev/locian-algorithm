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
        let simple = false;
        if (JSON.stringify(fracSimp(merge)) === JSON.stringify(merge) && JSON.stringify(fracSimpVar(merge)) === JSON.stringify(merge)) {
            simple = true;
        }

        const den = fracSeparation(operand[1]);
        const [, ...operand_0] = operand[0];
        const newOperand = [];
        for (const term of operand_0) {
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
            simple ? newOperand.push([sign, fracSimp(['fraction', fracSeparation(term[1]), nden])])
            : newOperand.push([sign, ['fraction', fracSeparation(term[1]), nden]]);
        }
        return ['addchain', ...newOperand];
    }
    const newOperand = operand.map(term => fracSeparation(term));
    return [operator, ...newOperand];
}
