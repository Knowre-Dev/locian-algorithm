import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimp } from '../rc/function_67.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { gcd } from '../rc/sub_functions.js';
// addchain 항들의 계수의 쵀대공약수를 구해 그 수를 전체 계수로
export function addFactor_1(tree = null) {
    const tree_1 = JSON.stringify(tree);
    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (tree_1 !== JSON.stringify(fracSimp(tree)) || tree_1 !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return addCommutative(tree);
    }

    let cons = [];
    const operand_length = operand.length; // addchain
    for (let i = 0; i < operand_length; i++) {
        const [, [operator_i, ...operand_i]] = operand[i];
        if (operator_i === 'power') {
            return addCommutative(tree);
        }
        if (is_bigger_one(operand[i][1])) { // operand[i] === [, ['natural', '']]
            cons = [...cons, parseInt(operand_i[0])];
            continue;
        }
        let con = 1;
        let has_sym = false;
        if (operator_i === 'mulchain') {
            const [term_0, ...terms_1] = operand_i;
            if (term_0[0] === 'mul') { // 첫항이 숫자인지 아닌 지 확인
                if (is_variable(term_0[1])) {
                    has_sym = true;
                } else if (is_bigger_one(term_0[1])) {
                    con = parseInt(term_0[1][1]);
                }
            }
            has_sym = terms_1.some(term_1 => term_1[0] === 'mul' && is_variable(term_1[1]));
        } else if (operator_i === 'fraction') {
            const [num] = operand_i;
            if (num[0] === 'mulchain') {
                const [, ...terms_num] = num
                terms_num.forEach(term_num => {
                    const [op_n, term_n_1] = term_num;
                    if (op_n === 'mul') {
                        if (['variable', 'squareroot'].includes(term_n_1[0])) {
                            has_sym = true;
                        } else if (is_bigger_one(term_n_1)) {
                            con = parseInt(term_n_1[1]);
                        }
                    }
                });
            } else if (is_bigger_one(num)) {
                con = parseInt(num[1]);
            }
        }
        if (has_sym && con !== 1) {
            cons = [...cons, con];
        }
    }
    if (cons.length <= 1) {
        return addCommutative(tree);
    }
    const g = cons.reduce((a, b) => gcd(a, b), cons[0]);
    const con = ['natural', g.toString()];
    const addchain = form_addchain(operand, con);
    return addCommutative(['mulchain', ['mul', con], ['mul', addchain]]);
}

function form_addchain(operand, con) {
    let addchain = ['addchain'];
    operand.forEach(term => { // addchain;
        const [operator_t, operand_t] = term;
        let new_num_t = operand_t;
        let new_den_t = con;
        if (operand_t[0] === 'fraction') {
            const [, num_t, den_t] = operand_t;
            new_num_t = num_t;
            new_den_t = den_t[0] !== 'mulchain'
                ? ['mulchain', ['mul', den_t], ['mul', con]]
                : [...den_t, ['mul', con]];
        }
        addchain = [...addchain, [operator_t, fracSimpInt(['fraction', new_num_t, new_den_t])]];
    });
    return addchain;
}

function is_variable(term) {
    return ['variable', 'squareroot'].includes(term[0]) || (term[0] === 'power' && term[1][0] === 'variable');
}

function is_bigger_one(term) {
    return term[0] === 'natural' && !['0', '1'].includes(term[1]);
}
