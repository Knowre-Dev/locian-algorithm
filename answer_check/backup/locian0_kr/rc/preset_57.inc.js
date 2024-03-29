import {Laco} from '../libs/common.inc.js';

import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {addFactoredFormVar} from '../rc/function_117.inc.js';

function 기약분수만_가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);    
    laco.apply(negParenthesis);
    laco.apply(posiSign);
    laco.apply(addAdjacentSigns);
    laco.apply(fracMfrac);
    laco.apply(fracSeparation);
    laco.apply(fracNegative);
    laco.apply(addFactoredForm);
    laco.apply(addFactorNegative);        
    laco.apply(addFactoredFormVar);
    laco.apply(allCommutative);
    laco.apply(allAssociative);
    tree_1 = laco.finalize();
       
    



    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '0';
var latex_2 = '1';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 기약분수만_가능(tree_1);
var tree_21 = 기약분수만_가능(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/