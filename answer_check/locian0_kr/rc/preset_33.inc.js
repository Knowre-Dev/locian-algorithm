import {Laco} from '../libs/common.inc.js';

import {varReverse} from '../rc/function_64.inc.js';

function geometry_angle(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(varReverse);
    tree_1 = laco.finalize();
       
    
    return tree_1;
}