export function fracExpress(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (!(operator === 'mulchain' && operand[0][1][0] === 'fraction')) {
        return [operator, ...operand.map(term => fracExpress(term))];
    }

    let num = [];
    let den = [];
    let is_nega = false;

    const [term_0, ...operand_1] = operand; //  첫항 fraction
    [num, den, is_nega] = update_frac(term_0, num, den);

    operand_1.forEach(term => {
        const [op, [operator_t, ...operand_t]] = term;
        if (operator_t === 'fraction') {
            [num, den, is_nega] = update_frac(term, num, den);
        } else {
            num = operator_t === 'mulchain'
                ? [...num, ...operand_t]
                : [...num, [op, term[1]]];
        }
    });

    const num_length = num.length;
    num = num_length === 0
        ? ['natural', '1']
        : num_length === 1
            ? num[0][1]
            : ['mulchain', ...num];

    const den_length = den.length;
    const new_tree = den_length === 0
        ? num
        : den_length === 1
            ? ['fraction', num, den[0][1]]
            : ['fraction', num, ['mulchain', ...den]];

    return is_nega
        ? ['negative', new_tree]
        : new_tree;
}

function update_frac(term, num, den) {
    const [op, [, num_t, den_t]] = term;
    let is_nega = false;

    const [operator_num, ...operand_num] = num_t
    if (operator_num === 'mulchain') {
        num = [...num, ...operand_num];
    } else if (operator_num === 'negative') {
        operand_num[0][1] === '1'
            ? is_nega = true
            : num = [...num, [op, num_t]];
    } else if (operand_num[0] !== '1') {
        num = [...num, [op, num_t]];
    }

    const [operator_den, ...operand_den] = den_t
    if (operator_den === 'mulchain') {
       den = [...den, ...operand_den];
    } else if (operand_den[0] !== '1') {
       den = [...den, [op, den_t]];
    }
    return [num, den, is_nega];
}

/*
function add(arr) {
    arr.push(1);
}
const arr = [1];
add(arr);
console.log(JSON.stringify(arr, null, 4));
*/
