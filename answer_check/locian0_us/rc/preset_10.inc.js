import {Laco} from '../libs/common.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {posiSign} from '../rc/function_8.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {allAssociative, allCommutative, allIdentity} from '../rc/function_24.inc.js';
import {powDecomposition} from '../rc/function_25.inc.js';
import {fracComplex} from '../rc/function_26.inc.js';
import {addFactoredForm} from '../rc/function_27.inc.js';
import {addNegative} from '../rc/function_28.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {decElimZero} from '../rc/function_36.inc.js';
import {addPolyZero} from '../rc/function_37.inc.js';
import {addFactorNegative} from '../rc/function_38.inc.js';


export function jjee(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    //tree = tree ?: Laco::parse('2+y-3x);;
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(allIdentity);
    laco.apply(rdecToFrac);
    laco.apply(fracComplex);
    laco.apply(allCommutative);
    laco.apply(fracSeparation);
    laco.apply(allCommutative);
    laco.apply(fracMfrac);
    laco.apply(posiSign);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(fracNegative);
    laco.apply(powDecomposition);
    laco.apply(addNegative);
    laco.apply(allAssociative);
    laco.apply(addPolyZero);
    laco.apply(addFactoredForm);
    laco.apply(addFactorNegative);
    laco.apply(allCommutative);
    laco.apply(fracDecimal);
    laco.apply(fracExpress);
    laco.apply(decElimZero);
    tree_1 = laco.finalize();

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = jjee;
var latex1 = '0x+3';
var latex2 = '3';
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