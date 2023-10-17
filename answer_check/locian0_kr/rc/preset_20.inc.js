import {Laco} from '../libs/common.inc.js';

import {addAssociative} from '../rc/function_45.inc.js';
import {mulCommutative} from '../rc/function_46.inc.js';
import {addCommutative} from '../rc/function_47.inc.js';
import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {addIdentity} from '../rc/function_55.inc.js';
import {mulIdentity} from '../rc/function_56.inc.js';
import {divIdentity} from '../rc/function_57.inc.js';
import {fracIdentity} from '../rc/function_58.inc.js';
import {powIdentity} from '../rc/function_59.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {decIdentity} from '../rc/function_86.inc.js';
import {mulAssociative} from '../rc/function_157.inc.js';



export function no_simp_frac(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco()
    tree_1 = tree_1 ? tree_1 : laco.parse('3x-y+0+1a-0+\frac{1}{2}x');

    laco.initialize(tree_1);
    laco.apply(addIdentity);
    laco.apply(mulIdentity);
    laco.apply(divIdentity);
    laco.apply(fracIdentity);
    laco.apply(powIdentity);
    laco.apply(decIdentity);
    laco.apply(mulCommutative);
    laco.apply(addCommutative);
    laco.apply(fracSeparation);
    laco.apply(fracMfrac);
    laco.apply(posiSign);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(mulAssociative);
    laco.apply(addAssociative);
    laco.apply(mulCommutative);
    laco.apply(addCommutative);
    laco.apply(fracDecimal);
    laco.apply(fracExpress);
    laco.apply(fracSimpInt);
    tree_1 = laco.finalize();
    
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '0.5x';
var latex_2 = '\\frac{1}{2}x';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = no_simp_frac(tree_1);
var tree_21 = no_simp_frac(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/
