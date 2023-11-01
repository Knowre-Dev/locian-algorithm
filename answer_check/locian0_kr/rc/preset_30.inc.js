import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracIdentity} from '../rc/function_58.inc.js';
import {powIdentity} from '../rc/function_59.inc.js';
import {rdecToFrac} from '../rc/function_78.inc.js';
import {addPolyZero} from '../rc/function_80.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {decIdentity} from '../rc/function_86.inc.js';

export function poly_division(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(fracIdentity);
    laco.apply(powIdentity);
    laco.apply(decIdentity);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(negParenthesis);
    laco.apply(addPolyZero);
    tree_1 = laco.finalize();
       
    
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '(x^2-x)';
var latex_2 = 'x(x-1)';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 =  poly_division(tree_1);
var tree_21 =  poly_division(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/