export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    const numArr = [];
    const denArr = [];
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        const num = fracComplex(operand[0]);
        const den = fracComplex(operand[1]);
        if (num[0] === 'fraction') {
            numArr.push(num[1]);
            denArr.push(num[2]);
        } else {
            numArr.push(num);
        }
        if (den[0] === 'fraction') {
            denArr.push(den[1]);
            numArr.push(den[2]);
        } else {
            denArr.push(den);
        }

        const newNum = numArr.length > 1 ? ['mulchain', ...numArr.map(term => ['mul', term])]
            : numArr[0];
        const newDen = denArr.length > 1 ? ['mulchain', ...denArr.map(term => ['mul', term])]
            : denArr[0];
        return [operator, newNum, newDen]
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => fracComplex(term));
    return [operator, ...newOperand];
}
