import {Laco} from '../libs/common.inc.js';

import {mulCommutative} from '../rc/function_46.inc.js';
import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {addIdentity} from '../rc/function_55.inc.js';
import {mulIdentity} from '../rc/function_56.inc.js';
import {fracIdentity} from '../rc/function_58.inc.js';
import {powIdentity} from '../rc/function_59.inc.js';
import {eqIdentity} from '../rc/function_65.inc.js';
import {ineqIdentity} from '../rc/function_66.inc.js';
import {eqMulNeg} from '../rc/function_73.inc.js';
import {rdecToFrac} from '../rc/function_78.inc.js';
import {mulZero} from '../rc/function_82.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {decIdentity} from '../rc/function_86.inc.js';
import _ from 'lodash';


export function standard_form(tree = null) {
    
    let laco = new Laco();
    laco.initialize(tree);
    laco.apply(eqIdentity);
    laco.apply(ineqIdentity);
    laco.apply(mulZero);
    laco.apply(addIdentity);
    laco.apply(mulIdentity);
    laco.apply(fracIdentity);
    laco.apply(powIdentity);
    laco.apply(decIdentity);
    laco.apply(mulCommutative);
    laco.apply(eqMulNeg); // needs the commutative property?
    //laco.apply(eqMulProp);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    return laco.finalize();
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '8';
let latex_2 = '2\\times 2\\times 2';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = standard_form(tree_1);
let tree_21 = standard_form(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/