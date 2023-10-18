import {Laco} from '../libs/common.inc.js';
import {varReverseShift} from '../rc/function_20.inc.js';


export function test_sunny(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    //tree = tree ?: Laco::parse('\angle{BCAEDF});;
    var laco = new Laco();
    laco.initialize(tree_1)
    laco.apply(varReverseShift, [null, 'angle']);
    tree_1 = laco.finalize();
    
    return tree_1;
}