import {Laco} from '../libs/common.inc.js';
import {mulCommutative} from '../rc/function_3.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {addIdentity} from '../rc/function_12.inc.js';
import {mulIdentity} from '../rc/function_13.inc.js';
import {fracIdentity} from '../rc/function_15.inc.js';
import {powIdentity} from '../rc/function_16.inc.js';
import {eqIdentity} from '../rc/function_22.inc.js';
import {ineqIdentity} from '../rc/function_23.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {eqMulProp} from '../rc/function_32.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {mulZero} from '../rc/function_39.inc.js';
import {addAdjacentSigns} from '../rc/function_40.inc.js';
import {decIdentity} from '../rc/function_43.inc.js';
import {mulAllSidesByCommonDenom} from '../rc/function_134.inc.js';


export function standard_form(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(mulCommutative);
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
        //->apply(mulAllSidesByCommonDenom);#jhnam
    laco.apply(eqMulProp);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(mulAllSidesByCommonDenom);//#moved here by ahjin
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracNegative);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    tree_1 = laco.finalize();

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = standard_form;
var latex1 = '2x-3y=4';
var latex2 = '2x=4+3y';
var tree1 = LatexToTree(latex1);
console.log('+++++++++++++');
console.log(JSON.stringify(tree1, null, 4));
console.log('+++++++++++++');
var tree2 = LatexToTree(latex2);
console.log(JSON.stringify(tree2, null, 4));
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree11, null, 4));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree21, null, 4));
*/