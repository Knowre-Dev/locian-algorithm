export function fracComplex(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;

    const numArr = [];
    const denArr = [];
    const newOperand = [];
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

        let newNum = [];
        if (numArr.length > 1) {
            newNum = ['mulchain'];
            for (const term of numArr) {
                newNum.push(['mul', term]);
            }
        } else {
            newNum = numArr[0];
        }

        let newDen = [];
        if (denArr.length > 1) {
            newDen = ['mulchain'];
            for (const term of denArr) {
                newDen.push(['mul', term]);
            }
        } else {
            newDen = denArr[0];
        }
        return [operator, newNum, newDen]
    }
    const [, ...operand] = tree;
    for (const term of operand) {
        newOperand.push(fracComplex(term));
    }
    return [operator, ...newOperand];
}
