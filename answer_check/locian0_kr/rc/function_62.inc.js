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
        const is_variable = term[0] === 'mul' && term[1][0] === 'variable' && term.length === 2;
        if (!is_variable) {
            return tree;
        }
        vars = [...vars, term[1][1]];
    }
    const vars_1 = [...vars];
    vars_1.sort();
    const k = Object.keys(vars).find(key => vars[key] === vars_1[0]);
    const newOperand = vars.map(vari => ['mul', ['variable', vari]])
    const newOperand_1 = newOperand.slice(k);
    const newOperand_2 = newOperand.slice(0, k);
    return [operator + '_fixed', ...newOperand_1, ...newOperand_2];
}
