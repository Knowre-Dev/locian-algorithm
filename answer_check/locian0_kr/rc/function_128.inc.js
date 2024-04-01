import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimp } from '../rc/function_67.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { gcd } from '../rc/sub_functions.js';
export function addFactor_1(tree = null) {
    const tree1 = JSON.stringify(tree);
    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (tree1 !== JSON.stringify(fracSimp(tree)) || tree1 !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return addCommutative(tree);
    }

    let power = false;
    let cons = [];
    operand.forEach(addterm => {
        const [, [operator_1]] = addterm;
        if (operator_1 === 'mulchain') {
            let con = ['natural', '1'];
            let syms = [];
            const [, [, term_1, ...addterm_1]] = addterm;
            if (term_1[0] === 'mul') {
                const is_variable = ['variable', 'squareroot'].includes(term_1[1][0]) || (term_1[1][0] === 'power' && term_1[1][1][0] === 'variable');
                if (is_variable) {
                    syms = [...syms, term_1];
                } else if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                    con = term_1;
                }
            }
            addterm_1.forEach(term_2 => {
                const is_variable = ['variable', 'squareroot'].includes(term_2[1][0]) || (term_2[1][0] === 'power' && term_2[1][1][0] === 'variable');
                if (term_2[0] === 'mul' && is_variable) {
                    syms = [...syms, term_2];
                }
            });
            if (syms.length > 0 && con[1] !== '1') {
                cons = [...cons, con];
            }
        } else if (operator_1 === 'fraction') {
            let con = [];
            let syms = [];
            if (addterm[1][1][0] === 'mulchain') {
                con = ['natural', '1'];
                const [, [, [, ...addterm_1]]] = addterm;
                addterm_1.forEach(term_1 => {
                    if (term_1[0] === 'mul') {
                        if (['variable', 'squareroot'].includes(term_1[1][0])) {
                            syms = [...syms, term_1];
                        } else if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                            con = term_1;
                        }
                    }
                });
            } else if (addterm[1][1][0] === 'natural' && addterm[1][1][1] !== '1') {
                [, con] = addterm;
            }

            if (syms.length > 0 && con[1] !== '1') {
                cons = [...cons, con];
            }
        } else if (operator_1 === 'natural' && addterm[1][1] !== '1') {
            cons = [...cons, addterm];
        } else if (operator_1 === 'power') {
            power = true;
        }
    });

    const cons_length = cons.length;
    if (cons_length === 0) {
        return addCommutative(tree);
    }
    let con = [];
    if (cons_length === 1 || power === true) {
        con = ['natural', '1'];
    } else {
        let [[, [, g]], ...cons_rest] = cons;
        g = cons_rest.reduce(function(a, b) {
                const [, [, b_1]] = b;
                return gcd(a, b_1);
            },
        g);
        con = ['natural', g.toString()];
    }

    if (con[1] === '1') {
        return addCommutative(tree);
    }

    let newAdd = ['addchain'];
    operand.forEach(term => {
        if (term[1][0] === 'fraction') {
            if (term[1][2][0] !== 'mulchain') {
                term[1][2] = ['mulchain', ['mul', term[1][2]]];
            }
            newAdd = [...newAdd, [term[0], fracSimpInt(['fraction', term[1][1], [...term[1][2], ...[['mul', con]]]])]];
        } else {
            newAdd = [...newAdd, [term[0], fracSimpInt(['fraction', term[1], con])]];
        }
    });
    return addCommutative(['mulchain', ['mul', con], ['mul', newAdd]]);
}
