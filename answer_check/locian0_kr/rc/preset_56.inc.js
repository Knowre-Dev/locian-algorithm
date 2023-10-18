import {Laco} from '../libs/common.inc.js';

import {addCommutative} from '../rc/function_47.inc.js';
import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {eqIdentity} from '../rc/function_65.inc.js';
import {ineqIdentity} from '../rc/function_66.inc.js';
import {allAssociative} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {decElimZero} from '../rc/function_79.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';
import {addFactoredFormVar} from '../rc/function_117.inc.js';
import {sub_mulCommutative} from '../rc/function_126.inc.js';
import {sub_addFactorNegative} from '../rc/function_130.inc.js';
import {sub_addFactored} from '../rc/function_162.inc.js';
import {nthrootToSquareroot} from '../rc/function_191.inc.js';

export function 식_간단히(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(ineqIdentity);
    laco.apply(eqIdentity);
    laco.apply(nthrootToSquareroot);
    
    laco.apply(sub_addFactorNegative);
    
    laco.apply(fracDecimal);
    //laco.apply(fracNegative);
    laco.apply(fracExpress);
    
    laco.apply(sub_mulCommutative);
    
    laco.apply(addCommutative);
    
    laco.apply(sub_addFactored); 
    
    laco.apply(fracNegative);
    laco.apply(fracSeparation);       
    laco.apply(addCommutative);        
    laco.apply(fracMfrac);
    laco.apply(fracExpress);
    laco.apply(negParenthesis);
    laco.apply(addAdjacentSigns);
    laco.apply(posiSign);        
    laco.apply(decElimZero);      
    laco.apply(addFactoredFormVar);  
    laco.apply(allAssociative);
    laco.apply(sub_mulCommutative);
    laco.apply(sub_addFactorNegative);  
    laco.apply(sub_addFactored);
    laco.apply(sub_addFactorNegative);  
    laco.apply(fracNegative);
    laco.apply(addFactoredFormVar);  
    laco.apply(addFactoredForm); 
    laco.apply(sub_mulCommutative);           
    tree_1 = laco.finalize();
       
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '6a^3b+12a^2b';
var latex_2 = '6a^2b(a+2)';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 =  식_간단히(tree_1);
var tree_21 =  식_간단히(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/