import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {eqIdentity} from '../rc/function_65.inc.js';
import {ineqIdentity} from '../rc/function_66.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {decElimZero} from '../rc/function_79.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {sub_addFactorNegative} from '../rc/function_130.inc.js';

export function 등식_좌우변경가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(negParenthesis);
    laco.apply(decElimZero);
    laco.apply(fracDecimal);
    laco.apply(fracSeparation);
    laco.apply(fracMfrac);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(addAdjacentSigns);
    laco.apply(eqIdentity);
    laco.apply(ineqIdentity);
    laco.apply(allCommutative);
    laco.apply(allAssociative);
    laco.apply(sub_addFactorNegative);
    tree_1 = laco.finalize();
    

    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'b\neq 2';
var latex_2 = '\\frac{1}{2}\\le b';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 등식_좌우변경가능(tree_1);
var tree_21 = 등식_좌우변경가능(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/