import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimpInt, EuclidAlg } from '../rc/function_76.inc.js';

export function addFactor(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'addchain') {
        // extract all constant coefficents (not in denominator)
        const [, ...operand] = tree;
        let consArr = [];
        operand.forEach(addterm => {
            switch (addterm[1][0]) {
                case 'mulchain': {
                    let con = ['natural', '1'];
                    let syms = [];
                    const [, [, term_1, ...addterm_2]] = addterm;
                    if (term_1[0] === 'mul') {
                        if (term_1[1][0] === 'variable') {
                            syms = [...syms, term_1];
                        } else if (term_1[1][0] === 'natural' && term_1[1][1] !== '0') {
                            con = term_1;
                        }
                    }
                    addterm_2.forEach(multerm => {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms = [...syms, multerm];
                            }
                        }
                    });
                    if (syms.length > 0 && con[1] !== '1') {
                        consArr = [...consArr, con];
                    }
                    break;
                }
                case 'fraction': {
                    if (addterm[1][1][0] === 'mulchain') {
                        let con = ['natural', '1'];
                        let syms = [];
                        const [, ...addterm_11] = addterm[1][1];
                        addterm_11.forEach(multerm => {
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
        if (consArr.length !== 0) {
            let con = consArr[0][1];
            if (consArr.length !== 1) {
                let lcm = parseInt(consArr[0][1][1]);
                consArr.forEach(term => {
                    lcm *= parseInt(term[1][1]) / EuclidAlg(lcm, parseInt(term[1][1]));
                });
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
        return addCommutative([operator, ...operand]);
    }
    return addCommutative(tree);
}
