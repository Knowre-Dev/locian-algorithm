import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';

export function addFactor(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'addchain') {
        return addCommutative(tree);
    }
    // extract all constant coefficents (not in denominator)
    let consArr = [];
    operand.forEach(addterm => {
        switch (addterm[1][0]) {
            case 'mulchain': {
                let con = ['natural', '1'];
                let syms = [];
                const [, [, term_1, ...addterm_1]] = addterm;
                if (term_1[0] === 'mul') {
                    if (term_1[1][0] === 'variable') {
                        syms = [...syms, term_1];
                    } else if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                        con = term_1;
                    }
                }
                syms = [...syms, ...addterm_1.filter(multerm => (multerm[0] === 'mul' && multerm[1][0] === 'variable'))];
                if (syms.length > 0 && con[1] !== '1') {
                    consArr = [...consArr, con];
                }
                break;
            }
            case 'fraction': {
                if (addterm[1][1][0] === 'mulchain') {
                    let con = ['natural', '1'];
                    let syms = [];
                    const [, [, [, ...addterm_2]]] = addterm;
                    addterm_2.forEach(multerm => {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms = [...syms, multerm];
                            } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0') {
                                con = multerm;
                            }
                        }
                    });
                    if (syms.length > 0 && con[1] !== '1') {
                        consArr = [...consArr, con];
                    }
                }
                break;
            }
        }
    });

    // divide each term by the constant coefficients
    if (consArr.length === 0) {
        return addCommutative(tree);
    }
    let [[, con]] = consArr;
    if (consArr.length !== 1) {
        let lcm = consArr[0][1][1];
        const [, ...consArr_rest] = consArr;
        lcm = consArr_rest.reduce(function (a, b) {
                let A = a;
                let B = b[1][1];
                while (B !== 0) {
                    [A, B] = [B, A % B];
                }
                const gcd = A;
                return b[1][1] / gcd;
            },
        lcm)
        con = ['natural', lcm.toString()];
    }

    let newAdd = ['addchain'];
    operand.forEach(addterm => {
        if (addterm[1][0] === 'fraction') {
            if (addterm[1][2][0] !== 'mulchain') {
                addterm[1][2] = ['mulchain', ['mul', addterm[1][2]]];
            }
            const den = [...addterm[1][2], ...consArr];
            newAdd = [...newAdd, [addterm[0], fracSimpInt(['fraction', addterm[1][1], den])]];
        } else {
            newAdd = [...newAdd, [addterm[0], fracSimpInt(['fraction', addterm[1], con])]];
        }
    });
    return addCommutative(['mulchain', ['mul', con], ['mul', newAdd]]);
}
