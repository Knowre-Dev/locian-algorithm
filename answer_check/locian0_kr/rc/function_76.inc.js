export function fracSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracSimpInt(term))];
    }
    const num = fracSimpInt(operand[0]);
    const den = fracSimpInt(operand[1]);
    let intNum;
    let intDen;
    let narrNum = [];
    switch (num[0]) {
        case 'natural': {
            intNum = num[1];
            break;
        }
        case 'mulchain': {
            let arrNum = [];
            const [, ...num_1] = num;
            num_1.forEach(term => {
                term[0] === 'mul' && term[1][0] === 'natural'
                    ? arrNum = [...arrNum, term[1][1]]
                    : narrNum = [...narrNum, term];
            });
            const arrNum_length = arrNum.length;
            intNum = arrNum_length === 0
                ? 1
                : arrNum_length === 1
                    ? arrNum[0]
                    : arrNum.reduce((a, b) => a * b);
            break;
        }
        default: {
            intNum = 1;
        }
    }

    let arrDen = [];
    let narrDen = [];

    switch (den[0]) {
        case 'natural': {
            intDen = den[1];
            break;
        }
        case 'mulchain': {
            const [, ...den_1] = den;
            den_1.forEach(term => {
                (term[0] === 'mul' && term[1][0] === 'natural')
                    ? arrDen = [...arrDen, term[1][1]]
                    : narrDen = [...narrDen, term];
            });
            const arrDen_length = arrDen.length;
            intDen = arrDen_length === 0
                ? 1
                : arrDen_length === 1
                    ? arrDen[0]
                    : arrDen.reduce((a, b) => a * b);
            break;
        }
        default: {
            intDen = 1;
        }
    }

    let A = intNum;
    let B = intDen;
    while (B !== 0) {
        const temp = B;
        B = A % B;
        A = temp;
    }
    const gcf = A;
    const newNum = (intNum / gcf).toString();
    const newDen = (intDen / gcf).toString();
    let newOperand = [];
    switch (num[0]) {
        case 'natural': {
            newOperand = [...newOperand, ['natural', newNum]];
            break;
        }
        case 'mulchain': {
            if (newNum !== '1') {
                narrNum = [['mul', ['natural', newNum]], ...narrNum];
            }
            narrNum = narrNum.length === 1
                ? narrNum[0][1]
                : ['mulchain', ...narrNum];
            newOperand = [...newOperand, narrNum];
            break;
        }
        default: {
            newOperand = [...newOperand, num];
        }
    }
    switch (den[0]) {
        case 'natural': {
            return newDen === '1'
                ? newOperand[0]
                : [operator, ...newOperand, ['natural', newDen]];
        }
        case 'mulchain': {
            if (newDen !== '1') {
                narrDen = [['mul', ['natural', newDen]], ...narrDen];
            }
            narrDen = narrDen.length === 1
                ? narrDen[0][1]
                : ['mulchain', ...narrDen];
            return [operator, ...newOperand, narrDen];
        }
        default: {
            return [operator, ...newOperand, den];
        }
    }
}

export function EuclidAlg(A, B) {
    while (B !== 0) {
        const temp = B;
        B = A % B;
        A = temp;
    }
    return A;
}
