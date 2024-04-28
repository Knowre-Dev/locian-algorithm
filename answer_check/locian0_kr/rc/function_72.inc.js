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
    let cons = [];
    operand.forEach(term => { // addchain
        [, term] = term
        const [operator_t, ...operand_t] = term;
        switch (operator_t) {
            case 'mulchain': {
                let con = '1';
                const [term_1] = operand_t;
                if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                    con = term_1[1][1];
                }
                const has_sym = operand_t.some(term_t => term_t[0] === 'mul' && term_t[1][0] === 'variable');
                if (has_sym && con !== '1') {
                    cons = [...cons, con];
                }
                break;
            }
            case 'fraction': {
                const [num_t] = operand_t;
                if (num_t[0] === 'mulchain') {
                    let con = '1';
                    const [, ...terms_t] = num_t;
                    const has_sym = terms_t.some(term_t => term_t[0] === 'mul' && term_t[1][0] === 'variable');
                    terms_t.forEach(term_t => {
                        if (term_t[0] === 'mul' && term_t[1][0] === 'natural' && term_t[1][1] !== '0') {
                            con = term_t[1][1];
                        }
                    });
                    if (has_sym && con !== '1') {
                        cons = [...cons, con];
                    }
                }
                break;
            }
        }
    });
    // divide each term by the constant coefficients
    if (cons.length === 0) {
        return addCommutative(tree);
    }
    const lcm = cons.reduce((a, b) => a * b / gcd(a, b), 1);
    const con = ['natural', lcm.toString()];
    cons = cons.map(term => ['mul', ['natural', term]]);
    let new_addchain = ['addchain'];
    operand.forEach(term => {
        let num;
        let den;
        const [operator_t, term_t] = term;
        if (term_t[0] === 'fraction') {
            [, num, den] = term_t;
            if (den[0] !== 'mulchain') {
                den = ['mulchain', ['mul', den]];
            }
            den = [...den, ...cons];
        } else {
            num = term_t;
            den = con;
        }
        new_addchain = [...new_addchain, [operator_t, fracSimpInt(['fraction', num, den])]];
    });
    return addCommutative(['mulchain', ['mul', con], ['mul', new_addchain]]);
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\frac{4x}{5}-12';
const tree_1 = LatexToTree(latex_1)
const tree_11 = addFactor(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
