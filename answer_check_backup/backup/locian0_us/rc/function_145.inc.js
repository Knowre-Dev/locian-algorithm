

import {evaluateEx_new, evaluateOperation} from '../rc/function_140.inc.js';


export function compareCartesian2D_old(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian2D' && input_1['type'] === 'Cartesian2D') {
        
        
        var right_cplane = Cartesian2D_getInfo_old(right_1, null);
        var input_cplane = Cartesian2D_getInfo_old(input_1, right_1);
        //console.log(JSON.stringify(right_cplane, null, 4));
        //console.log(JSON.stringify(input_cplane, null, 4));
        //console.log(JSON.stringify(right_cplane, null, 4) == JSON.stringify(input_cplane, null, 4));
        if (right_cplane === false || input_cplane === false) {
            return false;
        }
        
        // comparing region
        if (right_cplane['region'].length === input_cplane['region'].length) {
            if (right_cplane['region'].length > 0) {
                for (var rregion of right_cplane['region']) {
                    for (var [ki, iregion] of input_cplane['region'].entries()) {
                        if (typeof iregion != 'undefined') {
                            if (Cartesian2D_region(rregion, iregion)) {
                                
                                delete input_cplane['region'][ki];
                                break;
                            }
                        }
                    }
                }
                
                input_cplane['region'] = input_cplane['region'].filter(Boolean);
                if (input_cplane['region'].length !== 0) {
                    return false;
                }
            
                return true;
            }
        } else {
            
            return false;
        }
        // organize the point objects and the curve objects
        right_cplane = Cartesian2D_organize(right_cplane);
        input_cplane = Cartesian2D_organize(input_cplane);
        //console.log(JSON.stringify(right_cplane, null, 4));
        //console.log(JSON.stringify(input_cplane, null, 4));
        if (right_cplane === false) {
            return false;
        }
        if (input_cplane === false) {
            return false;
        }
        
        // comparing points and curves
        var right_matchedObj = [];
        var input_matchedObj = [];
        var right_remPoint = [];
        var input_remPoint = [];

        var types = [];
        var keys = Object.keys(right_cplane).concat(Object.keys(input_cplane));
        for (var v_1 of keys) {
            var is_exist = false;
            for (var v_2 of types) {
                if (JSON.stringify(v_1) == JSON.stringify(v_2)) {
                    is_exist = true;
                    break;
                }
            }
            if (!is_exist) {
                types.push(v_1);
            }
        }
        
        for (var type of types) {
            var right_typeObj = [];
            var input_typeObj = [];

            if (type in right_cplane) {
                right_typeObj = right_cplane[type];
            }
            if (type in input_cplane) {
                input_typeObj = input_cplane[type];
            }
            //console.log(right_typeObj);
            //console.log(input_typeObj);
            //console.log('..........');
            if (type === 'point') { // array of objs
                
                var r_i = Cartesian2D_subPts(right_typeObj, input_typeObj);
                
                var i_r = Cartesian2D_subPts(input_typeObj, right_typeObj);
                right_remPoint = right_remPoint.concat(r_i);
                input_remPoint = input_remPoint.concat(i_r);
                
            } else if (type === 'curve') { // array of arrays
                
                for (var rObjArr of right_typeObj) {
                    var match = false;
                    
                    for (var [k, iObjArr] of input_typeObj.entries()) {
                        //console.log(JSON.stringify(rObjArr, null, 4));
                        //console.log(JSON.stringify(iObjArr, null, 4));
                        if (typeof input_typeObj[k] != 'undefined') {
                            var possiblePts = null;
                            
                            var match = Cartesian2D_curve(rObjArr, iObjArr, possiblePts);
                            if (match) {
                                right_matchedObj = right_matchedObj.concat(rObjArr);
                                input_matchedObj = input_matchedObj.concat(iObjArr);
                                delete input_typeObj[k];
                                break;
                            } else if (possiblePts != null) {
                                var r_i = possiblePts['r_minus_i'];
                                var i_r = possiblePts['i_minus_r'];
                                if (r_i != null) {
                                    right_remPoint = right_remPoint.concat(r_i);
                                }
                                if (i_r != null) {
                                    input_remPoint = input_remPoint.concat(i_r);
                                }
                                delete input_typeObj[k];
                                match = true; // for further examination
                                break;
                            }
                        }
                    }
                    if (!match) {
                        
                        return false;
                    }
                    
                }
                
                input_typeObj = input_typeObj.filter(Boolean);
                
                if (input_typeObj.length !== 0) {
                    
                    return false;
                }
            }
            
        }
        
        //console.log(right_remPoint);
        //console.log(input_remPoint);
        
       
        var P_intersect = [];
        for (var v_1 of right_remPoint) {
            var is_intersect = false
            for (var v_2 of input_remPoint) {
                if (v_1['type'] === v_2['type'] &&
                    JSON.stringify(v_1['value']) === JSON.stringify(v_2['value']) &&
                    v_1['isFill'] === v_2['isFill'] && 
                    v_1['selected'] === v_2['selected']) {
                        is_intersect = true;
                        break
                    }
            }
            if (is_intersect) {
                P_intersect.push(v_1);
            }
        }

        //console.log(right_remPoint);
       // console.log(P_intersect);
        //console.log(input_remPoint);
        //console.log(P_intersect);
        //console.log('..........');
        right_remPoint = Cartesian2D_subPts(right_remPoint, P_intersect);
        input_remPoint = Cartesian2D_subPts(input_remPoint, P_intersect);
        //console.log(right_remPoint);
        //console.log(right_matchedObj);
        //console.log(input_remPoint);
        //console.log(input_matchedObj);
        right_remPoint = Cartesian2D_deletePointsOnGraphs(right_remPoint, input_matchedObj);
        input_remPoint = Cartesian2D_deletePointsOnGraphs(input_remPoint, right_matchedObj);
        //console.log(right_remPoint);
        //console.log(input_remPoint);
        //console.log('......');
        right_remPoint = right_remPoint.filter(Boolean);
        input_remPoint = input_remPoint.filter(Boolean);
        //console.log(right_remPoint);
        //console.log(input_remPoint);
        if (right_remPoint.length > 0 || input_remPoint.length > 0) {
            return false;
        }
        
        return true;
    }

    return false;
}

// copy and paste organizeMathTree_relationEqeq from checkmath.php
export function Cartesian2D_organizeMathTree(tree) {
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
                ['natural', '0']
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
                    tree_1[2] === 'lt' ? 'gt' : 'ge',
                    ['natural', 0]
                ];
            }
            break;
        
        default:
            var result = evaluateEx_new(tree_1);
            if (result) {
                return result;
            } else {
                return false;
            }
    }
    
    var evaluated = evaluateEx_new(newTree);
    
    var head = evaluated[1][1];
    evaluated = evaluated.slice(1);
    if (head[0] < 0) {
        for (var k in evaluated) {
            switch (evaluated[k][2]) {
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
    for (var v of evaluated) {
        var eq = v;
        var lhs = [
            (eq[1][0] * head[0] + eq[1][1] * head[1] ) / (head[0] * head[0] + head[1] * head[1]),
            (eq[1][1] * head[0] - eq[1][0] * head[1]) / (head[0] * head[0] + head[1] * head[1])
        ];
        
        eq[1] = ['eval', lhs];
        newEval.push(eq);
    }
    
    return newEval;
}


import {Relation_LatexToTree} from '../rc/function_144.inc.js';
import {Relation_compTree} from '../rc/function_169.inc.js';

export function Cartesian2D_region(region1, region2) {  
    var region1_1 = JSON.parse(JSON.stringify(region1));
    var region2_1 = JSON.parse(JSON.stringify(region2));
    //console.log(JSON.stringify(region1_1, null, 4));
    //console.log(JSON.stringify(region2_1, null, 4));
    if (region1_1['value'].length !== region2_1['value'].length) {
        return false;
    }
    if (region1_1['dataFill'].length !== region2_1['dataFill'].length) {
        return false;
    }
    
    var mapping = [];
    

    for (var [k1, value1] of region1_1['value'].entries()) {
        for (var [k2, value2] of region2_1['value'].entries()) {
            if (typeof region1_1['value'][k1] != 'undefined' &&
                typeof region2_1['value'][k2] != 'undefined')
            if (value1['type'] === value2['type'] && 
                value1['dash'] === value2['dash']) {
                var val1 = Cartesian2D_makeEq(value1['type'], value1['value']);
                var val2 = Cartesian2D_makeEq(value2['type'], value2['value']);
                if (val1 === false || val2 === false) {
                    return false;
                }
                
                var tree1 = Cartesian2D_organizeMathTree(Relation_LatexToTree(val1));
                var tree2 = Cartesian2D_organizeMathTree(Relation_LatexToTree(val2));
                
                if (Relation_compTree(tree1, tree2)) {
                    delete region1_1['value'][k1];
                    delete region2_1['value'][k2];
                    mapping.push(k2);
                    break;
                }
            }
        }
    }
    region1_1['value'] = region1_1['value'].filter(Boolean);
    region2_1['value'] = region2_1['value'].filter(Boolean);
    
    if (region1_1['value'].length !== 0 || region2_1['value'].length !== 0) {
        return false;
    }
    
    var newDataFill = [];
    for (var data of region2_1['dataFill']) {
        var newData = [];
        for (var m of mapping) {
            newData.push(data[m]);
        }
        newDataFill.push(newData);
    }
    for (var rdata of region1_1['dataFill']) {
        for (var [k, idata] of newDataFill.entries()) {
            if (JSON.stringify(rdata) === JSON.stringify(idata)) {
                delete newDataFill[k];
                break;
            }
        }
    }
    
    newDataFill = newDataFill.filter(Boolean);
    return newDataFill.length === 0;
}

export function Cartesian2D_subPts(p1, p2) {
    var p1_1 = JSON.parse(JSON.stringify(p1));
    var p2_1 = JSON.parse(JSON.stringify(p2));
    
    
    var result = [];
    //console.log(p1_1 != null && p1_1.length != 0);
    //console.log(p2_1);
    if (p1_1 != null && p1_1.length != 0) {
        
        for (var p of p1_1) {
            var is_included = false;
            for (var v of p2_1) {
                if (JSON.stringify(p) == JSON.stringify(v)) {
                    is_included = true;
                    break;
                }
            }
            if (!is_included) {
                result.push(p);
            }
        }
    }
    //console.log(result);
    //console.log('........')
    //console.log(1);
    return result;
}

export function Cartesian2D_organize(obj) {
    var obj_1 = JSON.parse(JSON.stringify(obj));
    
    var fn = function(o) { // copy and paste from checkcart2d.php
        if ('isFill' in o) {
            return o['isFill'];
        } else {
            return false;
        }
    };
    
    if (obj_1['point'] != null) {
        var pObj = obj_1['point'].filter(fn);
        obj_1['point'] = pObj;
    } 
    
    if (typeof obj_1['curve'] != 'undefined') {
        for (var [i, curve] of obj_1['curve'].entries()) {
            if (Array.isArray(curve['value'])) { //  array of points
                var eq = Cartesian2D_makeEq(curve['type'], curve['value']);
                //console.log(curve['value']);
                if (eq === false) {
                    return false;
                }
                
                obj_1['curve'][i]['mathTree'] = Relation_LatexToTree(eq);
                //console.log(JSON.stringify(Relation_LatexToTree(eq), null, 4));
            } else { // value is latex string
                
                obj_1['curve'][i]['mathTree'] = Relation_LatexToTree(curve['value']);
                
            } 
        }
        
        //  delete the points those are on the curves
        if (typeof obj_1['point'] != 'undefined') {
            //console.log(obj_1['point']);
            //console.log(obj_1['curve']);
            //console.log(Cartesian2D_deletePointsOnGraphs(obj_1['point'], obj_1['curve']));
            //console.log('............');
            obj_1['point'] = Cartesian2D_deletePointsOnGraphs(obj_1['point'], obj_1['curve']);
        }
        
        // find equivalent curves and combine in one array
        // so the result will be an array of arrays
        var cObj = [];
        for (var c of obj_1['curve']) {
            var position = -1;
            var newc = null;
            for (var [i, o] of cObj.entries()) {
                if (Relation_compTree(Cartesian2D_organizeMathTree(o[0]['mathTree']),   Cartesian2D_organizeMathTree(c['mathTree']))) {
                    position = i;
                    newc = o;
                    newc.push(c);
                    break;
                }
            }
            if (position < 0) {
                cObj.push([c]);
            } else {
                cObj[position] = newc;
            }
        }
        // and combine bounds for each array of equivalent curves
        for (var [i, cArr] of cObj.entries()) {
            cArr.sort(Cartesian2D_cmpObjBounds);
            var cArr_new = [];
            for (var c of cArr) {
                if (cArr_new.length === 0) {
                    cArr_new.push(c);
                    continue;
                }
                var keys = [...cArr_new.keys];
                var lastKey = keys[keys.length - 1];
                var newc = Cartesian2D_combineTwoBounds(cArr_new[lastKey], c);
                
                if (newc != null) { 
                    cArr_new[lastKey] = newc;
                } else { 
                    cArr_new.push(c);
                }
            }
            cObj[i] = cArr_new;
        }
        obj_1['curve'] = cObj;
    }
    
    return obj_1;
} 

export function Cartesian2D_curve(rObjArr, iObjArr, possiblePts) {
    var rObjArr_1 = JSON.parse(JSON.stringify(rObjArr));
    var iObjArr_1 = JSON.parse(JSON.stringify(iObjArr));
    if (rObjArr_1 == null  || iObjArr_1 == null) {
        return false;
    }
    
    // check if the mathTree match
    var rTree = Cartesian2D_organizeMathTree(rObjArr_1[0]['mathTree']);
    var iTree = Cartesian2D_organizeMathTree(iObjArr_1[0]['mathTree']);
    
    var match = Relation_compTree(rTree, iTree);
    if (!match) {
        return false;
    }
    
    // check if the bounds match
    if (rObjArr_1.length === iObjArr_1.length) {
        var identical = true;
        
        for (var [kr, rObj] of Object.entries(rObjArr_1)) {
            if (rObj['selected'] !== iObjArr_1[kr]['selected'] || Cartesian2D_cmpObjBounds(rObj, iObjArr_1[kr]) !== 0) {
                identical = false;
                break;
            }
        }
        if (identical) {
            
            return true;
        }
    }
    
    // if their bounds are different only because of the points, find out the possible points those make the bounds different and return false
    if (rObjArr_1.length === 0 || iObjArr_1.length === 0)  {
        possiblePts = null;
    } else {
        var r_min = rObjArr_1[0]; 
        var r_max = rObjArr_1[rObjArr_1.length-1];
        var i_min = iObjArr_1[0]; 
        var i_max = iObjArr_1[iObjArr_1.length-1];
        if (((r_min['bound'] == null || 
                JSON.stringify(r_min['bound']) === JSON.stringify([-Infinity, Infinity])) && 
                i_min['bound'] != null) || 
            (r_min['bound'] != null && 
                (i_min['bound'] == null || 
                JSON.stringify(i_min['bound']) === JSON.stringify([-Infinity, Infinity])))) {
            possiblePts = null;
        } else if ((r_min['bound'][0] !== i_min['bound'][0]) || (r_max['bound'][1] !== i_max['bound'][1])) {
            possiblePts = null;
        } else { // check if their bounds are different by points
            var r_i = Cartesian2D_boundsDiffByPts(rObjArr_1, iObjArr_1);
            var i_r = Cartesian2D_boundsDiffByPts(iObjArr_1, rObjArr_1);
            
            if (r_i != null || i_r != null) {
                possiblePts = {
                    'r_minus_i': r_i, 
                    'i_minus_r': i_r
                };
            } else {
                possiblePts = null;
            }
        }
    }
    
    return false;
}

// find or make the points that exist in objArr1 but not in objArr2
export function Cartesian2D_boundsDiffByPts(objArr1, objArr2) {
    var objArr1_1 = JSON.parse(JSON.stringify(objArr1));
    var objArr2_1 = JSON.parse(JSON.stringify(objArr2));
    var points = [];
    var mathTree = objArr1[0]['mathTree'];
    
    // check the mininum end points
    var o1 = objArr2_1[0];
    var o2 = objArr1_1[0];
    if (isFinite(o1['bound'][0]) && !o1['endPoint'][0] && o2['endPoint'][0]) {
        var pt = Cartesian2D_createPtObj(mathTree, o1['bound'][0]);
        points.push(pt);
    }
    
    // check the maximum end points
    
    var keys_1 = [...objArr1_1.keys()];
    var keys_2 = [...objArr2_1.keys()];
    o1 = objArr2_1[keys_2[keys_2.length - 1]]; 
    o2 = objArr1_1[keys_1[keys_1.length - 1]]; 
    if (typeof o1['bound'] != 'undefined' && 
        isFinite(o1['bound'][1]) && 
        !o1['endPoint'][1] && 
        o2['endPoint'][1]) {
        var pt = Cartesian2D_createPtObj(mathTree, o1['bound'][1]);
        points.push(pt);
    }
    
    // check points in the middle
    for (var i = 0; i < objArr2_1.length - 1; i++) {
        o1 = objArr2_1[i];
        o2 = objArr2_1[i+1];
        
        if (o1['bound'][1] === o2['bound'][0]) {
            var pt = Cartesian2D_createPtObj(mathTree, o1['bound'][1]);
            for (var obj1 of objArr1) {
                if (Cartesian2D_eqn(pt, obj1)) {
                    points.push(pt);
                    break;
                }
            }
        }
    }
    
    if (points.lenght === 0) {
        return null;
    }
    return points;
}

export function Cartesian2D_createPtObj(mathTree, x) {
    var mathTree_1 = JSON.parse(JSON.stringify(mathTree));
    var y = Cartesian2D_evalY(mathTree_1, x);
    return {
        'type': 'point',
        'value': [x, y],
        'isFill': true
    };
}

export function Cartesian2D_evalY(A, x) {
    var A_1 = JSON.parse(JSON.stringify(A));
    
    if (!Array.isArray(A_1)) {
        A_1 = Relation_LatexToTree(A_1);
    }
    if (Array.isArray(A_1) && A_1[0] == 'equation') {
    
    } else {  
        return false;
    }
    
    var y = Cartesian2D_evalExWithVal(A_1[2], {'x': x});
    return y[0];
}

// copy and paste from checkcart2d.php
export function Cartesian2D_combineTwoBounds(curveObj1, curveObj2) {
    var curveObj1_1 = JSON.parse(JSON.stringify(curveObj1));
    var curveObj2_1 = JSON.parse(JSON.stringify(curveObj2));
    if (curveObj1_1['bound'] == null || 
        (curveObj1_1['bound'] != null && 
            JSON.stringify(curveObj1_1['bound']) === JSON.stringify([-Infinity, Infinity]))) {
        return curveObj1_1;
    }
    if (curveObj2_1['bound'] == null || 
        (curveObj2_1['bound'] != null && 
            JSON.stringify(curveObj2_1['bound']) === JSON.stringify([-Infinity, Infinity]))) {
        return curveObj2_1; 
    }

    //both graphs are bounded 
    var b1 = curveObj1_1['bound']; 
    var b2 = curveObj2_1['bound'];
    var e1 = curveObj1_1['endPoint']; 
    var e2 = curveObj2_1['endPoint'];

    //their bounds are mutually exclusive （互斥）
    if (b1[1] < b2[0]) {
        return null;
    }
    //their bounds are diff by a point
    if (b1[1] === b2[0] && !e1[1] && !e2[0]) {
        return null;
    }

    // modify curveObj1 by default 
    var result = curveObj1_1;
    if (b1[0] === b2[0]) {
        result['endPoint'][0] = (e1[0] ? e1[0] : e2[0]); 
    } else {
        result['bound'][0] = (b1[0] < b2[0] ? b1[0] : b2[0]);
        result['endPoint'][0] = (b1[0] < b2[0] ? e1[0] : e2[0]);
    }

    if (b1[1] === b2[1]) {
        result['endPoint'][1] = (e1[1] ? e1[1] : e2[1]); 
    } else {
        result['bound'][1] = (b1[1] > b2[1] ? b1[1] : b2[1]);
        result['endPoint'][1] = (b1[1] > b2[1] ? e1[1] : e2[1]);
    }

    return result;
}

// copy and paste from checkcart2d.php
// smaller ['bound'][0], bigger ['bound'][1], is real 'bigger';
// [1,3] > [2,10]
// [-Infinity,5] > [-3,100]
// [1,3] with [true,false] > [1,4] with [false,true]
export function Cartesian2D_cmpObjBounds(o1, o2) { // both of inputs are curve objects
    var o1_1 = JSON.parse(JSON.stringify(o1));
    var o2_1 = JSON.parse(JSON.stringify(o2));
    if (JSON.stringify(o1_1['bound']) === JSON.stringify(o2_1['bound']) && 
        JSON.stringify(o1_1['endPoint']) === JSON.stringify(o2_1['endPoint'])) { 
        return 0;
    }

    if ((o1_1['bound'] != null && 
            JSON.stringify(o1_1['bound']) === JSON.stringify([-Infinity, Infinity])) && 
        o2_1['bound'] != null) {
        return 0;
    }
 
    if ((o2_1['bound'] != null && 
            JSON.stringify(o2_1['bound']) === JSON.stringify([-Infinity, Infinity])) && 
        o1_1['bound'] != null) { 
        return 0;
    }

    if (o1_1['bound'] == null || 
        (o1_1['bound'] != null && 
            JSON.stringify(o1_1['bound']) === JSON.stringify([-Infinity, Infinity]))) {// only o2 is bounded
        return 1;  // it's -1 in checkcart2d.php, why??
    }
    if (o2_1['bound'] != null || 
        (o2_1['bound'] != null && 
            JSON.stringify(o2_1['bound']) === JSON.stringify([-Infinity, Infinity]))) {// only o1 is bounded
        return -1;  // it's 1 in checkcart2d.php, why?? 
    }
    //both are bounded
    var b1 = o1_1['bound'];
    var b2 = o2_1['bound'];
    
    var e1 = o1_1['endPoint'];
    var e2 = o2_1['endPoint'];
    
    if (b1[0] === b2[0]) {
        if (e1[0] === e2[0]) {
            return b1[1] < b2[1] ? -1 : (e1[1] ? -1 : 1); 
        } else if (e1[0]) {
            return 1;  // it's -1 in checkcart2d.php, why??
        } else {
            return -1;  // it's 1 in checkcart2d.php, why?? 
        }
    }
    
    //return b1[0] < b2[0] ? -1 : 1; it's the original in checkcart2d.php
    return b1[0] < b2[0] ? 1 : -1;
}

export function Cartesian2D_deletePointsOnGraphs(pObj, cObj) { // array, array
    var pObj_1 = JSON.parse(JSON.stringify(pObj));
    var cObj_1 = JSON.parse(JSON.stringify(cObj));
    //console.log(pObj_1);
    //console.log(cObj_1);
    //console.log('......');
    var result = [];
    for (var p of pObj_1) {
        var pFlag = false;
        for (var c of cObj_1) {
            //console.log(p);
            //console.log(c);
            //console.log(Cartesian2D_bound(p, c));
            //console.log(Cartesian2D_eqn(p, c));
            //console.log('.........');
            if (Cartesian2D_bound(p, c) && Cartesian2D_eqn(p, c)) {
                pFlag = true;
                break;
            }
        }
        if (!pFlag) {
            result.push(p);
        }
    } 
    return result;
}

// checking the bound
export function Cartesian2D_bound(pobj, cobj) { 
    var pobj_1 = JSON.parse(JSON.stringify(pobj));
    var cobj_1 = JSON.parse(JSON.stringify(cobj));
    if (cobj_1['bound'] == null && 
        cobj_1['endPoint'] == null) { // Infinityinite
        return true; 
    }
    if (cobj_1['bound'][0] < pobj_1['value'][0] && 
        pobj_1['value'][0] < cobj_1['bound'][1]) {
        return true; 
    }
    if (cobj_1['bound'][0] === pobj_1['value'][0] && 
        cobj_1['endPoint'][0]) {
        return true;
    }
    if (cobj_1['bound'][1] === pobj_1['value'][0] && 
        cobj_1['endPoint'][1]) {
        return true;
    }
    
    return false;
}

// checking if the point is on the curve
export function Cartesian2D_eqn(pObj, cObj) {
    var pObj_1 = JSON.parse(JSON.stringify(pObj));
    var cObj_1 = JSON.parse(JSON.stringify(cObj)); 
    //console.log(pObj_1);
    //console.log(cObj_1);
    //console.log('...........');
    return Cartesian2D_idEqWithVal(cObj_1['mathTree'], {'x': pObj_1['value'][0], 'y': pObj_1['value'][1]});
}

// copy and paste from checkmath.php
// A is a mathTree valueArr is an array of ['x' => ?, 'y' => ?]
export function Cartesian2D_idEqWithVal(A, valueArr) {
    var A_1 = JSON.parse(JSON.stringify(A));
    var valueArr_1 = JSON.parse(JSON.stringify(valueArr));
    if (!Array.isArray(A_1)) { 
        return false;
    }
    if (Array.isArray(A_1) && ['equation', 'inequality'].includes(A[0])) {

    } else {
        return false;
    }
    //console.log(JSON.stringify(A, null, 4));
    //console.log(valueArr_1);
    var evaluatedEq = Cartesian2D_evalExWithVal(A_1, valueArr_1);
    //console.log(evaluatedEq);
    // in the export function powComplex_inLocian(from evaluateEx_new), sin(2π) is not equal to 0, the result is -2.4492935982947E-16, so the export function Relation_compTree outputs false and that causes the right answer marked false.
    for (var [k1, arrEq] of evaluatedEq.entries()) {
        if (k1 > 0) {
            for (var [k2, value] of arrEq.entries()) {
                if (value.toString().indexOf('e') != -1) {
                    evaluatedEq[k1][k2] = Math.round(value);
                }
            }
        }
    }
    //console.log(evaluatedEq);
    if (evaluatedEq[0] === 'equation') { 
        return JSON.stringify(evaluatedEq[1]) == JSON.stringify(evaluatedEq[2]) || Relation_compTree(evaluatedEq[1], evaluatedEq[2]); 
    } else if (A[0] === 'inequality') {
        return false;
    }
}

// copy and paste from checkmath.php
// A is a mathTree valueArr is an array of ['x' => ?, 'y' => ?]
export function Cartesian2D_evalExWithVal(A, valueArr) {
    var A_1 = JSON.parse(JSON.stringify(A));
    var valueArr_1 = JSON.parse(JSON.stringify(valueArr));
    if (!Array.isArray(A_1)) {
        return A_1;
    }
 
    var operator = A_1[0];  // should be an equation
    var operandTree = A_1.slice(1);
    
    var operand = [];
    for (var each of operandTree) {
        operand.push(Cartesian2D_evalExWithVal(each,valueArr_1));
    }
    
    switch (operator) {
        case 'variable':
        if (valueArr_1[operand[0]] !== null) {
            return [valueArr_1[operand[0]], 0];
        }
        break;

        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality': 
            var result = [operator];
            for (var v of operand) {
                result.push(v);
            }
            return result;

        default:
            
            result = evaluateOperation(operator,operand); // it's from evaluateEx_new
            return result;
    }
}

// copy and paste from checkmath.php 
export function Cartesian2D_makeEq(type, points) {
    
    var points_1 = JSON.parse(JSON.stringify(points)); // make latex string
    if (!Array.isArray(points_1)) {
        return points_1;
    }
    var result;
    switch (type) {
        case 'lineCurve':
        case 'linear':
            if (points_1.length !== 2) {
                return false;
            }

            var xDiff = points_1[0][0] - points_1[1][0];
            if (xDiff == 0) {
                result = 'x=' + 
                        points_1[0][0].toString();
                break;
            } else {
                var yDiff = points_1[0][1] - points_1[1][1];
                if (yDiff == 0) {
                    result = 'y=' + 
                            points_1[0][1].toString();
                    break;
                } else {
                    var slope;
                    if (xDiff === 1)
                        slope = (yDiff).toString();
                    else if(xDiff === -1)
                        slope = (-yDiff).toString();
                    else
                        slope = '\\frac{' + 
                                yDiff.toString() + 
                                '}{' + 
                                xDiff.toString() + 
                                '}';
                    result = 'y=' + slope + 
                            '(x-(' + 
                            points[0][0].toString() + 
                            '))+(' + 
                            points[0][1].toString() + 
                            ')';
                }
            }
            break;

        case 'quadCurve':
        case 'quadratic':
            if (points_1.length !== 3) {
                return false;
            }

            var xDiff = points_1[1][0] - points_1[0][0];
            var yDiff = points_1[1][1] - points_1[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                var slope;
                var squareXDiff = xDiff * xDiff;
                if (squareXDiff === 1)
                    slope = yDiff.toString();
                else
                    slope = '\\frac{' + 
                            yDiff.toString() + 
                            '}{' + 
                            squareXDiff.toString() +
                            '}';
                result = 'y=' + 
                        slope + 
                        '(x-(' + 
                        points_1[0][0].toString() + 
                        '))^2+(' + 
                        points[0][1].toString() +
                        ')';
            }
            break;

        case 'absCurve':
        case 'absolute':
            if (points_1.length !== 3) {
                return false;
            }

            xDiff = points_1[1][0] - points_1[0][0];
            yDiff = points_1[1][1] - points_1[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                var slope;
                var absXDiff = Math.abs(xDiff).toString();
                if (xDiff == 1)
                    slope = yDiff.toString();
                else
                    slope = '\\frac{' + 
                            yDiff.toString() + 
                            '}{' + 
                            absXDiff + 
                            '}';
                result = 'y=' + 
                        slope + 
                        '\\left|x-(' + 
                        points[0][0] + 
                        ')\\right|+(' + 
                        points[0][1].toString() +
                        ')';
            }
            break;

        case 'expoCurve':
        case 'exponential':
            if (points_1.length !== 3) {
                return false;
            }
    
            var q = points_1[0][1];
            var yDiff1 = points_1[1][1] - q;
            var yDiff2 = points_1[2][1] - q;
            var xDiff = points_1[2][0] - points_1[1][0];

            if (xDiff == 0 || yDiff1 == 0 || yDiff2 == 0) {
                return false;
            } else {
                var a = '\\frac{(' + 
                        yDiff1.toString() + 
                        ')^(\\frac{' + 
                        points_1[2][0].toString() + 
                        '}{' + 
                        xDiff.toString() + 
                        '})}{('+ 
                        yDiff2.toString() + 
                        ')^(\\frac{' + 
                        points_1[1][0].toString() + 
                        '}{' + 
                        xDiff.toString() + 
                        '})}';
                var b = '(\\frac{' + 
                        yDiff2.toString() + 
                        '}{' + 
                        yDiff1.toString() + 
                        '})^(\\frac{1}{' + 
                        xDiff.toString() + 
                        '})';
                result = 'y=(' + 
                        a.toString() + 
                        ')*(' + 
                        b.toString() + 
                        ')^x+(' + 
                        q.toString() + 
                        ')';
            }
            break;

        case 'logCurve':
        case 'logarithmic':
            if (points_1.length !== 3) {
                return false;
            }
            
            var q = points[0][0];
            var xDiff1 = points_1[1][0] - q;
            var xDiff2 = points_1[2][0] - q;
            var yDiff = points_1[2][1] - points_1[1][1];

            if (yDiff == 0 || xDiff1 == 0 || xDiff2 == 0) {
                return false;
            } else {
                var a = '\\frac{(' + 
                        xDiff1.toString() + 
                        ')^(\\frac{' + 
                        points_1[2][1].toString() + 
                        '}{' + 
                        yDiff.toString() + 
                        '})}{(' + 
                        xDiff2.toString() + 
                        ')^(\\frac{' + 
                        points_1[1][1].toString() + 
                        '}{' + 
                        yDiff.toString() + 
                        '})}';
                var b = '(\\frac{' + 
                        xDiff2.toString() + 
                        '}{' + 
                        xDiff1.toString() + 
                        '})^(\\frac{1}{' + 
                        yDiff.toString() + 
                        '})';
                var result = 'y=log_{' + 
                            b.toString() + 
                            '}{\\frac{x' + 
                            q.toString() + 
                            '}{' + 
                            a.toString() + 
                            '}}';
            }
            break;
    
        case 'sqrtCurve':
        case 'square_root':
            if (points_1.length !== 2) {
                return false;
            }

            var xDiff = points_1[1][0] - points_1[0][0];
            var yDiff = points_1[1][1] - points_1[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                var sign;
                if (yDiff > 0) {
                    sign = '';
                } else {
                    sign = '-';
                }

                var squareYDiff = yDiff * yDiff;
                var slope
                if (xDiff == 1) {
                    slope = squareYDiff.toString();
                } else if (xDiff == -1) {
                    slope = (-squareYDiff).toString();
                } else {
                    slope = '\\frac{' + 
                            squareYDiff.toString() + 
                            '}{' + 
                            xDiff.toString() + 
                            '}';
                }
                result = 'y=' + 
                        sign + 
                        '\\sqrt{' + 
                        slope + 
                        '(x-(' + 
                        points_1[0][0].toString() + 
                        '))}+(' + 
                        points_1[0][1].toString() + 
                        ')';
            }
            break;

        case 'reciCurve':
        case 'rational':
            if (points_1.length !== 3) {
                return false;
            }

            var xDiff = points_1[1][0] - points_1[0][0];
            var yDiff = points_1[1][1] - points_1[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                var slope = (xDiff * yDiff).toString();
                result = 'y=\\frac{' + 
                        slope + 
                        '}{x-(' + 
                        points_1[0][0].toString() + 
                        ')}+(' + 
                        points_1[0][1] + 
                        ')';
            }
            break;

        case 'sinCurve':
        case 'tanCurve':
            return false;
        
    }
    
    return result;
}
/*
export function Cartesian2D_old_getInfo(cplane, right = null) {
    var cplane_1 = JSON.parse(JSON.stringify(cplane));
    var right_1 = JSON.parse(JSON.stringify(right));
    return Cartesian2D_H_old(cplane_1);
    
}
*/
export function Cartesian2D_getInfo_old(cplane) {
    var cplane_1 = JSON.parse(JSON.stringify(cplane));
    if (cplane_1['checkFlag'] === false) {
        return false;
    }
    //console.log(JSON.stringify(cplane_1, null, 4));
    var point = [];
    var curve = [];
    var region = [];
    if (typeof cplane_1['object'] == 'undefined') {
        return {
            'point': point,
            'curve': curve,
            'region': region
        };
    }
    for_1:
    for (var object of cplane_1['object']) {
        if (object['type'] === 'Regio' || object['type'] === 'Region') {
            var value = [];
            for (var eqn of object['eqn']) {
                var type;
                switch (eqn['type']) {
                    case 'Curve':  
                        type = 'curve';  
                        break;
                    case 'Input:LineCurve':  
                        type = 'lineCurve';  
                        break;
                    case 'Input:QuadCurve':  
                        type = 'quadCurve';  
                        break; //can't find it
                }
                value.push({
                    'type': type,
                    'value': Cartesian2D_JStoLatex(eqn['eqn']), //it was null because the curve's(s') expr won't be changed?
                    'dash': eqn['dash']
                });
            }
            region.push({
                'type': 'region',
                'value': value, 
                'dataFill': object['dataFill']
            });
            continue;
        } else if (object['type'] === 'Input:Region' || 
                    object['type'] === 'Input:Regio') {
            var value = [];
            for (var [k, eqn] of object['eqn'].entries()) {
                var type;
                switch (eqn['type']) {
                    case 'Curve':  
                        type = 'curve';  
                        break;
                    case 'Input:LineCurve':  
                        type = 'lineCurve';  
                        break; 
                    case 'Input:QuadCurve':  
                        type = 'quadCurve';  
                        break; 
                }
                value.push({
                    'type': type,
                    'value': eqn['coords'], // maybe array of points??
                    'dash': object['dashes'][k]
                });
            }
            region.push({
                'type': 'region',
                'value': value,
                'dataFill': object['dataFill']
            });
            continue;
        }
        
        if (typeof object['input'] == undefined || object['input'] === false) {
            continue;
        }
        
        switch (object['type']) {
            case 'Punctum':
                point.push({
                    'type': 'point',
                    'value': object['coord'],
                    'isFill': object['isFill'],
                    'selected': null
                });
                break;
            
            case 'Line': // can't find this case
            case 'Quad': // can't find this case
            case 'Expo': // can't find this case
            case 'Abs': // can't find this case
            case 'Log': // can't find this case     
            case 'Sqrt': // can't find this case
            case 'Reci': // can't find this case
            case 'Sin': // can't find this case
            case 'Tan': // can't find this case 
                curve.push({ 
                    'type': object['type'].toLowerCase() + 'Curve',
                    'value': object['answerPoint'], // maybe array of points?
                    'mathTree': null,
                    'bound': object['bounded'] ? object['bound'] : null,
                    'endPoint': object['bounded'] ? object['endPoint'] : null,
                    'selected': null
                });
                break; 
            
            case 'Objectum': // have same or equivalent
                curve.push({
                    'type': object['mode'],
                    'value': object['latex'], 
                    'mathTree': null,
                    'bound': object['bounded'] ? object['bound'] : null,   // [3, 6]
                    'endPoint': object['bounded'] ? object['endPoint'] : null, // [false, true]
                    'selected': null
                });
                break;
            
            default:  
            continue for_1;
        }
    }
    //console.log(JSON.stringify(curve, null, 4));
    var result = {
        'point': point,
        'curve': curve,
        'region': region
    };
    return result;
}

import {match_all} from '../checkmath.js';


export function Cartesian2D_JStoLatex(JS) {
    var replace = {
        ' ': '', 
        '+ -': '-'
    };
    for (var [k, v] of Object.entries(replace)) {
        JS = JS.replaceAll(k, v);
    }
    
    var temp  = match_all(
        JS, 
        new RegExp(
            '\(\(([^\(\)]+)\)\\/\(([^\(\)]+)\)\)/',
            'g')
    );
   
    if (typeof temp[0] != 'undefined') {
        for (var i = 0; i < temp[0].length; i++) {
            JS = JS.replaceAll(
                temp[0][i], 
                '\\frac{' + temp[1][i] + '}{' + temp[2][i] + '}'
            );
        }
    }
    temp = match_all(
        JS, 
        new RegExp(
            'Math.pow\(([^\(\),]+),([^\(\),]+)\)',
            'g')
    );
    if (typeof temp[0] != 'undefined') {
        for (var i = 0; i < temp[0].length; i++) {
            
            JS = JS.replaceAll(
                temp[0][i],
                '(' + temp[1][i] + ')^' + temp[2][i]
            );
        }
    }

    temp = match_all(
        JS, 
        new RegExp(
            'Math.sqrt\(([^\(\)]+)\)', 
            'g')
    );
    if (typeof temp[0] != 'undefined') {
        for(var i = 0; i < temp[0].length; i++) {
            JS = JS.replaceAll(
                temp[0][i],
                '\\sqrt{' + temp[1][i] + '}'
            );
        }
    }
    return JS;
}

var object = {
    "type": "Cartesian2D",
    "object": [
        {
            "type": "Grid2D",
            "value": [
                [
                    -1,
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ],
                [
                    -1,
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ]
            ]
        },
        {
            "type": "GridLabel2D",
            "value": [
                [
                    [
                        2,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "2"
                        }
                    ],
                    [
                        4,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "4"
                        }
                    ],
                    [
                        6,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "6"
                        }
                    ],
                    [
                        8,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "8"
                        }
                    ]
                ],
                [
                    [
                        -0.385,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "0"
                        }
                    ],
                    [
                        2,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "2"
                        }
                    ],
                    [
                        4,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "4"
                        }
                    ],
                    [
                        6,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "6"
                        }
                    ],
                    [
                        8,
                        {
                            "type": "Static",
                            "mode": "math",
                            "value": "8"
                        }
                    ]
                ]
            ]
        },
        {
            "type": "Axis2D",
            "value": [
                {
                    "name": {
                        "type": "Static",
                        "mode": "math",
                        "value": "x"
                    },
                    "visible": true
                },
                {
                    "name": {
                        "type": "Static",
                        "mode": "math",
                        "value": "y"
                    },
                    "visible": true
                }
            ],
            "origin": false
        },
        {       
            "type": "Punctum",
            "input": true,
            "coord": [
                6,
                3
            ],
            "isFill": true,
            "selected": false,
            "color": 100
        },
        {
            "type": "Segment",
            "source": {
                "coord": [
                    "0",
                    "0"
                ],
                "arrow": false
            },
            "target": {
                "coord": [
                    "6",
                    "0"
                ],
                "arrow": true
            },
            "dash": true,
            "color": 100,
            "label": {
                "type": "Static",
                "mode": "null"
            },
            "labelSign": true,
            "input": true
        },
        {
            "type": "Segment",
            "source": {
            "coord": [
                "6",
                "0"
            ],
            "arrow": false
            },
            "target": {
                "coord": [
                    "6",
                    "3"
                ],
                "arrow": true
            },
            "dash": true,
            "color": 100,
            "label": {
                "type": "Static",
                "mode": "null"
            },
            "labelSign": true,
            "input": true
        }
    ],
    "bound": [
        [
            -1,
            10
        ],
        [
            -1,
            10
        ]
    ],
    "menu": [
        "Point",
        "Line",
        "Quad",
        "Expo",
        "Sqrt",
        "Reci",
        "Sin",
        "Tan",
        "Abs",
        "Log"
    ],
    "menuOption": {
        "curveColor": [
            103
        ],
        "pointColor": [
            103
        ],
        "defaultPosition": "parent",
        "bounded": false,
        "endPoint": [
            true,
            true
        ],
        "bound": [
            -1,
            10
        ]
    },
    "size": 1,
    "checkFlag": true
  }