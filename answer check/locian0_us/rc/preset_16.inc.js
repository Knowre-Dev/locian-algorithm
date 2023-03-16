import {Laco} from '../libs/common.inc.js';
import {varReverse} from '../rc/function_21.inc.js';

export function geometry_angle(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(varReverse, [null, 'overline', 'angle', 'mangle', 'arc']);
    tree_1 = laco.finalize();
    
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = geometry_angle;
var latex1 = 'ABC';
var latex2 = 'abc';
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