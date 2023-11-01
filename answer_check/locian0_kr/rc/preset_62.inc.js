import {Laco} from '../libs/common.inc.js';

import {addCommutative} from '../rc/function_47.inc.js';
import {fracExpress} from '../rc/function_48.inc.js';
import {allAssociative} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {powBaseSort} from '../rc/function_111.inc.js';
import {powAddFactoredForm} from '../rc/function_112.inc.js';
import {mulConstCal} from '../rc/function_113.inc.js';
import {mulToNega} from '../rc/function_114.inc.js';
import {sub_mulCommutative} from '../rc/function_126.inc.js';

export function 인수분해꼴(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(fracExpress);
    laco.apply(mulToNega);
    laco.apply(powBaseSort);
    //laco.apply(powAddFactoredForm);
    //laco.apply(addFactoredForm);
    laco.apply(allAssociative);
    laco.apply(sub_mulCommutative);
    //laco.apply(allCommutative);
    laco.apply(addCommutative);
    laco.apply(sub_mulCommutative);
    laco.apply(addFactorNegative);
    laco.apply(mulConstCal);
    tree_1 = laco.finalize();
    

    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '-7x(1+2y)';
var latex_2 = '7x(-1-2y)';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 인수분해꼴(tree_1);
var tree_21 = 인수분해꼴(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/