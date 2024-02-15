import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimp } from '../rc/function_67.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function addFactor_1(tree = null) {
    const simple1 = JSON.stringify(fracSimp(tree));
    const simple2 = JSON.stringify(fracSimpVar(tree));
    const tree1 = JSON.stringify(tree);
    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (tree1 !== simple1 || tree1 !== simple2) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return addCommutative(tree);
    }

    let power = false;
    let consArr = [];
    operand.forEach(addterm => {
        if (addterm[1][0] === 'mulchain') {
            let con = ['natural', '1'];
            let syms = [];
            const [, [, term_1, ...addterm_2]] = addterm;
            if (term_1[0] === 'mul') {
                if (term_1[1][0] === 'variable') {
                    syms = [...syms, term_1];
                } else if (term_1[1][0] === 'squareroot') {
                    syms = [...syms, term_1];
                } else if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                    con = term_1;
                } else if (term_1[1][0] === 'power' && term_1[1][1][0] === 'variable') {
                    syms = [...syms, term_1];
                }
            }
            addterm_2.forEach(term_addterm_1 => {
                if (term_addterm_1[0] === 'mul') {
                    if (term_addterm_1[1][0] === 'variable') {
                        syms = [...syms, term_addterm_1];
                    } else if (term_addterm_1[1][0] === 'squareroot') {
                        syms = [...syms, term_addterm_1];
                    } else if (term_addterm_1[1][0] === 'power' && term_addterm_1[1][1][0] === 'variable') {
                        syms = [...syms, term_addterm_1];
                    }
                }
            });
            if (syms.length > 0 && con[1] !== '1') {
                consArr = [...consArr, con];
            }
        } else if (addterm[1][0] === 'fraction') {
            let syms = [];
            let con = [];
            if (addterm[1][1][0] === 'mulchain') {
                con = ['natural', '1'];
                const [, ...addterm_11] = addterm[1][1];
                addterm_11.forEach(term_addterm_11 => {
                    if (term_addterm_11[0] === 'mul') {
                        if (term_addterm_11[1][0] === 'variable') {
                            syms = [...syms, term_addterm_11];
                        } else if (term_addterm_11[1][0] === 'squareroot') {
                            syms = [...syms, term_addterm_11];
                        } else if (term_addterm_11[1][0] === 'natural' && term_addterm_11[1][1] !== '0') {
                            con = term_addterm_11;
                        }
                    }
                });
            } else if (addterm[1][1][0] === 'natural' && addterm[1][1][1] !== '1') {
                con = addterm[1];
            }

            if (syms.length > 0 && con[1] !== '1') {
                consArr = [...consArr, con];
            }
        } else if (addterm[1][0] === 'natural' && addterm[1][1] !== '1') {
            consArr = [...consArr, addterm];
        } else if (addterm[1][0] === 'power') {
            power = true;
        }
    });

    const consArr_length = consArr.length;
    if (consArr_length === 0) {
        return addCommutative(tree);
    }
    let con = [];
    if (consArr_length === 1) {
        con = ['natural', '1'];
    } else {
        if (power === true) {
            con = ['natural', '1'];
        } else {
            let gcd = consArr[0][1][1];
            const [, ...consArr_rest] = consArr;
            gcd = consArr_rest.reduce(function(a, b) {
                    let A = a;
                    let B = b[1][1];
                    while (B !== 0) {
                        const temp = B;
                        B = A % B;
                        A = temp;
                    }
                    return A;
                },
            gcd);
            con = ['natural', gcd.toString()];
        }
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
