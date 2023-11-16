import {Laco} from '../libs/common.inc.js';

import {mfracEquiv} from '../rc/function_110.inc.js';
import _ from 'lodash';


export function 대분수_가능(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    //tree_1 = tree_1 ? tree_1 : laco.parse('\mfrac[1]{1}{2}');
    laco.initialize(tree);
    laco.apply(mfracEquiv);
    let tree_1 = laco.finalize();
    

    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\mfrac[1]{1}{2}';
let latex_2 = '\\mfrac[1]{7}{4}';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 대분수_가능(tree_1);
let tree_21 = 대분수_가능(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/