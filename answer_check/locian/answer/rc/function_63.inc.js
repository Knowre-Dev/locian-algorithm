export function varReverseShift(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    if (!(operator === 'mulchain' && types.includes(parent))) {
        return tree;
    }
    operand = operand.map(term => varReverseShift(term, types, operator));
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
    let k = Object.keys(vars).find(key => vars[key] === vars_copy[0]);
    const length_vars = vars.length;
    const key_1 = (k - 1 + length_vars) % length_vars;
    const term_1 = vars[key_1];
    const key_2 = (parseInt(k) + 1) % length_vars;
    const term_2 = vars[key_2];
    if (term_1 < term_2) {
        k = length_vars - 1 - k;
        vars = vars.reverse();
    }
    const newOperand = vars.map(vari => ['mul', ['variable', vari]]);
    const newOperand_1 = newOperand.slice(k);
    const newOperand_2 = newOperand.slice(0, k);
    return [operator + '_fixed', ...newOperand_1, ...newOperand_2];
}
