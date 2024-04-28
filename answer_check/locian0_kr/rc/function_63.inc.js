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
        const is_variable = term[0] === 'mul' && term[1][0] === 'variable' && term.length === 2;
        if (!is_variable) {
            return tree;
        }
        vars = [...vars, term[1][1]];
    }

    const vars_1 = [...vars];
    vars_1.sort();
    let k = Object.keys(vars).find(key => vars[key] === vars_1[0]);
    const vars_length = vars.length;
    const term_1 = vars[(k - 1 + vars_length) % vars_length];
    /* const term_1 = typeof vars[k - 1] !== 'undefined' // k === 0
        ? vars[k - 1]
        : vars[vars_length - 1];
        */
    // const term_2 = vars[(k + 1 + vars_length) % vars_length];
    const term_2 = typeof vars[k + 1] !== 'undefined' // k === vars_length - 1
        ? vars[k + 1]
        : vars[0];
    if (term_1 < term_2) {
        k = vars_length - 1 - k;
        vars = vars.reverse();
    }
    const newOperand = vars.map(vari => ['mul', ['variable', vari]]);
    const newOperand_1 = newOperand.slice(k);
    const newOperand_2 = newOperand.slice(0, k);
    return [operator + '_fixed', ...newOperand_1, ...newOperand_2];
}
