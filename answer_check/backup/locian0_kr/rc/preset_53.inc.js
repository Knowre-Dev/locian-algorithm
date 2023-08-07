import {Laco} from '../libs/common.inc.js';

import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {decElimZero} from '../rc/function_79.inc.js';

function 소수만가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    //tree_1 = tree_1 ? tree_1 : laco.parse('\frac{3}{2}x');
    
    /* KR Test */
    laco.initialize(tree_1);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(decElimZero);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    tree_1 = laco.finalize();
    

    return tree_1;
}

    /*tree_1 = laco.initialize(tree_1);
        laco.apply(allIdentity);
        laco.apply(decIdentity);
        laco.apply(decElimZero);
        laco.finalize();
       */



/*        
import {LatexToTree} from '../checkmath.js';
var latex_1 = '42.0';
var latex_2 = '42';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 =  소수만가능(tree_1);
var tree_21 =  소수만가능(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/