import {Laco} from '../libs/common.inc.js';
import {addIdentity} from '../rc/function_55.inc.js';
import {mulIdentity} from '../rc/function_56.inc.js';
import {divIdentity} from '../rc/function_57.inc.js';
import {fracIdentity} from '../rc/function_58.inc.js';
import {powIdentity} from '../rc/function_59.inc.js';
import {eqIdentity} from '../rc/function_65.inc.js';
import {ineqIdentity} from '../rc/function_66.inc.js';
import {mulZero} from '../rc/function_82.inc.js';
import {decIdentity} from '../rc/function_86.inc.js';
import _ from 'lodash';

export function allIdentity(tree) {
    
    let laco = new Laco();
    laco = laco.getInstance();
    laco = laco.setTree(tree);
    laco = laco.apply(mulZero);
    laco = laco.apply(addIdentity);
    laco = laco.apply(mulIdentity);
    laco = laco.apply(divIdentity);
    laco = laco.apply(fracIdentity);
    laco = laco.apply(powIdentity);
    laco = laco.apply(decIdentity);
    laco = laco.apply(ineqIdentity);        
    laco = laco.apply(eqIdentity);
    return laco.getTree();
    
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = 'c<b<a';
let tree_1 = LatexToTree(latex_1)
console.log(JSON.stringify(tree_1, null, 4));
let tree_11 = allIdentity(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/

import {mulCommutative} from '../rc/function_46.inc.js';
import {addCommutative} from '../rc/function_47.inc.js';

export function allCommutative(tree) {
    
    let laco = new Laco();
    laco = laco.getInstance();
    laco = laco.setTree(tree);
    laco = laco.apply(addCommutative);
    laco = laco.apply(mulCommutative);
    return laco.getTree();
    
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = 'a\/b*c';
let tree_1 = LatexToTree(latex_1)
console.log(JSON.stringify(tree_1, null, 4));
let tree_11 = allCommutative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/


import {곱셈결합법칙} from '../rc/function_44.inc.js';
import {addAssociative} from '../rc/function_45.inc.js';

export function allAssociative(tree) {
    
    let laco = new Laco();
    laco = laco.getInstance();
    laco = laco.setTree(tree);
    laco = laco.apply(addAssociative);
    laco = laco.apply(곱셈결합법칙);
    return laco.getTree();
}

/*

*/

import {fracSimpInt} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';

export function fracSimp(tree) {
    
    let laco = new Laco();
    laco = laco.getInstance();
    laco = laco.setTree(tree);
    laco = laco.apply(fracSimpInt);
    laco = laco.apply(fracSimpVar);
    return laco.getTree();

}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = 'a\/b*c';
let tree_1 = LatexToTree(latex_1)
console.log(JSON.stringify(tree_1, null, 4));
let tree_11 = allCommutative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/



