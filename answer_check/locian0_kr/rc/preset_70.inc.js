import {Laco} from '../libs/common.inc.js';

import {setAssociative} from '../rc/function_166.inc.js';
import {setCommutative} from '../rc/function_167.inc.js';
import _ from 'lodash';

export function 집합연산_가능(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    laco.initialize(tree);
    laco.apply(setAssociative);
    laco.apply(setCommutative);       
    let tree_1 = laco.finalize();
    

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
let latex_1 = 'A^C';
let latex_2 = 'A^c';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 집합연산_가능(tree_1);
let tree_21 = 집합연산_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/