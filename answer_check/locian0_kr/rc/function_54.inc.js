import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function fracSeparation(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!(operator === 'fraction' && operand[0][0] === 'addchain')) {
        return [operator, ...operand.map(term => fracSeparation(term))];
    }
    const merge = ['fraction', addFactoredForm(operand[0]), addFactoredForm(operand[1])];
    const merge_1 = JSON.stringify(merge);
    const simple = JSON.stringify(fracSimp(merge)) === merge_1 && JSON.stringify(fracSimpVar(merge)) === merge_1;
    const den = fracSeparation(operand[1]);
    const [[, ...operand_1]] = operand;
    let newOperand = [];
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    operand_1.forEach(term => {
        let sign;
        let nden;
        if (den[0] === 'negative') {
            sign = signs.has(term[0])
                ? signs.get(term[0])
                : term[0];
            nden = den[1];
        } else if (den[0] === 'pm' || term[0] === 'addsub') {
            sign = 'addsub';
            nden = den[0] === 'pm'
                ? den[1]
                : den;
        } else if (den[0] === 'mp' || term[0] === 'subadd') {
            sign = 'subadd';
            nden = den[0] === 'mp'
                ? den[1]
                : den;
        } else {
            sign = term[0];
            nden = den;
        }
        const term_add = simple
            ? fracSimp(['fraction', fracSeparation(term[1]), nden])
            : ['fraction', fracSeparation(term[1]), nden]
        newOperand = [...newOperand, [sign, term_add]];
    });
    return ['addchain', ...newOperand];
}
