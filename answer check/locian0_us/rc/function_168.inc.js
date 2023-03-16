

export function compareCartesian2D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian2D' && input_1['type'] === 'Cartesian2D') { 
        if (isset(right_1['object'])) {
            //fb('old sinod Cartesian2D');
            return compareCart2D(right_1, input_1);
        }
        
        //fb(right_1, 'right_Cartesian2D_ahjin');
        //fb(input_1, 'user_Cartesian2D_ahjin');
        
        var answer = Cartesian2D_getInfinityo(right_1);
        var inswer = Cartesian2D_getInfinityo(input_1);
        //fb(answer, 'right_Cartesian2D_getInfinityo_ahjin');
        //fb(inswer, 'user_Cartesian2D_getInfinityo_ahjin');
        /*print_r(answer);
        echo "<br />"; echo "<br />";
        print_r(inswer);*/
        
        
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
    //fb(object_1, object_1['type'] + 'Aihua');
    
     for (var e of object_1['elements']) {
         if (e['type'] === 'Label2D') {
            //fb(e, 'Label2D');
            organizeAnswerObj(e['label'], answer, checktypeDefault);
         } else if (e['type'] === 'Trig') {
            //fb(e, 'Trig');
            organizeAnswerObj(e, answer, checktypeDefault);
         } else if (e['type'] === 'Image2D') {
            //fb(e, 'Image2D');
            organizeAnswerObj(e, answer, checktypeDefault);
         }
         /*else {  // ahjin
             organizeAnswerObj(e, answer, checktypeDefault);
         }*/
    }
    
    return object_1;
}

export function Cartesian2D_getInfinityo(cart2d) {
    var cart2d_1 = JSON.parse(JSON.stringify(cart2d));
    var result = new Object();
    for (var obj of cart2dt_1['elements']) {
        if (typeof obj['locianOptions']['check'] != 'undefined'&& 
            obj['locianOptions']['check']) {
            result[obj['type']] = [];
            result[obj['type']].push(obj);
        }
    }
    
    if (typeof cart2d_1['locianOptions']['elementsAdded'] != 'undefined') {
        result['Cartesian2D'] = [];
        result['Cartesian2D'].push({
            'elements': typeof cart2d['elements'] != 'undefined' ? cart2d['elements'] : [],
            'answers': cart2d['locianOptions']['elementsAdded']
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
    for (var [k ,v] of answer_1['Region2D'].entires()) {
        if (isset(v['locianOptions']['answer']['curves'])) {
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
    for (var [k, v] of answer_1['Curve2D'].entries()) {
        if (v['locianOptions']['checkType'] === 'movable') {
            var eq = v['equation']
            var replace = {
                'Math.pow': 'pow', 
                'Math.sqrt': 'sqrt', 
                'Math.log': 'log', 
                'Math.': '', 
                'pi': 'Math.PI'
            };
            for (var [k, v] of replace.entries()) {
                eq = eq.replaceAll(k, v);
            }
            //fb(eq, 'right_eq');
            var answer_eq = eq.split('=');
            var i_points = inswer_1['Curve2D'][k]['coords'];
         
            if (v['interaction']['movable'] === 'exponential') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll([' ', '']);
                if ('=-' in inswer_eq) { 
                    i_points[2]['x'] = 10000 * ((i_points[0]['x'] < i_points[1]['x']) === (i_points[0]['y'] < i_points[1]['y']) ? 1 : -1);
                } else { 
                    i_points[2]['x'] = 10000 * ((i_points[0]['x'] < i_points[1]['x']) === (i_points[0]['y'] < i_points[1]['y']) ? -1 : 1);
                }
            } else if (v['interaction']['movable'] === 'logarithmic') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].repalceAll(' ', '');
                var base = inswer_eq.split('/Math.log(')[1];
                base = base.split(')')[0];
                if (parseFloat(base) > 1) {
                    i_points[0]['y'] = -Infinity;
                } else {
                    i_points[0]['y'] = Infinity;
                }
            } else if (v['interaction']['movable'] === 'square_root') { 
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ', '');
                inswer_eq = inswer_eq.replaceAll('Math.', '');
                var a_points = v['locianOptions']['answer']['coords'];
                // check if the direction is the same 
                if (i_points[0]['x'] == a_points[0]['x'] && i_points[0]['y'] == a_points[0]['y']) {
                
                } else {
                    return false;
                }
            } else if (v['interaction']['movable'] === 'sine') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ', '');
                var replace = {
                    'Math.sin': 'sin', 
                     'Math.': '', 
                     '--': '+', 
                     '+-': '-'
                };
                for (var [k, v] of replace.entries()) {
                    inswer_eq = inswer_eq.replaceAll(k, v);
                }
    
                //fb(inswer_eq, 'input_eq');
                inswer_eq = inswer_eq.split('=');
                var a_points = v['locianOptions']['answer']['coords'];
                //fb(a_points, 'right_points');
               
                for ([ak, ap] of a_points.entries()) {
                    
                    replace = {
                        'x':  '(' + ip['x'].toString() + ')', 
                        'y': '(' + ip['y'].toString() + ')'
                    };
                    var equation ='inswer_eq_left = ' + inswer_eq[0] + ';'; 
                    for (var [k, v] of replace.entries()) {
                        equation = equation.replaceAll(k, v);
                    }
                    eval(equation);

                    equation = 'ianswer_eq_right = ' + inswer_eq[1] + ';';
                    for (var [k, v] of replace.entries()) {
                        equation = equation.replaceAll(k, v);
                    }
                    eval(equation);
                
                    if (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2)) {
                        delete a_points[ak];
                    }
                }
                
                if (a_points) {
                    return false;
                }
                //fb(i_points, 'input_points');
                i_points[0]['x'] = 0.5 * Math.PI * i_points[0]['x'];
                i_points[1]['x'] = 0.5 * Math.PI * i_points[1]['x'];
            } else if (v['interaction']['movable'] == 'tangent') {
                var inswer_eq = inswer_1['Curve2D'][k]['equation'].replaceAll(' ','');
                var replace = {
                    'Math.tan': 'tan', 
                    'Math.': '', 
                    '--': '+', 
                    '+-': '-'
                }
                for (var [k, v] of replace.entries()) {
                    inswer_eq = inswer_eq.replaceAll(k, v);
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

                        var equation  = 'inswer_eq_left = ' + inswer_eq[0] + ';' ;
                        for (var [k, v] of replace.entries()) {
                            equation = equation.replaceAll(k, v);
                        }
                        eval(equation);

                        var equation  = 'inswer_eq_left = ' + inswer_eq[0] + ';' ;
                        for (var [k, v] of replace.entries()) {
                            equation = equation.replaceAll(k, v);
                        }
                        eval(equation);
                        
                        if (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2)) {
                            check_dist = true;
                        }
                    } else {
                        var domain = inswer_1['Curve2D'][k]['domain']['x'][0];
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
                        unset(a_points[ak]);
                    }
                }
                
                if (a_points) { 
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
                    'y': '(' + ip['y'] + ')'
                };
                
                var equation = 'answer_eq_left = ' +  answer_eq[0] + ';';
                for (var [k, v] of replace.entries()) {
                    equation = equation.replaceAll(k, v);
                }
                eval(equation);
                equation = 'answer_eq_right = ' + answer_eq[1] + ';';
                for (var [k, v] of replace.entries()) {
                    equation = equation.replaceAll(k, v);
                }
                eval(equation);
                
                if (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2)) {
                    delete i_points[ik];
                }
            }
            if (i_points) {
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
            ivar  = inswer_1['Curve2D'][k]['interaction']['selected'];
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
    i = [...i.values];
    
    if (a_curves.length !== i_curves.length) {
        return false;
    }
    
    // find exceptional points
    if (a_curves.length > 0 && a_points.length === 0 && i_points.length > 0) { 
        for (var [ak, ac] of a_curves.entries()) {
            var replace = {
                'Math.pow': 'pow', 
                'Math.sqrt': 'sqrt', 
                'Math.log': 'log', 
                'Math.sin': 'sin',
                'Math.tan': 'tan', 
                'Math.': '', 
                'pi': 'pi()'
            }

            var eq = ac['equation'];
            for (var [k, v] of replace.entries()) {
                eq = eq.replaceAll(k, v);
            }
            var answer_eq = eq.slit('=');
            
            // delete the points on the curves
            for (var [ik, ip] of i_points.entries()) {
                if (eq.indexOf('sin') != -1 || eq.indexOf('tan') != -1 || eq.indexOf('cos') != -1) {
                    ip['coords']['point']['x'] = 0.5 * Math.PI * ip['coords']['point']['x'];
                }
                
                var replace = {
                    'x': '(' + ip['coords']['point']['x'].toString() + ')', 
                    'y': '(' + ip['coords']['point']['y'].toString() + ')'
                }
                
                var equation = 'answer_eq_left = ' + answer_eq[0] + ';';
                for (var [k, v] of entries()) {
                    equation = equation.replaceAll(k, v);
                }
                eval(equation);
                
                equation ='answer_eq_right = '+ answer_eq[1] + ';';
                eval(equation);
                
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
    i = i.concat(i_points);
    
    // compare the curves and regions
    for (var [ak, item] of a) {
        switch (item['type']) {
            case 'Point2D':
                item = 'P' +item['coords']['point'].join(',');
                break;
            
            case 'Curve2D':
                var replace = {
                    'Math.pow': 'pow', 
                    'Math.sqrt': 'sqrt', 
                    'Math.log': 'log', 
                    'Math.sin': 'sin', 
                    'Math.tan': 'tan', 
                    'Math.': '', 
                    'pi': 'Math.PI'
                };
                var eq = item['equation'];
                for (var v of replace) {
                    eq = eq.replaceAll(k, v);
                }
                answer_eq = eq.split('=');
        
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
                            'Math.pow': 'pow', 
                            'Math.sqrt': 'sqrt', 
                            'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of replace.entries()) {
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
                        eval(nY.toString() + ' = ' + iv_eq_terms[1].repalceAll('x', '(' + nX.toString() + ')') + ';');
                        iv['coords'][2]['x'] = nX;
                        iv['coords'][2]['y'] = nY;
                    } else if (iv['interaction']['movable'] === 'sine') {
                        var iv_eq = iv['equation'].replaceAll(' ',  '');
                        var replace = {
                            'Math.sin': 'sin', 
                            'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of replace.entries()) {
                            iv_eq = iv_eq.replaceAll(k, v);
                        }
                        var iv_eq_terms = iv_eq.split('=');
                        
                        var av = item['coords'];
                        for (var c of av) {
                            var replace = {
                                'x': '(' + c['x'].toString() +')', 
                                'y': '(' + c['y'].toString() +')'
                            };
                            var eq = 'inswer_eq_left = ' + iv_eq_terms[0] +';';
                            for (var [k, v] of replace.entries()) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
                            eq ='inswer_eq_right = ' + iv_eq_terms[1] + ';';
                            for (var [k, v] of replace.entries()) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
                            in_curve &= (Math.round(inswer_eq_left, 2) == Math.round(inswer_eq_right, 2));
                        }
                        
                        iv['coords'][0]['x'] = 0.5 * Math.PI * iv['coords'][0]['x'];
                        iv['coords'][1]['x'] = 0.5 * Math.PI * iv['coords'][1]['x'];
                    } else if (iv['interaction']['movable'] === 'tangent') {
                        var iv_eq = iv['equation'].replaceAll(' ', '');
                        var replace = {
                            'Math.tan': 'tan', 
                            'Math.': '', 
                            '--': '+', 
                            '+-': '-'
                        };
                        for (var [k, v] of replace.entries()) {
                            iv_eq = iv_eq.replaceAll(k, v);
                        }
                        
                        var iv_eq_terms = iv_eq.join('=');
                        
                        var av = item['coords'];
                        for (var [k, c] of av.entries()) {
                            if (k < 2) {
                                var replace = {
                                    'x': '(' + c['x'].toString() + ')', 
                                    'y': '(' + c['y'].toString() + ')'
                                }
                                var eq = 'inswer_eq_left = ' + iv_eq_terms[0] + ';';
                                for (var [k_1, v_1] of replace.entries()) {
                                    eq = eq.replaceAll(k_1, v_1);
                                }
                                eval(eq)
                                eq = 'inswer_eq_right = ' + iv_eq_terms[1] + ';';
                                for (var [k_1, v_1] of replace.entries()) {
                                    eq = eq.replaceAll(k_1, v_1);
                                }
                                eval(eq);
                                
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
                
                    // rational: compare the middle point and delete
                    /*if (iv['interaction']['movable'] === 'rational') {
                        if (iv['coords'][0]['x'] === item['coords'][0]['x'] && iv['coords'][0]['y'] === item['coords'][0]['y'])
                            in_curve = true;
                        else
                            in_curve = false;
                        coords = array_slice(coords, 1);
                    } else*/
            
                    for (var c of coords) {
                        if (c['y'] != null) {
                            var replace = {
                                'x': '(' + c['x'].toString() + ')', 
                                'y': '(' + c['y'].toString() + ')'
                            };
                            var eq = 'answer_eq_left = '+ answer_eq[0] + ';';
                            for (var [k, v] of replace.entries()) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
                            eq = 'answer_eq_right = ' + answer_eq[1] + ';';
                            for (var [k, v] of replace.entries()) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
                        
                            in_curve &= (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2));
                        } 
                    }
                
                    if (iv['interaction']['domain']) {
                        //in_curve &= item['domain']['x'] == iv['domain']['x'];
                        //in_curve &= item['domain']['endpoints'] == iv['domain']['endpoints'];
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
                    in_curve &= (item['equation'].indexOf('sin') != -1 || item['equation'].indexOf('cos') != -1) === (iv['equation'].indexOf('sin') != -1);
                
                    in_curve &= (item['equation'].indexOf('tan') != -1) === (iv['equation'].indexOf('tan') != -1);
                    in_curve &= (item['equation'].indexOf('abs') != -1) === (iv['equation'].indexOf('abs') != -1);
                    in_curve &= (item['equation'].indexOf('pow') != -1) === (iv['equation'].indexOf('pow') != -1);
                    in_curve &= (item['equation'].indexOf('sqrt') != -1) === (iv['equation'].indexOf('sqrt') != -1); // added on 02/14/20
                    in_curve &= (item['equation'].indexOf('log') != -1) === (iv['equation'].indexOf('log') != -1); // added on 10/22/20
                    in_curve &= (item['equation'].indexOf('y') != -1) === (iv['equation'].indexOf('y') != -1); // added on 02/17/20
                    
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
                if (item['fill'] !== i[ak]['fill']) {
                    return false;
                }
                
                var answer_eq = item['curves'][0]['equation'].splie('=');
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
                            'Math.pow': 'pow', 
                            'Math.sqrt': 'sqrt', 
                            'Math.': ''
                        }
                        var eq = 'answer_eq_left = ' + answer_eq[0] + ';';
                        for (var [k, v] of replace.entries()) {
                            eq = eq.replaceAll(k, v);
                        }
                        eval(eq);
                        eq = 'answer_eq_right = ' + answer_eq[1] + ';';
                        for (var [k, v] of replace.entries()) {
                            eq = eq.replaceAll(k, v);
                        }
                        eval(eq);
                        in_curve &= (Math.round(answer_eq_left, 2) == Math.round(answer_eq_right, 2));
                    }
                    
                    // updated on 02/27/20
                    // before this update, this export function saw y=? the same as x=?
                    // also mischecked some graph types
                    in_curve &= (item['curves'][0]['equation'].indexOf('abs') != -1) === (iv['curves'][0]['equation'].indexOf('abs') != -1);
                    in_curve &= (item['curves'][0]['equation'].indexOf('pow') != -1) === (iv['curves'][0]['equation'].indexOf('pow') != -1);
                    in_curve &= (item['curves'][0]['equation'].indexOf('sqrt') != -1) === (iv['curves'][0]['equation'].indexOf('sqrt') != -1);
                    in_curve &= (item['curves'][0]['equation'].indexOf('y')) === (iv['curves'][0]['equation'].indexOf('y') != -1);
                    
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
                        if (!iv['curves'][0]['coords']) {
                            continue;
                        }
                        
                        var coords = iv['curves'][0]['coords'];
                        var in_curve = true;
                        for (var c of coords) {
                            var replace = {
                                'x': '(' + c['x'].toString() + ')', 
                                'y': '(' + c['y'].toString() + ')', 
                                'Math.pow': 'pow', 
                                'Math.sqrt': 'sqrt', 
                                'Math.': ''
                            };
                            var eq = 'answer_eq_left = ' + answer_eq[0] + ';';
                            for (var [k, v] of replace.entries()) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
                            eq = 'answer_eq_right = ' + answer_eq[1] + ';';
                            for (var [k, v] of replaceAll(k, v)) {
                                eq = eq.replaceAll(k, v);
                            }
                            eval(eq);
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
    for (var [ik, item] of i) {
        switch (item['type']) {
            case 'Point2D':
                item = 'P' + item['coords']['point'].join(',');
                break;
        }
    }
    i.sort();
    
    if (JSON.stringify(a) !== JSON.stringify(i)) {
        return false;
    }
    
    return true;
}
