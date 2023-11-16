import {Laco} from '../libs/common.inc.js';

import {varReverse} from '../rc/function_64.inc.js';
import _ from 'lodash';


export function geometry_angle(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    laco.initialize(tree);
    laco.apply(varReverse);
    let tree_1 = laco.finalize();
       
    
    return tree_1;
}