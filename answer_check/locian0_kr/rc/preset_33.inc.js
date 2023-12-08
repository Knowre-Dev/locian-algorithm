import { Laco } from '../libs/common.inc.js';

import { varReverse } from '../rc/function_64.inc.js';

export function geometry_angle(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(varReverse);
    return laco.finalize();
}
