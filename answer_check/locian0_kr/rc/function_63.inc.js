import _ from 'lodash';

export function varReverseShift(tree, types = [null], parent = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    const operand_entries = operand.entries();
    for (const [key, term] of operand_entries) {
        operand[key] = varReverseShift(term, types, operator);
    }

    if (operator === 'mulchain' && types.includes(parent)) {
        let vars = [];

        for (const term of operand) {
            const is_variable = (term[0] === 'mul' && term[1][0] === 'variable' && term.length === 2);
            if (!is_variable) {
                return tree;
            }
            vars.push(term[1][1]);
        }
        const vars_1 = _.cloneDeep(vars);
        vars_1.sort();
        let k = Object.keys(vars).find(key => vars[key] === vars_1[0]);
        const result = [];
        const vars_length = vars.length;
        if (((typeof vars[k - 1] !== 'undefined') ? vars[k - 1]
            : vars[vars_length - 1]) < ((typeof vars[k + 1] !== 'undefined') ? vars[k + 1]
            : vars[0])) {
            k = vars_length - 1 - k;
            vars = vars.reverse();
        }
        for (let i = k; i < vars_length; i++) {
            result[i - k] = ['mul', ['variable', vars[i]]];
        }
        for (let i = 0; i < k; i++) {
            result[i + vars_length - k] = ['mul', ['variable', vars[i]]];
        }
        return [operator + '_fixed', ...result];
    }

    return [operator, ...operand];
}
