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
        return [operator, ...operand.map(term => divFrac(term))];
    }
    if (operand.length === 2 && operand[1][0] === 'div') {
        return ['fraction', divFrac(operand[0][1]), divFrac(operand[1][1])];
    }
    const [operand_0, ...operand_1] = operand;
    let newOperand = [operand_0];
    operand_1.forEach(term => {
        let term_new = [];
        if (newOperand[newOperand.length - 1][0] === 'mul' && term[0] === 'div') {
            term_new = ['mul', ['fraction', divFrac(newOperand.pop()[1]), divFrac(term[1])]]
        } else {
            term_new = divFrac(term);
        }
        newOperand = [...newOperand, term_new];
    });
    return newOperand.length === 1
        ? newOperand[0][1]
        : [operator, ...newOperand];
}
