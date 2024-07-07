// import _ from 'lodash';

export function varShift(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let [operator, ...operand] = tree;
    operand = operand.map(term => varShift(term, types, operator));
    if (!(operator === 'mulchain' && types.includes(parent))) {
        return tree;
    }
    let vars = [];
    for (const term of operand) {
        const [op, term_1] = term;
        const is_variable = op === 'mul' && term_1[0] === 'variable' && term.length === 2;
        if (!is_variable) {
            return tree;
        }
        vars = [...vars, term_1[1]];
    }
    const vars_copy = [...vars];
    vars_copy.sort();
    const k = Object.keys(vars).find(key => vars[key] === vars_copy[0]);
    const newOperand = vars.map(vari => ['mul', ['variable', vari]])
    const newOperand_1 = newOperand.slice(k);
    const newOperand_2 = newOperand.slice(0, k);
    return [operator + '_fixed', ...newOperand_1, ...newOperand_2];
}
