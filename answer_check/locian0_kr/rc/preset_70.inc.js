import {Laco} from '../libs/common.inc.js';

import {setAssociative} from '../rc/function_166.inc.js';
import {setCommutative} from '../rc/function_167.inc.js';

export function 집합연산_가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(setAssociative);
    laco.apply(setCommutative);       
    tree_1 = laco.finalize();
    

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var latex_1 = 'A^C';
var latex_2 = 'A^c';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 집합연산_가능(tree_1);
var tree_21 = 집합연산_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/