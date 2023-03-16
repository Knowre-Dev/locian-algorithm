import {Laco} from '../libs/common.inc.js';
import {mulAssociative} from '../rc/function_1.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {posiSign} from '../rc/function_8.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {fracIdentity} from '../rc/function_15.inc.js';
import {varReverse} from '../rc/function_21.inc.js';
import {allAssociative, allCommutative, allIdentity, fracSimp} from '../rc/function_24.inc.js';
import {powDecomposition} from '../rc/function_25.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {addFactorNegative} from '../rc/function_38.inc.js';
import {addAdjacentSigns} from '../rc/function_40.inc.js';
import {fracPlusMinus} from '../rc/function_129.inc.js';

export function no_simp_frac(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    //tree_1 = tree_1 ?: Laco.parse('3x+y+0+1a-0+\frac{1}{2}x');;
    var laco = new Laco();
    laco.initialize(tree_1);
    
    laco.apply(allCommutative); 
    
    laco.apply(allIdentity);
    
    laco.apply(varReverse, ['angle', 'mangle', 'arc']);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    
    laco.apply(rdecToFrac);
    
    laco.apply(fracMfrac);
    
    laco.apply(fracDecimal);
    laco.apply(fracSimp);
    
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracNegative);
    laco.apply(fracIdentity);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(allCommutative);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(powDecomposition);
    laco.apply(mulAssociative);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(fracNegative);
    laco.apply(fracPlusMinus);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    tree_1 = laco.finalize();
    
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = no_simp_frac;
var latex1 = '\\frac{12}{10}';
var latex2 = '1\\frac{1}{5}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/