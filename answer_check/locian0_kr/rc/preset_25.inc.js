import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {varReverse} from '../rc/function_64.inc.js';
import {allIdentity, allCommutative, allAssociative} from '../rc/function_67.inc.js';
import {powDecomposition} from '../rc/function_68.inc.js';
import {eqMulNeg} from '../rc/function_73.inc.js';
import {rdecToFrac} from '../rc/function_78.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';

export function test_larwein(tree =  null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    tree_1 = tree_1 ? tree_1 : laco.parse('3,200x+6,400,123y-m\angle{30}');
    
    laco.initialize(tree_1);
    laco.apply(allIdentity);
    laco.apply(varReverse, ['angle']);
    laco.apply(varReverse, ['mangle']);
    laco.apply(varReverse, ['arc']);
    laco.apply(allCommutative);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(powDecomposition);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    tree_1 = laco.finalize();
       
    
    return tree_1;
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = 'y\ge x+2';
var latex_2 = '2y=4x';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = test_larwein(tree_1);
var tree_21 = test_larwein(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/