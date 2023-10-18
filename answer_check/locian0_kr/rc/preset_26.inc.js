import {Laco} from '../libs/common.inc.js';

import {varReverseShift} from '../rc/function_63.inc.js';

export function test_sunny(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    tree_1 = tree_1 ? tree_1 : laco.parse('\\angle{BCAEDF}');
    
    laco.initialize(tree_1);
    laco.apply(varReverseShift, [null, 'angle']);
    tree_1 = laco.finalize();
    
    
    return tree_1;
}