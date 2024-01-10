export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    let numArr = [];
    let denArr = [];
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        const num = fracComplex(operand[0]);
        const den = fracComplex(operand[1]);
        if (num[0] === 'fraction') {
            numArr = [...numArr, num[1]];
            denArr = [...denArr, num[2]];
        } else {
            numArr = [...numArr, num];
        }
        if (den[0] === 'fraction') {
            denArr = [...denArr, den[1]];
            numArr = [...numArr, den[2]];
        } else {
            denArr = [...denArr, den];
        }

        const newNum = numArr.length > 1 ? ['mulchain', ...numArr.map(term => ['mul', term])]
            : numArr[0];
        const newDen = denArr.length > 1 ? ['mulchain', ...denArr.map(term => ['mul', term])]
            : denArr[0];
        return [operator, newNum, newDen]
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => fracComplex(term))];
}
