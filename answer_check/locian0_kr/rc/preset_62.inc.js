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
import _ from 'lodash';


export function 인수분해꼴(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    laco.initialize(tree);
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
    let tree_1 = laco.finalize();
    

    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '-7x(1+2y)';
let latex_2 = '7x(-1-2y)';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 인수분해꼴(tree_1);
let tree_21 = 인수분해꼴(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/