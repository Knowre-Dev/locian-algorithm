
import {organizeAnswerObj} from '../rc/functions.js';

export function compareCartesian2D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian2D' && input_1['type'] === 'Cartesian2D') { 
        if (typeof right_1['object'] != 'undefined') {
            return compareCart2D(right_1, input_1);
        }
        
        
        
        var answer = Cartesian2D_getInfo(right_1);
        var inswer = Cartesian2D_getInfo(input_1);
        //console.log(JSON.stringify(answer, null, 4));
        //console.log(JSON.stringify(inswer, null, 4));
        
        
        if (typeof answer['Point2D'] != 'undefined') {
            if (!Cartesian2D_compPoint2D(answer, inswer)) {
                
                return false;
            }
        } 
        if (typeof answer['Segment2D'] != 'undefined') {

            if (!Cartesian2D_compSegment2D(answer, inswer)) {
                
                return false;
            }
        }  
        if (typeof answer['Angle2D'] != 'undefined') {
            if (!Cartesian2D_compAngle2D(answer, inswer)) {
                return false;
            }
        } 
        if (typeof answer['Arc2D'] != 'undefined') {
            if (!Cartesian2D_compArc2D(answer, inswer)) {
                return false;
            }
        }  
        if (typeof answer['Path2D'] != 'undefined') {
            if (!Cartesian2D_compPath2D(answer, inswer)) {
                return false;
            }
        }
        
        if (typeof answer['MultiRegion2D'] != 'undefined') {
            if (!Cartesian2D_compMultiRegion2D(answer, inswer)) {
                return false;
            }
        }
        if (typeof answer['Region2D'] != 'undefined') {
            if (!Cartesian2D_compRegion2D(answer, inswer)) {
                return false;
            }
        }
        if (typeof answer['Curve2D'] != 'undefined') {
            
            if (!Cartesian2D_compCurve2D(answer, inswer)) {
                return false;
            }
        }
        
        // compare added objects
        if (typeof answer['Cartesian2D'] != 'undefined') {
            if (!Cartesian2D_compAdded(answer, inswer)) {
                return false;
            }
        }
        
        return true;
    }

    return false;
}

export function Cartesian2D_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
   
    
     for (var e of object_1['elements']) {
        if (e['type'] === 'Label2D') {
        
        organizeAnswerObj(e['label'], answer, checktypeDefault);
        } else if (e['type'] === 'Trig') {
        
        organizeAnswerObj(e, answer, checktypeDefault);
        } else if (e['type'] === 'Image2D') {
        
        organizeAnswerObj(e, answer, checktypeDefault);
        }
         
    }
    
    return object_1;
}

export function Cartesian2D_getInfo(cart2d) {
    var cart2d_1 = JSON.parse(JSON.stringify(cart2d));
    var result = new Object();
    if (typeof cart2d_1['elements'] != 'undefined') {
        for (var obj of cart2d_1['elements']) {
            if (obj['locianOptions'] != null &&
                typeof obj['locianOptions'] != 'undefined' &&
                typeof obj['locianOptions']['check'] != 'undefined'&& 
                obj['locianOptions']['check']) {
                if (typeof result[obj['type']] == 'undefined') {
                    result[obj['type']] = [];
                }
                result[obj['type']].push(obj);
            }
        }
    }
    //console.log(result);
    
    if (typeof cart2d_1['locianOptions'] != 'undefined' &&
        typeof cart2d_1['locianOptions']['elementsAdded'] != 'undefined') {
        if (typeof result['Cartesian2D'] == 'undefined' ) {
            result['Cartesian2D'] = [];
        }
        result['Cartesian2D'].push({
            'elements': typeof cart2d_1['elements'] != 'undefined' ? cart2d_1['elements'] : [],
            'answers': cart2d_1['locianOptions']['elementsAdded']
        });
    }
    
    return result;
}

export function Cartesian2D_compPoint2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['Point2D'].entries()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            // maybe need to add code one day
        } else {
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i = inswer_1['Point2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {    
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compSegment2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['Segment2D'].entries()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            // maybe need to add code one day
        } else {
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i = inswer_1['Segment2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) { 
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compAngle2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['Angle2D'].entires()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            // maybe need to add code one day
        } else {
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i = inswer_1['Angle2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {    
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compArc2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['Arc2D'].entries()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            // maybe need to add code one day
        } else {
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i = inswer_1['Arc2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {    
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compPath2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['Path2D'].entries()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            // maybe need to add code one day
        } else {
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i = inswer_1['Path2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {    
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compMultiRegion2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k, v] of answer_1['MultiRegion2D'].entries()) {
        var a = v['locianOptions']['answer']['fill'];
        var i = inswer_1['MultiRegion2D'][k]['fill'];
        if (JSON.stringify(a) !== JSON.stringify(i)) {
            return false;
        }
    }
    
    return true;
}

export function Cartesian2D_compRegion2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    for (var [k ,v] of answer_1['Region2D'].entries()) {
        if (typeof v['locianOptions']['answer']['curves'] != 'undefined') {
            var a = v['locianOptions']['answer']['curves']['style']['dash'];
            var i = inswer_1['Region2D'][k]['curves'][0]['style']['dash'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
        
        if (typeof v['locianOptions']['answer']['fill'] != 'undefined') {
            var a = v['locianOptions']['answer']['fill'];
            var i = inswer_1['Region2D'][k]['fill'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
    }
    
    return true;
}

export function Cartesian2D_compCurve2D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    //console.log(JSON.stringify(answer_1, null, 4));
    //console.log(JSON.stringify(inswer_1, null, 4));
    for (var [k, v] of answer_1['Curve2D'].entries()) {
        //console.log(JSON.stringify(v, null, 4));
        if (v['locianOptions']['checkType'] === 'movable') {
            
            var eq = v['equation']
            var replace = {
                //'Math.pow': 'pow', 
                //'Math.sqrt': 'sqrt', 
                //'Math.log': 'log', 
                //'Math.': '', 
                'pi': 'Math.PI'
            };
            for (var [k_1, v_1] of Object.entries(replace)) {
                eq = eq.replaceAll(k_1, v_1);
            }
            
            var answer_eq = eq.split('=');
            
            var i_points = inswer_1['Curve2D'][k]['coords'];
            if (v['interaction']['movable'] === 'exponential') {
                
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll([' ', '']);
                if (inswer_eq.indexOf('=-') != -1) { 
                    i_points[2]['x'] = 10000 * ((i_points[0]['x'] < i_points[1]['x']) === (i_points[0]['y'] < i_points[1]['y']) ? 1 : -1);
                } else { 
                    i_points[2]['x'] = 10000 * ((i_points[0]['x'] < i_points[1]['x']) === (i_points[0]['y'] < i_points[1]['y']) ? -1 : 1);
                }
            } else if (v['interaction']['movable'] === 'logarithmic') {
                
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ', '');
                var base = inswer_eq.split('/Math.log(')[1];
                base = base.split(')')[0];
                if (parseFloat(base) > 1) {
                    i_points[0]['y'] = -Infinity;
                } else {
                    i_points[0]['y'] = Infinity;
                }
            } else if (v['interaction']['movable'] === 'square_root') { 
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ', '');
                //inswer_eq = inswer_eq.replaceAll('Math.', '');
                var a_points = v['locianOptions']['answer']['coords'];
                // check if the direction is the same 
                if (i_points[0]['x'] == a_points[0]['x'] && i_points[0]['y'] == a_points[0]['y']) {
                
                } else {
                    return false;
                }
            } else if (v['interaction']['movable'] === 'sine') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ', '');
                var replace = {
                    //'Math.sin': 'sin', 
                    // 'Math.': '', 
                     '--': '+', 
                     '+-': '-'
                };
                for (var [k_1, v_1] of Object.entries(replace)) {
                    inswer_eq = inswer_eq.replaceAll(k_1, v_1);
                }
    
                inswer_eq = inswer_eq.split('=');
                var a_points = v['locianOptions']['answer']['coords'];
                               
                for (var [ak, ap] of a_points.entries()) {
                    
                    replace = {
                        'x': '(' + ap['x'].toString() + ')', 
                        'y': '(' + ap['y'].toString() + ')'
                    };
                    
                    var equation = inswer_eq[0]; 
                    for (var [k_1, v_1] of Object.entries(replace)) {
                        equation = equation.replaceAll(k_1, v_1);
                    }
                    var inswer_eq_left = eval(equation);
                    
                    equation = inswer_eq[1];
                    for (var [k_1, v_1] of Object.entries(replace)) {
                        equation = equation.replaceAll(k_1, v_1);
                    }
                    var inswer_eq_right = eval(equation);
                
                    if (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2)) {
                        delete a_points[ak] ;
                    }
                }
                
                a_points = a_points.filter(Boolean);
                if (a_points.length != 0) {
                    return false;
                }
               
                i_points[0]['x'] = 0.5 * Math.PI * i_points[0]['x'];
                i_points[1]['x'] = 0.5 * Math.PI * i_points[1]['x'];
            } else if (v['interaction']['movable'] == 'tangent') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ','');
                var replace = {
                    //'Math.tan': 'tan', 
                    //'Math.': '', 
                    '--': '+', 
                    '+-': '-'
                }
                for (var [k_1, v_1] of Object.entries(replace)) {
                    inswer_eq = inswer_eq.replaceAll(k_1, v_1);
                }
                
                inswer_eq = inswer_eq.split('=');
                var a_points = v['locianOptions']['answer']['coords'];
                
                var firstP = a_points[0]['x'];
                for (var [ak, ap] of a_points.entries()) {
                    var check_dist = false;
                    
                    if (ak < 2) {
                        var replace = {
                            'x': '(' + ap['x'].toString() + ')', 
                            'y': '(' + ap['y'].toString() + ')'
                        };
                        var equation = inswer_eq[0];
                        for (var [k_1, v_1] of Object.entries(replace)) {
                            equation = equation.replaceAll(k_1, v_1);
                        }
                        var inswer_eq_left = eval(equation);
                        var equation  = inswer_eq[1];
                        for (var [k_1, v_1] of Object.entries(replace)) {
                            equation = equation.replaceAll(k_1, v_1);
                        }
                        var inswer_eq_right = eval(equation);
                        
                        if (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2)) {
                            check_dist = true;
                        }
                    } else {
                        var domain = inswer_1['Curve2D'][k]['domain']['x'][0];
                        var a_period;
                        if (ap['x'] > firstP) {
                            a_period = 2 * (ap['x'] - firstP);
                        } else {
                            a_period = 2 * (firstP - ap['x']);
                        }
                       
                        var asympArr = [];
                        var asymp = ap['x'];
                        asympArr.push(asymp); 
                        while (asymp >= domain['min']) {
                            asymp -= a_period;
                            asympArr.push(asymp);
                        } 
                        while (asymp <= domain['max']) {
                            asymp += a_period;
                            asympArr.push(asymp);
                        }
                        
                        if (asympArr.includes(i_points[2]['x'])) {
                            check_dist = true;
                        }
                    }
                    
                    if (check_dist) {
                        delete a_points[ak];
                    }
                }
                
                a_points = a_points.filter(Boolean);
                if (a_points.length != 0) { 
                    return false;
                }
                
                i_points[0]['x'] = 0.5 * Math.PI * i_points[0]['x'];
                i_points[1]['x'] = 0.5 * Math.PI * i_points[1]['x'];
                i_points[2]['y'] = null;
            }
            
            // check if the input curve is the same as the right curve
            
            for (var [ik, ip] of i_points.entries()) {
                if (ip['y'] == null) {
                    delete i_points[ik];
                    continue;
                }

                var replace = {
                    'x': '(' + ip['x'] + ')', 
                    'y': '(' + ip['y'] + ')',
                    //'abs': 'Math.abs',
                    //'pow': 'Math.pow',
                    //'sqrt': 'Math.sqrt'
                };
                var equation = answer_eq[0];
                for (var [k_1, v_1] of Object.entries(replace)) {
                    equation = equation.replaceAll(k_1, v_1);
                }
                //console.log(equation);
                var answer_eq_left = eval(equation);
                
                equation = answer_eq[1];
                //console.log(equation);
                for (var [k_1, v_1] of Object.entries(replace)) {
                    equation = equation.replaceAll(k_1, v_1);
                }
                //console.log(equation);
                var answer_eq_right = eval(equation);
                
                if (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2)) {
                    delete i_points[ik];
                }
            }
            
            i_points = i_points.filter(Boolean);
            if (i_points.length != 0) {
                return false;
            }
            
            
            // updated on 02/27/20
            // before this update, this export function saw y=? the same as x=?
            // also mischecked some graph types
            var sameTypeGraph = (v['equation'].indexOf('y') != -1) === (inswer_1['Curve2D'][k]['equation'].indexOf('y') != -1); 
            if (!sameTypeGraph) {
                return false;
            }
            
            // compare the domains
            if (inswer_1['Curve2D'][k]['interaction']['domain']) {
                
                var answer_x = v['locianOptions']['answer']['domain']['x'];
                var inswer_x = inswer['Curve2D'][k]['domain']['x'];
                if (answer_x[0]['min'] !== inswer_x[0]['min']) {
                    return false;
                }
                if (answer_x[0]['max'] !== inswer_x[0]['max']) {
                    return false;
                }
                        
                var answer_endPoints = v['locianOptions']['answer']['domain']['endpoints'];
                var inswer_endPoints = inswer['Curve2D'][k]['domain']['endpoints'];
                if (JSON.stringify(answer_endPoints['right']) !== JSON.stringify(inswer_endPoints['right'])) {
                    return false;
                }
                if (JSON.stringify(answer_endPoints['left']) !== JSON.stringify(inswer_endPoints['left'])) {
                    return false;
                }
            }
        } else {
            
            var a = v['locianOptions']['answer']['interaction']['selected'];
            var i  = inswer_1['Curve2D'][k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
    }
   
    return true;
}

export function Cartesian2D_compAdded(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    var a = answer_1['Cartesian2D'][0]['answers'];
    var i = inswer_1['Cartesian2D'][0]['elements'].slice(answer_1['Cartesian2D'][0]['elements'].length);
    //console.log(JSON.stringify(a, null, 4));
    //console.log(JSON.stringify(i, null, 4));
    var a_curves = [];
    var a_points = [];
    for (var item of a) {
        switch (item['type']) {
            case 'Curve2D':
                a_curves.push(item);
                break;
            
            case 'Point2D':
                a_points.push(item);
                break;
        }
    }
    
    var i_curves = [];
    var i_points = [];
    for (var [ik, item] of i.entries()) {
        switch (item['type']) {
            case 'Curve2D':
                i_curves.push(item);
                break;
            
            case 'Point2D':
                i_points.push(item);
                delete i[ik];
                break;
        }

    }
    
    // objects without Point2D
    i = i.filter(Boolean);
    
    if (a_curves.length !== i_curves.length) {
        return false;
    }
    //console.log(JSON.stringify(a, null, 4));
    //console.log(JSON.stringify(i, null, 4));
    // find exceptional points
    
    if (a_curves.length > 0 && a_points.length === 0 && i_points.length > 0) { 
        for (var [ak, ac] of a_curves.entries()) {
            var replace = {
                //'Math.pow': 'pow', 
                //'Math.sqrt': 'sqrt', 
                //'Math.log': 'log', 
                //'Math.sin': 'sin',
                //'Math.tan': 'tan', 
                //'Math.': '', 
                'pi': 'Math.PI'
            }
            
            var eq = ac['equation'];
            for (var [k, v] of Object.entries(replace)) {
                eq = eq.replaceAll(k, v);
            }
            var answer_eq = eq.split('=');
            
            // delete the points on the curves
            for (var [ik, ip] of i_points.entries()) {
                if (eq.indexOf('sin') != -1 || eq.indexOf('tan') != -1 || eq.indexOf('cos') != -1) {
                    ip['coords']['point']['x'] = 0.5 * Math.PI * ip['coords']['point']['x'];
                }
                
                var replace = {
                    'x': '(' + ip['coords']['point']['x'].toString() + ')', 
                    'y': '(' + ip['coords']['point']['y'].toString() + ')',
                    //'pow': 'Math.pow'
                }
                
                var equation = answer_eq[0];
                for (var [k, v] of Object.entries(replace)) {
                    equation = equation.replaceAll(k, v);
                }
                var answer_eq_left = eval(equation);
                
                equation = answer_eq[1];
                for (var [k, v] of Object.entries(replace)) {
                    equation = equation.replaceAll(k, v);
                }
                var answer_eq_right = eval(equation);
                
                // if the point is on the curve
                if (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2)) {
                    // check if the point is in the domain
                    var in_domain = true;
                    if (ac['interaction']['domain']) {
                        var x = [ac['domain']['x'][0]['min'], ac['domain']['x'][0]['max']];
                        var ep = [ac['domain']['endpoints']['left'], ac['domain']['endpoints']['right']];
                        if ((ep[0] === 'open' && ip['coords']['point']['x'] <= x[0]) || 
                            (ep[0] === 'closed' && ip['coords']['point']['x'] < x[0]) ||
                            (ep[1] === 'open' && ip['coords']['point']['x'] >= x[1]) ||
                            (ep[1] === 'closed' && ip['coords']['point']['x'] > x[1])) {
                            in_domain = false;
                        }
                    } 
                    if (in_domain) {
                        delete i_points[ik];
                    }
                }
            }
        }
    }
    
    // add remained points to the inswer
    i_points = i_points.filter(Boolean);
    i = i.concat(i_points);
    
    // compare the curves and regions
    //console.log(JSON.stringify(a, null, 4));
    //console.log(JSON.stringify(i, null, 4));
    for (var [ak, item] of a.entries()) {
        switch (item['type']) {
            case 'Point2D':
                a[ak] = 'P' + item['coords']['point']['x'] + ',' + item['coords']['point']['y'];
                break;
            
            case 'Curve2D':
                var replace = {
                    //'Math.pow': 'pow', 
                    //'Math.sqrt': 'sqrt', 
                    //'Math.log': 'log', 
                    //'Math.sin': 'sin', 
                    //'Math.tan': 'tan', 
                    //'Math.': '', 
                    'pi': 'Math.PI'
                };
                var eq = item['equation'];
                for (var [k, v] of Object.entries(replace)) {
                    eq = eq.replaceAll(k, v);
                }
                var answer_eq = eq.split('=');
                
                // compare the curves
                for (var [ik, iv] of i.entries()) {
                    if (!iv['coords']) {
                        continue;
                    }
                    
                    var in_curve = true;
                    
                    // rewrite the equation
                    if (iv['interaction']['movable'] === 'exponential') {
                        if (iv['equation'].replaceAll(' ', '').indexOf('=-') != -1) {
                            iv['coords'][2]['x'] = 10000 * ((iv['coords'][0]['x'] < iv['coords'][1]['x']) === (iv['coords'][0]['y'] < iv['coords'][1]['y']) ? 1 : -1);
                        } else {
                            iv['coords'][2]['x'] = 10000 * ((iv['coords'][0]['x'] < iv['coords'][1]['x']) === (iv['coords'][0]['y'] < iv['coords'][1]['y']) ? -1 : 1);
                        }
                    } else if (iv['interaction']['movable'] === 'logarithmic') {
                        var iv_eq = iv['equation'].replaceAll(' ', '');
                        var base = iv_eq.split('/Math.log(')[1];
                        base = base.split(')')[0];
                        if (base > 1) {
                            iv['coords'][0]['y'] = -Infinity;
                        } else {
                            iv['coords'][0]['y'] = Infinity;
                        }
                    } else if (iv['interaction']['movable'] === 'square_root') {
                        
                        var iv_eq = iv['equation'].replaceAll(' ', '');
                        var replace = {
                            //'pow': 'Math.pow', 
                            //'sqrt': 'Math.sqrt', 
                            //'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of Object.entries(replace)) {
                            iv_eq = iv_eq.replaceAll(k, v);
                        }
                        var iv_eq_terms = iv_eq.split('=');
                        var gapX = iv['coords'][1]['x'] - iv['coords'][0]['x'];
                        var gapY = iv['coords'][1]['y'] - iv['coords'][0]['y'];
                        var nX;
                        var nY;
                        if (gapX > 0 && gapY > 0) {
                            nX = iv['coords'][1]['x'] + 1;
                        } else if (gapX > 0 && gapY < 0) {
                            nX = iv['coords'][1]['x'] + 1;
                        } else if (gapX < 0 && gapY > 0) {
                            nX = iv['coords'][1]['x'] - 1;
                        } else {
                            nX = iv['coords'][1]['x'] - 1;
                        }
                        
                        var term = iv_eq_terms[1].replaceAll('x', '(' + nX.toString() + ')');
                        
                        nY = eval(term);
                       
                        iv['coords'][2] = {
                                'x': nX, 
                                'y': nY 
                        };
                    } else if (iv['interaction']['movable'] === 'sine') {
                        var iv_eq = iv['equation'].replaceAll(' ',  '');
                        var replace = {
                            //'Math.sin': 'sin', 
                            //'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of Object.entries(replace)) {
                            iv_eq = iv_eq.replaceAll(k, v);
                        }
                        var iv_eq_terms = iv_eq.split('=');
                        
                        var av = item['coords'];
                        for (var c of av) {
                            var replace = {
                                'x': '(' + c['x'].toString() +')', 
                                'y': '(' + c['y'].toString() +')'
                            };
                            ;
                            var eq = iv_eq_terms[0];
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var inswer_eq_left = eval(eq);
                            
                            eq = iv_eq_terms[1];
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var inswer_eq_right = eval(eq);
                            in_curve &= (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2));
                        }
                        
                        iv['coords'][0]['x'] = 0.5 * Math.PI * iv['coords'][0]['x'];
                        iv['coords'][1]['x'] = 0.5 * Math.PI * iv['coords'][1]['x'];
                    } else if (iv['interaction']['movable'] === 'tangent') {
                        var iv_eq = iv['equation'].replaceAll(' ', '');
                        var replace = {
                            //'Math.tan': 'tan', 
                            //'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of Object.entries(replace)) {
                            iv_eq = iv_eq.replaceAll(k, v);
                        }
                        
                        var iv_eq_terms = iv_eq.split('=');
                        
                        var av = item['coords'];
                        for (var [k, c] of av.entries()) {
                            if (k < 2) {
                                var replace = {
                                    'x': '(' + c['x'].toString() + ')', 
                                    'y': '(' + c['y'].toString() + ')'
                                }
                                var eq = iv_eq_terms[0];
                                for (var [k_1, v_1] of Object.entries(replace)) {
                                    eq = eq.replaceAll(k_1, v_1);
                                }
                                var inswer_eq_left = eval(eq);
                                ;
                                eq = iv_eq_terms[1];
                                for (var [k_1, v_1] of Object.entries(replace)) {
                                    eq = eq.replaceAll(k_1, v_1);
                                }
                                var inswer_eq_right = eval(eq);
                                
                                in_curve &= (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2));
                            } else {
                                var domain = iv['domain']['x'][0];
                                var answer_period;
                                if (c['x'] > av[0]['x']) { 
                                    answer_period = 2*(c['x']-av[0]['x']);
                                } else {
                                    answer_period = 2*(av[0]['x']-c['x']);
                                }
                                
                                var asympArr = [];
                                var asymp = c['x'];
                                asympArr.push(asymp);
                                while (asymp >= domain['min']) {
                                    asymp -= answer_period;
                                    asympArr.push(asymp);
                                }
                                while (asymp <= domain['max']) {
                                    asymp += answer_period;
                                    asympArr.push(asymp);
                                }
                                
                                in_curve &= asympArr.includes(iv['coords'][2]['x']);
                                
                            }
                        }
                        
                        iv['coords'][0]['x'] = 0.5 * Math.PI * iv['coords'][0]['x'];
                        iv['coords'][1]['x'] = 0.5 * Math.PI * iv['coords'][1]['x'];
                        iv['coords'][2]['y'] = null;
                    }
                
                    var coords = iv['coords'];  
                    
                    
                    
                    for (var [k, c] of Object.entries(coords)) {
                        if (c['y'] != null) {
                            var replace = {
                                'x': '(' + c['x'].toString() + ')', 
                                'y': '(' + c['y'].toString() + ')',
                                //'pow': "Math.pow"
                            };

                            var eq = answer_eq[0];
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var answer_eq_left = eval(eq);
                            eq = answer_eq[1];
                            
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var answer_eq_right = eval(eq);
                            
                            in_curve &= (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2));
                        } 
                    }
                    
                    if (iv['interaction']['domain']) {
                        ['endpoints'];
                        in_curve &= item['domain']['x'][0]['min'] == iv['domain']['x'][0]['min'];
                        in_curve &= item['domain']['x'][0]['max'] == iv['domain']['x'][0]['max'];
                        in_curve &= item['domain']['endpoints']['right'] == iv['domain']['endpoints']['right'];
                        in_curve &= item['domain']['endpoints']['left'] == iv['domain']['endpoints']['left'];
                        
                        if (item['interaction']['movable'] === 'rational' || iv['interaction']['movable'] === 'rational') {// added on 10/26/21
                            in_curve &= item['interaction']['movable'] === iv['interaction']['movable'];
                        }
                    }
                    
                    // before this update, this export function saw y=? the same as x=?
                    // also mischecked some graph types
                    if (typeof iv['equation'] != 'undefined') {
                        
                        
                        in_curve &= (item['equation'].indexOf('sin') != -1 || item['equation'].indexOf('cos') != -1) === (iv['equation'].indexOf('sin') != -1);
                        
                        in_curve &= (item['equation'].indexOf('tan') != -1) === (iv['equation'].indexOf('tan') != -1);
                        in_curve &= (item['equation'].indexOf('abs') != -1) === (iv['equation'].indexOf('abs') != -1);
                        in_curve &= (item['equation'].indexOf('pow') != -1) === (iv['equation'].indexOf('pow') != -1);
                        in_curve &= (item['equation'].indexOf('sqrt') != -1) === (iv['equation'].indexOf('sqrt') != -1); // added on 02/14/20
                        in_curve &= (item['equation'].indexOf('log') != -1) === (iv['equation'].indexOf('log') != -1); // added on 10/22/20
                        in_curve &= (item['equation'].indexOf('y') != -1) === (iv['equation'].indexOf('y') != -1); // added on 02/17/20
                    }
                    
                    if (in_curve) {
                        a[ak] = true;
                        i[ik] = true;
                        break;
                    }
                }
                break;
            
            case 'Region2D':
                if (item['curves'][0]['style']['dash'] !== i[ak]['curves'][0]['style']['dash']) {
                    return false;
                }
                if (JSON.stringify(item['fill']) !== JSON.stringify(i[ak]['fill'])) {
                    return false;
                }
                          
                var answer_eq = item['curves'][0]['equation'].split('=');
                for (var [ik, iv] of i.entries()) {
                    if (!iv['curves'][0]['coords']) {
                        continue;
                    }
                    
                    var coords = iv['curves'][0]['coords'];
                    
                    // rational: compare the middle point and delete
                    // later
                    
                    var in_curve = true;
                    
                    for (var c of coords) {
                        var replace = {
                            'x': '(' + c['x'].toString() + ')', 
                            'y': '(' + c['y'].toString() + ')', 
                            //'Math.pow': 'pow', 
                            //'Math.sqrt': 'sqrt', 
                            //'Math.': ''
                        }
                        var eq = answer_eq[0];
                        for (var [k, v] of Object.entries(replace)) {
                            eq = eq.replaceAll(k, v);
                        }
                        var answer_eq_left = eval(eq);
                        
                        eq = answer_eq[1];
                        for (var [k, v] of Object.entries(replace)) {
                            eq = eq.replaceAll(k, v);
                        }
                        var answer_eq_right = eval(eq);
                        
                        in_curve &= (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2));
                    }
                    
                    // updated on 02/27/20
                    // before this update, this export function saw y=? the same as x=?
                    // also mischecked some graph types
                    in_curve &= (item['curves'][0]['equation'].indexOf('abs') != -1) === (iv['curves'][0]['equation'].indexOf('abs') != -1);
                    in_curve &= (item['curves'][0]['equation'].indexOf('pow') != -1) === (iv['curves'][0]['equation'].indexOf('pow') != -1);
                    in_curve &= (item['curves'][0]['equation'].indexOf('sqrt') != -1) === (iv['curves'][0]['equation'].indexOf('sqrt') != -1);
                    
                    in_curve &= (item['curves'][0]['equation'].indexOf('y') != -1) === (iv['curves'][0]['equation'].indexOf('y') != -1);
                    
                    if (in_curve) {
                        a[ak] = true;
                        i[ak] = true;
                        continue;
                    }
                }
                break;
            
            case 'MultiRegion2D':
                for (var [rk, rv] of item['regions'].entries()) {
                    var answer_eq = rv['curves'][0]['equation'].split('=');
                    for (var [ik, iv] of i[ak]['regions'].entries()) {
                        if (typeof iv['curves'] == 'undefined' || 
                            !iv['curves'][0]['coords']) {
                            continue;
                        }
                        
                        var coords = iv['curves'][0]['coords'];
                        var in_curve = true;
                        for (var c of coords) {
                            var replace = {
                                'x': '(' + c['x'].toString() + ')', 
                                'y': '(' + c['y'].toString() + ')', 
                                //'Math.pow': 'pow', 
                                //'Math.sqrt': 'sqrt', 
                                //'Math.': ''
                            };
                            ;
                            var eq = answer_eq[0];
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var answer_eq_left = eval(eq);
                            eq = answer_eq[1];
                            for (var [k, v] of Object.entries(replace)) {
                                eq = eq.replaceAll(k, v);
                            }
                            var answer_eq_right = eval(eq);
                            in_curve &= Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2);
                            in_curve &= rv['curves'][0]['style']['dash'] == iv['curves'][0]['style']['dash'];
                            in_curve &= a[ak]['fill'][0][rk] == i[ak]['fill'][0][ik];
                        }
                        
                        // updated on 02/27/20
                        // before this update, this export function saw y=? the same as x=?
                        // also mischecked some graph types
                        in_curve &= (rv['curves'][0]['equation'].indexOf('abs') != -1) === (iv['curves'][0]['equation'].indexOf('abs') != -1);
                        in_curve &= (rv['curves'][0]['equation'].indexOf('pow') != -1) === (iv['curves'][0]['equation'].indexOf('pow') != -1);
                        in_curve &= (rv['curves'][0]['equation'].indexOf('sqrt') != -1) === (iv['curves'][0]['equation'].indexOf('sqrt') != -1);
                        in_curve &= (rv['curves'][0]['equation'].indexOf('y') != -1) === (iv['curves'][0]['equation'].indexOf('y') != -1);
                        
                        if (in_curve) {
                            a[ak]['regions'][rk] = true;
                            i[ak]['regions'][ik] = true;
                            a[ak]['fill'][0][rk] = true;
                            i[ak]['fill'][0][ik] = true;
                            continue;
                        }
                    }
                }
                break;
        }
    }
    
    a.sort();
    for (var [ik, item] of i.entries()) {
        switch (item['type']) {
            case 'Point2D':
                //console.log(item);
                i[ik] = 'P' + item['coords']['point']['x'] + ','  + item['coords']['point']['y'];
                break;
        }
    }
    //console.log(JSON.stringify(a, null, 4));
    //console.log(JSON.stringify(i, null, 4));
    
    if (JSON.stringify(a) !== JSON.stringify(i)) {
        
        return false;
    }
    
    return true;
}


var object = {
    "type": "Cartesian2D",
    "grid": {
        "type": "Grid2D",
        "normal": {
            "unit": {
                "x": 1,
                "y": 1
            },
            "offset": {
                "x": [
                    
                ],
                "y": [
                    
                ]
            },
            "color": {
            
            }
        },
        "strong": {
            "color": {
                "code": -1
            }
        },
      " labels": {
            "unit": {
                "x": 2,
                "y": 2
            },
            "showZero": true
        }   
    },
    "bounds": {
        "x": {
            "min": -6,
            "max": 6
        },
        "y": {
            "min": -6,
            "max": 6
        }
    },
    "axis": {
        "type": "Axis2D",
        "style": {
            "x": {
                "color": {
                    "code": 0
                },
                "arrow": {
                    "start": true,
                    "end": true
                },
                "offset": {
                    "start": false,
                    "end": false
                }
            },
            "y": {
                "color": {
                    "code": 0
                },
                "arrow": {
                    "start": true,
                    "end": true
                },
                "offset": {
                    "start": false,
                    "end": false
                }
            }
        },
        "labels": {
            "x": {
                "type": "Math",
                "content": "x",
                    "font": {
                        "size": 1
                    }
                },
            "y": {
                "type": "Math",
                "content": "y",
                "font": {
                    "size": 1
                }
            },
            "origin": {
            "type": "Math",
                "content": ""
            }
        }
    },
    "elements": [
        {
            "type": "Curve2D",
            "equation": "y=0-1*(x-5)",
            "style": {
                "color": {
                    "code": 4,
                    "weight": "normalHard"
                },
                "dash": "none",
                "arrow": true
            },
            "domain": {
                "visible": true
            },
            "interaction": {
                "movable": "none"
            }
        }
    ],
    "menu": [
        "point",
        "linear",
        "absolute",
        "quadratic",
        "exponential",
        "rational",
        "square_root",
        "sine"
    ],
    "menuOptions": {
        "templates": {
            "point": {
                "type": "Point2D",
                "coords": {
                    "point": {
                        "x": 0,
                        "y": 0
                    }
                },
                "interaction": {
                    "selected": true,
                    "movable": true,
                    "removable": true,
                    "selectable": true,
                    "fill": false
                }
            },
            "curve": {
                "type": "Curve2D",
                "interaction": {
                    "selected": true,
                    "selectable": "single",
                    "removable": true,
                    "movable": "none",
                    "domain": false
                },
                "style": {
                    "color": {
                        "code": 1,
                        "weight": "normalHard"
                    },
                    "dash": "none",
                    "arrow": true
                },
                "category": "Cartesian2D",
                "equation": "y=x",
                "asymptotes": {
                    "hor": [
                    
                    ],
                    "ver": [
                    
                    ]
                },
                "domain": {
                    "mode": "none",
                    "visible": false,
                    "endpoints": {
                        "left": "open",
                        "right": "open"
                    },
                    "x": [
                        {
                            "min": -6,
                            "max": 6
                        }
                    ],
                    "y": [
                        {
                            "min": -6,
                            "max": 6
                        }
                    ]
                },
                "coords": [
                    {
                        "x": 0,
                        "y": 0
                    }
                ]
            }
        }
    },
    "size": 0.9,
    "locianOptions": {
        "elementsAdded": [
            {
                "type": "Curve2D",
                "equation": "y=0+1*(x-3)",
                "style": {
                    "color": {
                    "code": 0,
                        "weight": "normalHard"
                    },
                    "dash": "none",
                    "arrow": true
                },
                "domain": {
                    "visible": true
                },
                "interaction": {
                    "movable": "none"
                }
            }
        ]
    }
}
