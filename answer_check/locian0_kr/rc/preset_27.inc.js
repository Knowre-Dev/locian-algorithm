import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {allAssociative, allCommutative, allIdentity} from '../rc/function_67.inc.js';
import {powDecomposition} from '../rc/function_68.inc.js';
import {fracComplex} from '../rc/function_69.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {addNegative} from '../rc/function_71.inc.js';
import {eqMulNeg} from '../rc/function_73.inc.js';
import {rdecToFrac} from '../rc/function_78.inc.js';
import {decElimZero} from '../rc/function_79.inc.js';
import {addPolyZero} from '../rc/function_80.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';


export function jjee(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    tree_1 = tree_1 ? tree_1 : laco.parse('2+y-3x');
    
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