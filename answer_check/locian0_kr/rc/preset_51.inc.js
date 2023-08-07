import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';

function 분수와소수(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    //tree_1 = tree_1 ? tree_1 : laco.parse('\frac{3}{2}x');
    
    /* KR Test */
    
    laco.initialize(tree_1);
    //laco.apply(allIdentity);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(fracDecimal);
    laco.apply(fracMfrac);
    laco.apply(fracSimpVar);
    laco.apply(fracSimpInt);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    tree_1 = laco.finalize();
       
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'x';
var latex_2 = 'x';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 =  분수와소수(tree_1);
var tree_21 =  분수와소수(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/