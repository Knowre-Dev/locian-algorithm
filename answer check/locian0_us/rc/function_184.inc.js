

//arrangeSingle_decimalMarker
//searchTypeInMathtree
//relationEqeq
//simplifiedEqui
//Cart2D_evaluateEx
//Cart2D_evaluateExWithSeed
//Cart2D_evaluateVariable
//Cart2D_utf8_ord
//Cart2D_evaluateOperation
//Cart2D_compTree
export function Cart2D_organizeMathTree(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    // in Cartesian2D, we use option below
    var option = ["single", "eqeq", "simp", "simp", "0"];
    
    // copy and paste from checkmath.php
    
    option = option.slice(1, 4);
    // step1: organizeMathTree_arrangeSingle
    option = option.slice(1);
    tree_1 = arrangeSingle_decimalMarker(tree_1);
    //print_r(tree);
    //echo ("<br />");  echo ("<br />");
    
    // step2: organizeMathTree_relationEqeq
    var result = relationEqeq(tree_1, option);

    return result;
}

export function arrangeSingle_decimalMarker(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var array1 = searchTypeInMathtree(tree_1, 'array'); 
    var array2 = searchTypeInMathtree(tree_1, 'tuple'); 
    var array = array1.concat(array2);
    for (var obj of array) {
        var flag_change = true;
        var newObj = '';
        var obj_1 = obj.slice(1);
        for (var [k, block] of obj_1.entries()) {
            if (block[0] === 'natural') {
                if (k === 0 && strlen(block[1]) < 4) {
                    newObj += block[1];
                } else if (block[1].length === 3) {
                    newObj += block[1];
                } else { 
                    flag_change = false;
                    break;
                }
            } else {
                flag_change = false;
                break;
            }
        }
        if (flag_change) {
            tree = replace(tree, obj, ['natural', newObj]);
        }
    }
    return tree;
}

export function searchTypeInMathtree(tree, type, option = 'all', overlap = false, self = true) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var type_1 = JSON.parse(JSON.stringify(tupe));
    if (!Array.isArray(tree_1)) {
        return [];
    }

    var operator = tree_1[0];
    var operand = tree_1.slice(1);

    if (!Array.isArray(type_1)) {
        type_1 = array(type_1);
    }

    var result = [];
    if (self === true && type_1.includes(operator)) {
        switch(option) {
            case 'out':
                result.push(tree_1);
                break;

            case 'in':
                var temp = [];
                for (var subTree of operand)
                    temp = result.concat(searchTypeInMathtree(subTree, type_1, option, overlap, true));
                if (temp.length === 0) {
                    result.push(tree_1);
                } else {
                    result = temp;
                }
                break;

            case 'all':
                result.push(tree_1);
                for (var subTree of operand)
                    result = result.concat(searchTypeInMathtree(subTree, type_1, option, overlap, true));
                break;

            default:
                result = false;
                break;
        }
    } else {
        for (var subtRee of operand)
            result = result.concat(searchTypeInMathtree(subTree, type_1, option, overlap, true));
    }

    if (overlap === false) {
        var temp = [];
        for (var v of result) {
            if (temp.includes(v)) {

            } else {
                temp.push(v);
            }
        }
        result = temp;
    }
    return result;
}

export function relationEqeq(tree, option) {//postpone
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var newTree;
    switch (tree_1[0]) {
        case 'equation':
            newTree = [
                'equation',
                [
                    'addchain',
                    ['add', tree_1[1]],
                    ['sub', tree_1[2]]
                ],
                ['natural', 0]
            ];
            break;

        case 'inequality':
            if (tree_1[2] === 'gt' || tree_1[2] === 'ge') {
                newTree = [
                    'inequality',
                    [
                        'addchain',
                        ['add', tree_1[1]],
                        ['sub', tree_1[3]]
                    ],
                    tree_1[2],
                    ['natural', 0]
                ];
            } else {
                newTree = [
                    'inequality',
                    [
                        'addchain',
                        ['add', tree_1[3]],
                        ['sub', tree_1[1]]
                    ],
                    tree_1[2] ==='lt' ? 'gt' : 'ge',
                    ['natural', 0]
                ];
            }
            break;

        default:
            return simplifiedEqui(tree,null);
    }

    var evaluated = Cart2D_evaluateEx(newTree);
    //evaluated = evaluateEx_new(newTree);
    var head = evaluated[1][1];
    evaluated = evaluated.slice(1);
    if (head[0] < 0) {
        for (var [k, v] of evaluated.entries()) {
            switch(v[2]) {
                case 'gt':
                    evaluated[k][2] = 'lt';
                    break;
                
                case 'ge':
                    evaluated[k][2] = 'le';
                    break;
                
                case 'lt':
                    evaluated[k][2] = 'gt';
                    break;
                
                case 'le':
                    evaluated[k][2] = 'ge';
                    break;
                
                default:
                    break;
            }
        }
    }
    var newEval = [];
    for (var [k, v] of evaluated.entries()) {
        var eq = v;
        //lhs = array('fraction',eq[1],head);
       var lhs = [
            (eq[1][0] * head[0] + eq[1][1] * head[1]) / (head[0] * head[0] + head[1] * head[1]),
            (eq[1][1] * head[0] - eq[1][0] * head[1]) / (head[0] * head[0] + head[1] * head[1])
        ];
        
        eq[1] = ['eval', lhs];
        newEval.push(eq);
    }
    return newEval;
}

export function simplifiedEqui(tree, option) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var result = Cart2D_evaluateEx(tree_1);
    if (result) {
        return result;
    } else {
        return false;
    }
}

export function Cart2D_evaluateEx(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    switch (tree_1[0]) {
        // 160828 larwein - inequality patch
        case 'inequality':
        if (tree_1[2] === 'gt' || tree_1[2] === 'ge')
        {
            newTree = array(
                'inequality',
                Cart2D_evaluateEx(array(
                    'addchain',
                    array('add',tree[1]),
                    array('sub',tree[3])
                )),
                tree_1[2],
                array('natural',0)
            );
        } else {
            newTree = [
                'inequality',
                Cart2D_evaluateEx([
                    'addchain',
                    ['add', tree_1[3]],
                    ['sub', tree_1[1]]
                ]),
                tree_1[2]==='lt' ? 'gt' : 'ge',
                ['natural', 0]
            ];
        }
        break;

        default:
        newTree = ['eval'];
        newTree.push(Cart2D_evaluateExWithSeed(tree, -2));
        newTree.push(Cart2D_evaluateExWithSeed(tree, -1));
        newTree.push(Cart2D_evaluateExWithSeed(tree, 1));
        newTree.push(Cart2D_evaluateExWithSeed(tree, 2));
        newTree.push(Cart2D_evaluateExWithSeed(tree, 3));
    }

    return newTree;
}

export function Cart2D_evaluateExWithSeed(A, seed = 1) {
    var A_1 = JSON.parse(JSON.stringify(A));
    if (!Array.isArray(A_1)) { 
        return A_1;
    }
    
    var operator = A_1[0];
    var operandTree = A_1.slice(1);
    
    if (operator === 'summation') {
        return Cart2D_evaluateOperation(operator,operandTree,seed);
    }
    var operand = [];
    for (var each of operandTree) {
        operand.push(Cart2D_evaluateExWithSeed(each, seed));
    }
    switch(operator) {
        case 'variable':
            if (operand.length === 1) {
                return Cart2D_evaluateVariable(operand[0], seed);
            } else {
                return Cart2D_evaluateVariable(operand,seed);
            }

        case 'overline':
        case 'overleftarrow':
        case 'overrightarrow':
        case 'overleftrightarrow':
        case 'widearc':
        case 'arc':
        case 'mangle':
        case 'angle':
        case 'sine':
        case 'cosine':
        case 'tangent':
            return operand[0];

        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain':
            var result = [operator];
            for (var v of operand) {
                result.push(v);
            }
            return result;

        default:
            return Cart2D_evaluateOperation(operator,operand);
    }
}



export function Cart2D_evaluateVariable(variable, seed) {
    // variable with several alphabets. e.g. ABC
    var variable_1 = JSON.parse(JSON.stringify(variable));
    if (Array.isArray(variable_1)) {
        var re = 0;
        var im = 0;
        for (var [k, v] of variable_1.entries()) {
            if (k>2) {
                break;
            }
            var val = Cart2D_evaluateVariable(v, seed);
            re = re + ((-2.2 + k) * val[0]);
            im = im + ((1.3 - k) * val[1]);
        }
        return [re, im];
    }
    // imaginary unit 'i'
    if (variable_1 ==='i') {
        return [0, 1];
    }
    
    // single (english, korean, and greek) alphabet

    var primes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 
        31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
        73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 
        127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 
        179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 
        233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 
        283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 
        353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 
        419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 
        547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 
        607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 
        661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 
        739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 
        811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 
        877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 
        947, 953, 967, 971, 977, 983, 991, 997   
    ];
    ///*
    //regex1 = "/^([a-zA-Z])([']*)/";
    var regex = new RegExp(
        "^(ㄱ|ㄴ|ㄷ|ㄹ|ㅁ|ㅂ|ㅅ|ㅈ|ㅊ|ㅋ|ㅌ|ㅍ|ㅎ|[a-zA-Z]*)([']*)",
        'g');
    switch (variable_1) {
        case 'pi':
            variable_1 = "ㄱ'";
            break;

        case 'theta':
            variable_1 = "ㄴ'";
            break;
    }
    var match = match_all(variable_1, regex);
    variable_1 = match[1][0];
    var shoulder = match[2][0].length;

    var ord = variable_1.charCodeAt(0);
    var num;
    if (ord < 128)  {
        num = ord - 64;
    } else {
        num = Cart2D_utf8_ord(variable);
        switch(num) {
            case 952:
                num = 70;
                break;

            case 960:
                num = 71;
                break;

            default :
                num = num - 12493;
        }
    }
    //*/
    if (seed === 2 || seed === -2) {
        num = primes.length - num;
    }
    result = num + Math.sqrt(2 * (primes[num]));

    if (seed < 0) {
        result = -result;
    }
    if (seed === 3 || seed === -3) {
        result = 1 / result;
    }
    if (shoulder > 0) {
        return [result / shoulder, result - primes[shoulder]];
    } else {
        return [result, result / num];
    }
}

export function Cart2D_utf8_ord(ch) {
    var len = ch.length;
    if (len <= 0) { 
        return false;
    }
    var h = ch[0].charCodeAt(0);
    if (h <= 0x7F) { 
        return h;
    }
    if (h < 0xC2) { 
        return false;
    }
    if (h <= 0xDF && len>1) {
        return (h & 0x1F) <<  6 | (ch[0].charCodeAt(0) & 0x3F);
    }
    if (h <= 0xEF && len>2) 
        return (h & 0x0F) << 12 | (ch[1].charCodeAt(0) & 0x3F) << 6 | (ch[2].charCodeAt(0) & 0x3F);          
    if (h <= 0xF4 && len>3) 
        return (h & 0x0F) << 18 | (ord(ch[1]) & 0x3F) << 12 | (ch[2].charCodeAt(0) & 0x3F) << 6 | (ch[3].charCodeAt(0) & 0x3F);
    return false;
}

/*
Routine mostly copied from checkmath.php

Values are represented in complex number format
(array of two numbers [real, imaginary])
*/
export function Cart2D_evaluateOperation(operator, operand, seed = null) {
    var operand_1 = JSON.parse(JSON.stringify(operand));
    switch(operator) {
        case 'natural':
        case 'decimal':
            return [parseFloat(operand_1[0]), 0];
        
        case 'positive':
        case 'add':
        case 'mul':
            return operand_1[0];
        
        case 'pm':
        case 'addsub':
            return [0.8 * operand_1[0][0], 1.2 * operand_1[0][1]];
        
        case 'negative':
        case 'sub':
            // ...what case would below be??
            if (Array.isArray(operand_1[0][0]) || Array.isArray(operand_1[0][1])) {
                return [0, 0];
            }
            return [-operand_1[0][0], -operand_1[0][1]];
        
        case 'addchain':
            var sum = [0, 0];
            for (var term of operand) {
                sum[0] += (!isNaN(term[0]) ? term[0] : 0);
                sum[1] += (!isNaN(term[1]) ? term[1] : 0);
                // if newRe == sum[0] and yet term[0] > 0, then floating point rounding error
            }
            return sum;
        
        case 'div':
            // division by a complex number z is equivalent to
            // multiplication by its complex conjugate z* divided by its modulus squared
            var modulusSq = operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1];
            return [operand_1[0][0] / modulusSq, -operand_1[0][1] / modulusSq];
        
        case 'mulchain':
            var prod = [1, 0];
            // Complex number multiplication
            // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
            for (var factor of operand_1) {
                var temp = prod;
                prod[0] = temp[0] * factor[0] - temp[1] * factor[1];
                prod[1] = temp[0] * factor[1] + temp[1] * factor[0];
            }
            return prod;
        
        case 'fraction':
            if (isNaN(operand_1[0][0]) ||
                isNaN(operand_1[0][1]) ||
                isNaN(operand_1[1][0]) ||
                isNaN(operand_1[1][1])) {
                return [1, 1];
            }
            var numerRe = operand_1[0][0];
            var numerIm = operand_1[0][1];
            var denomRe = operand_1[1][0];
            var denomIm = operand_1[1][1];
            var modulusSqDenom = denomRe * denomRe + denomIm * denomIm;
            return [
                (numerRe * denomRe + numerIm * denomIm) / modulusSqDenom,
                (numerIm * denomRe - numerRe * denomIm) / modulusSqDenom
            ];
        
        case 'mfraction': // only real entries assumed
            return [operand_1[0][0] + operand_1[1][0] / operand_1[2][0], 0];
        
        case 'power':
            return Cart2D_powComplex(operand_1[0], operand_1[1]);
        
        case 'squareroot':
            return Cart2D_powComplex(operand_1[0], [0.5, 0]);
        
        case 'nthroot':
            // For a complex number z, we have 1/z = z*/|z|^2,
            // where z* is the complex conjugate of z
            // So z1th root of z2 (i.e., z2^(1/z1)) would be
            // z2^(z1*/|z1|^2)
            var modulusSq = operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1];
            return Cart2D_powComplex(
                operand_1[1],
                [operand[0][0] / modulusSq, -operand_1[0][1] / modulusSq]
            );
            
        case 'absolute':
            var modulus = Math.sqrt(
                operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1]
            );
            return [modulus, 0];
        
        case 'rdecimal':
            var intg = operand_1[0];
            var num = operand_1[1].toString()  + (operand_1[2] - operand_1[1]).toString();
            var denum = '';
            for (var i = 0; i < operand_1[2].length; i++) {
                denum += '9';
            }
            for(var i = 0; i < operand_1[1].length; i++) {
                denum += '0';
            }
            return [intg + (parseFloat(num) / parseFloat(denum)), 0];
        
        case 'subscript':
            return [
                operand_1[0][0] + 2 * operand_1[1][1],
                operand_1[0][1] + 2 * operand_1[1][0]
            ];
            
        case 'ln':
            var modulus = Math.sqrt(
                operand_1[0][0] * operand_1[0][0] + operand_1[0][1] * operand_1[0][1]
            );
            /*//
            // the current implementation does not consider the complex natural log
            // but simply takes the modulus and use that instead
            return array(log(modulus), 0);
            /*/
            // theta is the argument (angle) from the positive x-axis
            theta = atan2(operand[0][1], operand[0][0]);
            return array(log(modulus), theta);
            // Note: The return value above implies that
            //          the returned value is really the principal value Log z of the input z=x+iy
            //*/
        
        case 'log':
            var newOperand = [];
            newOperand.puosh(Cart2D_evaluateOperation('ln', [operand_1[0]], seed));
            if (typeof operand_1[1] != 'undefined') {
                newOperand.push(Cart2D_evaluateOperation('ln', [operand_1[1]], seed));
            } else {
                newOperand.push(Cart2D_evaluateOperation('ln', [[10, 0]], seed));
            }
            return Cart2D_evaluateOperation('fraction', newOperand, seed);
        
        case 'summation':
            if (operand_1[0][0] === 'equation'
                && operand_1[0][1][0] === 'variable'
                && operand_1[0][2][0] === 'natural'
                && operand_1[1][0] === 'natural') {
                var sum = [0, 0];
                var vari = operand_1[0][1];
                var min = parseFloat(operand_1[0][2][1]);
                var max = parseFloat(operand_1[1][1]);
                for (var ind = min; ind <= max; ind++) {
                    var newEx = replace(operand_1[2], vari, ['natural', ind.toString()]);
                    newEx = Cart2D_evaluateExWithSeed(newEx, seed);
                    sum = Cart2D_evaluateOperation(
                        'addchain',
                        [sum, newEx],
                        seed
                    );
                }
                return sum;
            } else {
                return null;
            }
        
        default:
            return null;
    }
}

export function Cart2D_powComplex(A, B) {
    var A_1 = JSON.parse(JSON.stringify(A));
    var B_1 = JSON.parse(JSON.stringify(B));
    var r = Math.sqrt(A_1[0] * A_1[0] + A_1[1] * A_1[1]);

    if (A_1[1] == 0 && A_1[0] == 0) {
        return [0, 0];
    }
    var theta;
    if (A_1[1] == 0 && A_1[0] > 0) {
        theta = 0;
    } else if (A_1[1] == 0 && A_1[0] < 0) { 
        theta = Math.PI;
    } else if (A_1[1] > 0) {
        theta = Math.acos(A_1[0]/r);
    } else {
        theta = 2 * Math.PI - Math.acos(A_1[0] / r);
    }
    var c = B_1[0];
    var d = B_1[1];
    
    var newR = Math.pow(r, c)/ Math.exp(d * theta);
    var newTheta = d *  Math.log(r) + c *theta;
        
    return [
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
    ];
}

export function Cart2D_compTree(treeA, treeB) {
    var treeA_1 = JSON.parse(JSON.stringify(treeA));
    var treeB_1 = JSON.parse(JSON.stringify(treeB));
    if (typeof treeA_1 !== typeof treeB_1) {
        return false;
    }
    if (!Array.isArray(treeA_1)) { 
        if (treeA_1 == treeB_1) {
            return true;
        } else { 
            return false;
        }
    }
  
    //print_r(treeA);
    //echo ("<br />");  echo "and";  echo ("<br />");
    //print_r(treeB);
    //echo ("<br />");  echo ("<br />");

    if (treeA_1[0] === 'anything') {  // it was ==
        treeA_1 = treeB_1;
    } else if (treeB_1[0] === 'anything') { // it was ==
        treeB_1 = treeA_1;
    }
    
    if (treeA_1[0] === treeB_1[0] && treeA_1.length === treeB_1.length) {    
        //print_r(treeA);
        //echo ("<br />"); echo ("<br />");
        //print_r(treeB);
        if (treeA_1[0] === 'eval') { 
            var result = true;
            var num_nullResult = 0;
            for (var [k, v] of treeA_1.entries()) {
                if (k === 0) {
                    continue;
                }
                if (v === null && treeB[k] === null) {
                    num_nullResult++;
                    continue;
                }
                
                var AReSci;
                var BReSci;
                var AImSci;
                var BImSci;
                if (v[0] == 'equation') {
                    AReSci = (v[1][0] - v[2][0]).toExponential(4);
                    BReSci = (treeB_1[k][1][0] - treeB_1[k][2][0]).toExponential(4);
                    AImSci = (v[1][1] - v[2][1]).toExponential(4);
                    BImSci = (treeB_[k][1][1] - treeB_1[k][2][1]).toExponential(4);

                    if (parseFloat(ReSci) == -1 * parseFloat(BReSci) && parseFloat(AImSci) == -1 * parseFloat(BImSci)) {
                        BReSci = AReSci;
                        BImSci = AImSci;
                    }

                } else {
                    AReSci = v[0].toExponential(4);
                    BReSci = treeB_1[k][0].toExponential(4);
                    AImSci = v[1].toExponential(4);
                    BImSci = treeB_1[k][1].toExponential(4);
                }
                
                if (AReSci === BReSci && AImSci  === BImSci) {
                
                } else {
                    result = false;
                }
            }
            if (num_nullResult === 4) {
                result = false;
            }
            return result;
        } else if (treeA_1.length === 1) { 
            return true;
        } else {  
            treeA_1 = treeA_1.slice(1);
            treeB_1 = treeB_1.slice(1);
            for (var [k, v] of treeA_1.entries()) {
                if (Cart2D_compTree(v,treeB_1[k])) {
                
                } else {
                    return false;
                }
            }
        }
    } else {
        //print_r(treeA);
        //echo ("<br />"); echo ("<br />");
        //print_r(treeB);
        return false;
    }
    
    return true;
}