import {Laco} from '../libs/common.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {posiSign} from '../rc/function_8.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {varReverse} from '../rc/function_21.inc.js';
import {allAssociative, allCommutative, allIdentity}from '../rc/function_24.inc.js';
import {powDecomposition} from '../rc/function_25.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {addFactorNegative} from '../rc/function_38.inc.js';

export function test_larwein(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    //tree = tree ?: Laco::parse('3,200x+6,400,123y-m\angle{30});;
    var laco = new Laco();
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
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = test_larwein;
var latex1 = '\\sin{A}\\cos30\\tan(30+x)';
var latex2 = '\\sin   A\\cos{30}\\tan{(30+x)}';
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