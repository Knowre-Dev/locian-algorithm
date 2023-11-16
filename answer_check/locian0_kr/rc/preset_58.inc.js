import {Laco} from '../libs/common.inc.js';

import {addCommutative} from '../rc/function_47.inc.js';
import {fracExpress} from '../rc/function_48.inc.js';
import {fracDecimal} from '../rc/function_49.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {decElimZero} from '../rc/function_79.inc.js';
import {addFactoredFormVar} from '../rc/function_117.inc.js';
import {sub_mulCommutative} from '../rc/function_126.inc.js';
import {nthrootToSquareroot} from '../rc/function_191.inc.js';
import _ from 'lodash';


export function 기약분수_소수_가능(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    //   tree_1 = $tree ?: laco.parse('x(yz-y)');
    
    laco.initialize(tree);
    laco.apply(nthrootToSquareroot);
    laco.apply(decElimZero);   //소수점 밑 0 생략
    laco.apply(fracDecimal);    // 소수 -> 분수
    laco.apply(fracExpress);    // 곱셈식 -> 분수 
    laco.apply(fracSeparation);      //분자가 덧셈일 경우 덧셈식으로 변환
    laco.apply(fracNegative);  //분자 또는 분모가 negative일 경우 negative로 바꿔줌
    laco.apply(fracMfrac); //대분수 -> 가분수
    laco.apply(fracExpress);    // 곱셈식 -> 분수 
    laco.apply(negParenthesis); //음수에 괄호가 씌워졌을 때 괄호 벗겨줌
    laco.apply(posiSign);   // 양수기호 생략
    laco.apply(addFactoredFormVar);  //문자로 묶어줌
    laco.apply(decElimZero);       // 소수점 밑 0 생략
    laco.apply(allAssociative); //결합법칙
    laco.apply(allCommutative);
    laco.apply(addCommutative); //덧셈 교환법칙 
    laco.apply(sub_mulCommutative); //곱셈 교환법칙
    laco.apply(addFactoredForm); //공통 숫자로 묶어냄
    let tree_1 = laco.finalize();

       

    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{50\\pi }{3}-25\\sqrt{3}';
let latex_2 = '\\frac{100\\pi -150\\sqrt{3}}{6}';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 기약분수_소수_가능(tree_1);
let tree_21 = 기약분수_소수_가능(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/