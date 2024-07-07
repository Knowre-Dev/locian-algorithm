import { gcd } from '../rc/sub_functions.js'
// 분수에서 자연수 약분
export function fracSimpInt(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracSimpInt(term))];
    }
    let [num, den] = operand;
    num = fracSimpInt(num);
    den = fracSimpInt(den);
    // 자연수와 나머지 분리
    const [num_int, num_others] = update_term(num);
    const [den_int, den_others] = update_term(den);

    // 자연수 부분 서로소로 만들기
    const g = gcd(num_int, den_int);
    const num_int_new = (num_int / g).toString();
    const den_int_new = (den_int / g).toString();

    const new_num = form_term(num, num_int_new, num_others);
    const new_den = form_term(den, den_int_new, den_others);
    return JSON.stringify(new_den) === JSON.stringify(['natural', '1']) // 분자가 1인가 아닌가
        ? new_num
        : [operator, new_num, new_den]
}

function form_term(term, int, others) {
    let new_term = term
    const [operator] = term;
    switch (operator) {
        case 'natural': {
            new_term = ['natural', int];
            break;
        }
        case 'mulchain': {
            if (int !== '1') {
                others = [['mul', ['natural', int]], ...others];
            }
            new_term = others.length === 1
                ? others[0][1]
                : ['mulchain', ...others];
            break;
        }
    }
    return new_term
}

function update_term(term) {
    let int = 1;
    let others = [];
    const [operator_t, ...operand_t] = term;
    switch (operator_t) {
        case 'natural': {
            [int] = operand_t;
            break;
        }
        case 'mulchain': {
            let ints = [1];
            operand_t.forEach(term_t => {
                const [op_t, term_t1] = term_t
                op_t === 'mul' && term_t1[0] === 'natural'
                    ? ints = [...ints, term_t1[1]]
                    : others = [...others, term_t];
            });
            int = ints.reduce((a, b) => a * b);
            break;
        }
    }
    return [int, others];
}

/*
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
*/
