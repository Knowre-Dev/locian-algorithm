import {Laco} from '../libs/common.inc.js';
import {divFrac} from '../rc/function_115.inc.js';


export function same(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1)
    laco.apply(divFrac);
    tree_1 = laco.finalize();

    
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = divFrac;
var latex1 = 'xy';
var latex2 = 'yx';
var tree1 = LatexToTree(latex1);
console.log(JSON.stringify(tree1, null, 4));
var tree2 = LatexToTree(latex2);
console.log(JSON.stringify(tree2, null, 4));
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/