import { Laco } from '../libs/common.inc.js';
/*
    160918 jhshin - expanding a new type of tree : anything
*/

import { fracExpress } from '../rc/function_48.inc.js';
import { fracDecimal } from '../rc/function_49.inc.js';
import { negParenthesis } from '../rc/function_50.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { ineqIdentity } from '../rc/function_66.inc.js';
import { allAssociative, allCommutative } from '../rc/function_67.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';
import { intervalSetNot } from '../rc/function_84.inc.js';
import { ineqSetNot } from '../rc/function_85.inc.js';
import { decIdentity } from '../rc/function_86.inc.js';

export function set_bounds(tree = null, variable = ['anything', 'x']) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(decIdentity);
    laco.apply(ineqIdentity);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(allCommutative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(ineqSetNot, variable)
    laco.apply(intervalSetNot, variable)
    laco.apply(ineqIdentity);
    return laco.finalize();
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'AB';
let latex_2 = 'BA';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 =  set_bounds(tree_1);
let tree_21 =  set_bounds(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
