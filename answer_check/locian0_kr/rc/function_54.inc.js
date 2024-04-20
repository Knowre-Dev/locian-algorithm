import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
// 분수에서 분자가 addchain인 경우 분수들의 addchain으로 바꿈 (a+b)/c => a/c+b/c
export function fracSeparation(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!(operator === 'fraction' && operand[0][0] === 'addchain')) {
        return [operator, ...operand.map(term => fracSeparation(term))];
    }
    let [num, den] = operand;// num: addchain
    const merge = ['fraction', addFactoredForm(num), addFactoredForm(den)];
    const merge_1 = JSON.stringify(merge);
    const simple = JSON.stringify(fracSimp(merge)) === merge_1 && JSON.stringify(fracSimpVar(merge)) === merge_1;
    den = fracSeparation(den);
    let newOperand = [];
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    const signs_both = new Map([
        ['pm', 'addsub'],
        ['mp', 'subadd']
    ]);
    const [, ...operand_num] = num;
    operand_num.forEach(term => {
        const new_den = ['negative', 'pm', 'mp'].includes(den[0])
            ? den[1]
            : den;
        const sign = den[0] === 'negative'
            ? signs.has(term[0])
                ? signs.get(term[0])
                : term[0]
            : signs_both.has(den[0])
                ? signs_both.get(den[0])
                : term[0];
        let term_add = ['fraction', fracSeparation(term[1]), new_den];
        if (simple) {
            term_add = fracSimp(term_add);
        }
        newOperand = [...newOperand, [sign, term_add]];
    });
    return ['addchain', ...newOperand];
}
