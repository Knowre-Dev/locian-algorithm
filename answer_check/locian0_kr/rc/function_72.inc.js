import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { gcd } from '../rc/sub_functions.js'
export function addFactor(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return addCommutative(tree);
    }
    // extract all constant coefficents (not in denominator)
    let cons = collect_cons(operand);

    // divide each term by the constant coefficients
    if (cons.length === 0) {
        return addCommutative(tree);
    }
    const lcm = cons.reduce((a, b) => a * b / gcd(a, b), 1);
    const con = ['natural', lcm.toString()];
    cons = cons.map(term => ['mul', ['natural', term]]);
    const addchain_new = form_addchain(operand, con, cons);
    return addCommutative(['mulchain', ['mul', con], ['mul', addchain_new]]);
}

function collect_cons(operand) {
    let cons = [];
    operand.forEach(term => { // addchain
        [, term] = term
        const [operator_t, ...operand_t] = term;
        switch (operator_t) {
            case 'mulchain': {
                let con = '1';
                const [[, [op_0, term_0]]] = operand_t;
                if (op_0 === 'natural' && term_0 !== '0') {
                    con = term_0;
                }
                if (has_var(operand_t) && con !== '1') {
                    cons = [...cons, con];
                }
                break;
            }
            case 'fraction': {
                const [num_t] = operand_t;
                if (num_t[0] === 'mulchain') {
                    let con = '1';
                    const [, ...terms_t] = num_t;
                    if (!has_var(terms_t)) {
                        break;
                    }
                    terms_t.forEach(term_t => {
                        const [op_t, [op_t1, term_t1]] = term_t;
                        if (op_t === 'mul' && op_t1 === 'natural' && term_t1 !== '0') {
                            con = term_t1;
                        }
                    });
                    if (con !== '1') {
                        cons = [...cons, con];
                    }
                }
                break;
            }
        }
    });
    return cons;
}

function has_var(terms) {
    return terms.some(term => term[0] === 'mul' && term[1][0] === 'variable');
}

function form_addchain(operand, con, cons) {
    let addchain_new = ['addchain'];
    operand.forEach(term => {
        const [op_t, term_t] = term;
        let num = term_t;
        let den = con;
        if (term_t[0] === 'fraction') {
            [, num, den] = term_t;
            if (den[0] !== 'mulchain') {
                den = ['mulchain', ['mul', den]];
            }
            den = [...den, ...cons];
        }
        const frac = fracSimpInt(['fraction', num, den]);
        addchain_new = [...addchain_new, [op_t, frac]];
    });
    return addchain_new;
}

/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\frac{4x}{5}-12';
const tree_1 = LatexToTree(latex_1)
const tree_11 = addFactor(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
