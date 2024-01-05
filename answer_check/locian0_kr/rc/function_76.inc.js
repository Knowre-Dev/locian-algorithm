export function fracSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        const num = fracSimpInt(operand[0]);
        const den = fracSimpInt(operand[1]);
        let intNum;
        let intDen;
        let narrNum = [];
        switch (num[0]) {
            case 'natural': {
                intNum = parseInt(num[1]);
                break;
            }
            case 'mulchain': {
                const arrNum = [];
                const [, ...num_1] = num;
                num_1.forEach(term => {
                    (term[0] === 'mul' && term[1][0] === 'natural') ? arrNum.push(parseInt(term[1][1]))
                    : narrNum.push(term)
                });
                const arrNum_length = arrNum.length;
                intNum = arrNum_length === 0 ? 1
                    : arrNum_length === 1 ? arrNum[0]
                    : arrNum.reduce((a, b) => a * b);
                break;
            }
            default: {
                intNum = 1;
            }
        }

        const arrDen = [];
        let narrDen = [];

        switch (den[0]) {
            case 'natural': {
                intDen = parseInt(den[1]);
                break;
            }
            case 'mulchain': {
                const [, ...den_1] = den;
                den_1.forEach(term => {
                    (term[0] === 'mul' && term[1][0] === 'natural') ? arrDen.push(parseInt(term[1][1]))
                    : narrDen.push(term)
                });
                const arrDen_length = arrDen.length;
                intDen = arrDen_length === 0 ? 1
                    : arrDen_length === 1 ? arrDen[0]
                    : arrDen.reduce((a, b) => a * b);
                break;
            }
            default: {
                intDen = 1;
            }
        }

        const gcf = EuclidAlg(intNum, intDen);
        const newNum = (intNum / gcf).toString();
        const newDen = (intDen / gcf).toString();
        let newOperand = [];
        switch (num[0]) {
            case 'natural': {
                newOperand.push(['natural', newNum]);
                break;
            }
            case 'mulchain': {
                if (newNum !== '1') {
                    narrNum = [['mul', ['natural', newNum]], ...narrNum];
                }
                narrNum.length === 1 ? narrNum = narrNum[0][1]
                : narrNum = ['mulchain', ...narrNum];
                newOperand.push(narrNum);
                break;
            }
            default: {
                newOperand.push(num);
            }
        }

        switch (den[0]) {
            case 'natural': {
                newDen === '1' ? [operator, ...newOperand] = newOperand[0]
                : newOperand.push(['natural', newDen]);
                break;
            }
            case 'mulchain': {
                if (newDen !== '1') {
                    narrDen = [['mul', ['natural', newDen]], ...narrDen];
                }
                narrDen.length === 1 ? narrDen = narrDen[0][1]
                : narrDen = ['mulchain', ...narrDen];
                newOperand.push(narrDen);
                break;
            }
            default: {
                newOperand.push(den);
            }
        }
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    const newOperand = operand.map(term => fracSimpInt(term));
    return [operator, ...newOperand];
}

export function EuclidAlg(A, B) {
    while (B !== 0) {
        const temp = B;
        B = A % B;
        A = temp;
    }
    return A;
}
