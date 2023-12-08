import { addCommutative } from '../rc/function_47.inc.js';
import { fracSimp } from '../rc/function_67.inc.js';
import { fracSimpInt, EuclidAlg } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';

export function addFactor_1(tree = null) {
    const simple1 = fracSimp(tree);
    const simple2 = fracSimpVar(tree);

    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (JSON.stringify(tree) !== JSON.stringify(simple1) || JSON.stringify(tree) !== JSON.stringify(simple2)) {
        return tree;
    }

    const operator = tree[0];
    // let power = false;
    if (operator === 'addchain') {
        const tree_1 = tree.slice(1);
        let power = false;
        const consArr = [];
        let con = [];
        let syms = [];
        for (const addterm of tree_1) {
            if (addterm[1][0] === 'mulchain') {
                con = ['natural', '1'];
                syms = [];
                const addterm_1 = addterm[1].slice(1);
                const addterm_1_entries = addterm_1.entries();
                for (const [km, multerm] of addterm_1_entries) {
                    if (multerm[0] === 'mul') {
                        if (multerm[1][0] === 'variable') {
                            syms.push(multerm);
                        } else if (multerm[1][0] === 'squareroot') {
                            syms.push(multerm);
                        } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0' && km === 0) {
                            con = multerm;
                        } else if (multerm[1][0] === 'power' && multerm[1][1][0] === 'variable') {
                            syms.push(multerm);
                        }
                    }
                }
                if (syms.length > 0 && con[1] !== '1') {
                    consArr.push(con);
                }
            } else if (addterm[1][0] === 'fraction') {
                if (addterm[1][1][0] === 'mulchain') {
                    con = ['natural', '1'];
                    syms = [];
                    const addterm_11 = addterm[1][1].slice(1);
                    for (const multerm of addterm_11) {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'squareroot') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0') {
                                con = multerm;
                            }
                        }
                    }
                } else if (addterm[1][1][0] === 'natural' && addterm[1][1][1] !== '1') {
                    con = addterm[1];
                }

                if (syms.length > 0 && con[1] !== '1') {
                    consArr.push(con);
                }
            } else if (addterm[1][0] === 'natural' && addterm[1][1] !== '1') {
                con = addterm;
                consArr.push(con);
            } else if (addterm[1][0] === 'power') {
                power = true;
            }
        }
        const consArr_length = consArr.length;
        if (consArr_length !== 0) {
            if (consArr_length === 1) {
                con = ['natural', '1'];
            } else {
                if (power === true) {
                    con = ['natural', '1'];
                } else {
                    let gcd = parseInt(consArr[0][1][1]);
                    for (const term of consArr) {
                        gcd = EuclidAlg(gcd, parseInt(term[1][1]));
                    }
                    con = ['natural', gcd.toString()];
                }
            }
            if (con[1] === '1') {
                return addCommutative(tree);// newOperand = tree_1;
            }
            const newAdd = ['addchain'];
            for (const addterm of tree_1) {
                if (addterm[1][0] === 'fraction') {
                    if (addterm[1][2][0] !== 'mulchain') {
                        addterm[1][2] = ['mulchain', ['mul', addterm[1][2]]];
                    }
                    newAdd.push([addterm[0], fracSimpInt(['fraction', addterm[1][1], addterm[1][2].concat([['mul', con]])])]);
                } else {
                    newAdd.push([addterm[0], fracSimpInt(['fraction', addterm[1], con])]);
                }
            }
            return addCommutative(['mulchain', ['mul', con], ['mul', newAdd]]);
        }
        return addCommutative(tree);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];

    for (const v of tree_1) {
        newOperand.push(v);
    }
    return addCommutative([operator].concat(newOperand));
}
