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
    let num_int = 1;
    let num_others = [];
    switch (num[0]) {
        case 'natural': {
            [, num_int] = num;
            break;
        }
        case 'mulchain': {
            let ints = [1];
            const [, ...num_1] = num;
            num_1.forEach(term => {
                term[0] === 'mul' && term[1][0] === 'natural'
                    ? ints = [...ints, term[1][1]]
                    : num_others = [...num_others, term];
            });
            num_int = ints.reduce((a, b) => a * b);
            break;
        }
    }

    let den_int = 1;
    let den_others = [];
    switch (den[0]) {
        case 'natural': {
            [, den_int] = den;
            break;
        }
        case 'mulchain': {
            const [, ...den_1] = den;
            let ints = [1];
            den_1.forEach(term => {
                term[0] === 'mul' && term[1][0] === 'natural'
                    ? ints = [...ints, term[1][1]]
                    : den_others = [...den_others, term];
            });
            den_int = ints.reduce((a, b) => a * b);
            break;
        }
    }
    const g = gcd(num_int, den_int);
    const newNum = (num_int / g).toString();
    const newDen = (den_int / g).toString();
    let num_1 = num;
    switch (num[0]) {
        case 'natural': {
            num_1 = ['natural', newNum];
            break;
        }
        case 'mulchain': {
            if (newNum !== '1') {
                num_others = [['mul', ['natural', newNum]], ...num_others];
            }
            num_1 = num_others.length === 1
                ? num_others[0][1]
                : ['mulchain', ...num_others];
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
                den_others = [['mul', ['natural', newDen]], ...den_others];
            }
            den_others = den_others.length === 1
                ? den_others[0][1]
                : ['mulchain', ...den_others];
            return [operator, num_1, den_others];
        }
        default: {
            return [operator, num_1, den];
        }
    }
}

/*
function int_separation(terms, others) {
    let ints = [1];
    const [, ...num_1] = terms;
    num_1.forEach(term => {
        term[0] === 'mul' && term[1][0] === 'natural'
            ? ints = [...ints, term[1][1]]
            : num_others = [...num_others, term];
    });
    num_int = ints.reduce((a, b) => a * b);
}
*/
