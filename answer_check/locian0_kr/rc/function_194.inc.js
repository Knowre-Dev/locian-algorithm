export function mulToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        const power = {};
        const varNum = [];
        for (const term of tree_1) {
            if (term[0] === 'mul') {
                if (term[1][0] === 'variable') {
                    if (!Object.prototype.hasOwnProperty.call(power, term[1][1])) {
                        power[term[1][1]] = [];
                    }
                    power[term[1][1]].push(term[1]);
                } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                    varNum.push(term);
                } else {
                    varNum.push(term);
                }
            } else {
                varNum.push(term);
            }
        }
        const power_values = Object.values(power);
        for (const v of power_values) {
            const v_length = v.length;
            v_length > 1 ? varNum.push(['mul', ['power', v[0], ['natural', (v_length).toString()]]])
            : varNum.push(['mul', v[0]]);
        }
        return varNum.length === 1 ? varNum[0][1] : [operator].concat(varNum);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mulToExp(v));
    }
    return [operator].concat(newOperand);
}
