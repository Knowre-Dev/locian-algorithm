/*
mulchain의 div를 frac으로 변환
a*b/c*d => a*(b/c)*d
*/
export function divFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator, ...operand] = tree;
    if (operator !== 'mulchain') {
        const operand_new = operand.map(term => divFrac(term));
        return [operator, ...operand_new];
    }
    const [[, term_0], [op_1, term_1]] = operand;
    if (operand.length === 2 && op_1 === 'div') {
        return ['fraction', divFrac(term_0), divFrac(term_1)];
    }
    const [term_head, ...terms] = operand;
    let newOperand = [term_head];
    terms.forEach(term => {
        let term_new = [];
        const [op_1, term_1] = term;
        const key_last = newOperand.length - 1;
        const [op_last, term_last] = newOperand[key_last];
        if (op_1 === 'mul' && op_last === 'div') {
            term_new = ['mul', ['fraction', divFrac(term_last), divFrac(term_1)]]
            newOperand[key_last] = term_new;
        } else {
            newOperand = [...newOperand, divFrac(term)];
        }
    });
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
