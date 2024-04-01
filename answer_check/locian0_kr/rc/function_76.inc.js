import { gcd } from '../rc/sub_functions.js'
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
    let intNum = 1;
    let narrNum = [];
    switch (num[0]) {
        case 'natural': {
            [, intNum] = num;
            break;
        }
        case 'mulchain': {
            let arrNum = [1];
            const [, ...num_1] = num;
            num_1.forEach(term => {
                term[0] === 'mul' && term[1][0] === 'natural'
                    ? arrNum = [...arrNum, term[1][1]]
                    : narrNum = [...narrNum, term];
            });
            intNum = arrNum.reduce((a, b) => a * b);
            break;
        }
    }

    let intDen = 1;
    let narrDen = [];
    switch (den[0]) {
        case 'natural': {
            [, intDen] = den;
            break;
        }
        case 'mulchain': {
            const [, ...den_1] = den;
            let arrDen = [1];
            den_1.forEach(term => {
                term[0] === 'mul' && term[1][0] === 'natural'
                    ? arrDen = [...arrDen, term[1][1]]
                    : narrDen = [...narrDen, term];
            });
            intDen = arrDen.reduce((a, b) => a * b);
            break;
        }
    }
    const g = gcd(intNum, intDen);
    const newNum = (intNum / g).toString();
    const newDen = (intDen / g).toString();
    let num_1 = num;
    switch (num[0]) {
        case 'natural': {
            num_1 = ['natural', newNum];
            break;
        }
        case 'mulchain': {
            if (newNum !== '1') {
                narrNum = [['mul', ['natural', newNum]], ...narrNum];
            }
            num_1 = narrNum.length === 1
                ? narrNum[0][1]
                : ['mulchain', ...narrNum];
            break;
        }
    }
    switch (den[0]) {
        case 'natural': {
            return newDen === '1'
                ? num_1
                : [operator, num_1, ['natural', newDen]];
        }
        case 'mulchain': {
            if (newDen !== '1') {
                narrDen = [['mul', ['natural', newDen]], ...narrDen];
            }
            narrDen = narrDen.length === 1
                ? narrDen[0][1]
                : ['mulchain', ...narrDen];
            return [operator, num_1, narrDen];
        }
        default: {
            return [operator, num_1, den];
        }
    }
}
/*
export function EuclidAlg(A, B) {
    while (B !== 0) {
        [A, B] = [B, A % B];
    }
    return A;
}
*/
