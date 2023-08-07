


import {organizeAnswerObj} from '../rc/functions.js';

export function compareCartesian1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian1D' && input_1['type'] === 'Cartesian1D') {
      
        
        var answer = Cartesian1D_getInfo(right_1);
        var inswer = Cartesian1D_getInfo(input_1);
       
        if (typeof answer['Partition1D'] != 'undefined') {
            var a = answer['Partition1D'][0]['locianOptions']['answer']['fill'];
            var i = inswer['Partition1D'][0]['fill'];
            a.sort();
            i.sort();
            
            if (JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
        
        if (typeof answer['Point1D'] != 'undefined') {
            if (!Cartesian1D_compPoint1D(answer, inswer)) {

                return false;
            }
        }
        
        if (typeof answer['InEq1D'] != 'undefined') { 
            if (!Cartesian1D_compInEq1D(answer, inswer)) {
                return false;
            }
        }
        
        if (typeof answer['CompInEq1D'] != 'undefined') {
            if (!Cartesian1D_compCompInEq1D(answer, inswer)) {
                return false;
            }
        }
        
        return true;
    }

    return false;
}

export function Cartesian1D_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Cartesian1D') {
        return object_1;
    }
    
    for (var e of object_1['elements']) {
        organizeAnswerObj(e, answer, checktypeDefault_1);
    }
    
    return object_1;
}

export function Cartesian1D_getInfo(cart1d) {
    var cart1d_1 = JSON.parse(JSON.stringify(cart1d));
    var result = new Object();
    
    for (var object of cart1d_1['elements']) {
        if (typeof object['locianOptions'] == 'undefined' || 
            (typeof object['locianOptions'] != 'undefined' &&
            (typeof object['locianOptions']['check'] == 'undefined' || !object['locianOptions']['check']))) {
            continue;
        }
        
        if (typeof result[object['type']] == 'undefined') {
            result[object['type']] = [];
        }
        result[object['type']].push(object);
    }
    
    return result;
}

export function Cartesian1D_compPoint1D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    var ap_selected = [];
    var ap_movable = [];
    for (var ap of answer_1['Point1D']) {
        if (typeof ap['locianOptions'] != 'undefined' &&
            typeof ap['locianOptions']['answer'] != 'undefined' &&
            typeof ap['locianOptions']['answer']['checkType'] != 'undefined' &&
            ap['locianOptions']['answer']['checkType'] === 'movable') {
            ap_movable.push(ap);
        } else {
            ap_selected.push(ap);
        }
    }
  
           
    var ip_selected = [];
    var ip_movable = [];
    for (var ip of inswer_1['Point1D']) {
        if (typeof ip['locianOptions'] != 'undefined' &&
            typeof ip['locianOptions']['answer'] != 'undefined' &&
            typeof ip['locianOptions']['answer']['checkType'] != 'undefined' &&
            ip['locianOptions']['answer']['checkType'] === 'movable') {
            ip_movable.push(ip);
        } else {
            ip_selected.push(ip);
        }
    }

  


    if (ap_selected.length !== ip_selected.length || ap_movable.length !== ip_movable.length) {
        return false;
    }
          
    

    if (ap_selected.length > 0) { 
        for (var [k, ap] of ap_selected.entries()) {
            var a; 
            if (typeof ap['locianOptions']  != 'undefined' &&
                typeof ap['locianOptions']['answer'] != 'undefined' && 
                typeof ap['locianOptions']['answer']['interaction'] != 'undefined' &&
                typeof ap['locianOptions']['answer']['interaction']['selected'] != 'undefined') {
                a = ap['locianOptions']['answer']['interaction']['selected'];
                a_defined = true;
            }

            var i;
            if (typeof ip_selected[k]['interaction'] != 'undefined' && 
                typeof ip_selected[k]['interaction']['selected'] != 'undefined') {
                i = ip_selected[k]['interaction']['selected'];
                i_defined = true;
            }
            
            if (a && i && JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
    }
    
    if (ap_movable.length > 0) { 
        for (var ap of ap_movable) {
            var a = ap['locianOptions']['answer']['coord'];
            for (var [ki, ip] of ip_movable.entries()) {
                var i;
                
                if (typeof ip != 'undefined' && typeof ip['coord'] != 'undefined') { 
                    i = ip['coord'];
                }
                if (i && JSON.stringify(a) === JSON.stringify(i)) {
                    delete ip_movable[ki];
                    break;
                }
            }
        }
        ip_movable = ip_movable.filter(Boolean);
        
        if (ip_movable.length !== 0) {
            return false;
        }
    }
    
    return true;
}

export function Cartesian1D_compInEq1D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    if (answer_1['InEq1D'].length !== inswer_1['InEq1D'].length) {
        return false;
    }
    
    for (var aInEq of answer_1['InEq1D']) {
        var a_coord = aInEq['locianOptions']['answer']['coord'];
        var a_ineq = aInEq['locianOptions']['answer']['inequality'];
        for (var [ki, iInEq] of inswer_1['InEq1D'].entries()) {
            var i_coord = iInEq['coord'];
            var i_ineq = iInEq['inequality'];
            if (JSON.stringify(a_coord) === JSON.stringify(i_coord) && JSON.stringify(a_ineq) === JSON.stringify(i_ineq)) {
                delete inswer_1['InEq1D'][ki];
                break;
            }
        }
    }
    
    inswer_1['InEq1D'] = inswer_1['InEq1D'].filter(Boolean);
    if (inswer_1['InEq1D'].length !== 0) {
        return false;
    }
    
    return true;
}

export function Cartesian1D_compCompInEq1D(answer, inswer) {
    var answer_1 = JSON.parse(JSON.stringify(answer));
    var inswer_1 = JSON.parse(JSON.stringify(inswer));
    if (answer_1['CompInEq1D'].length !== inswer_1['CompInEq1D'].length) { 
        return false;
    }
    
    for (var aCompInEq of answer_1['CompInEq1D']) {
        for (var [ki, iCompInEq] of inswer_1['CompInEq1D'].entries()) {
            if (aCompInEq['locianOptions']['answer']['inEqs'].length === iCompInEq['inEqs'].length) {
                var a = aCompInEq['locianOptions']['answer'];
                var i = iCompInEq;
                
                for (var aInEq of a['inEqs']) {
                    for (var [kki, iInEq] of i['inEqs'].entries()) {
                       
                        if (typeof i['inEqs'][kki] != "undefined" && 
                            JSON.stringify(aInEq['coord']) === JSON.stringify(iInEq['coord']) && 
                            JSON.stringify(aInEq['inequality']) === JSON.stringify(iInEq['inequality'])) {
                            delete i['inEqs'][kki];
                            break;
                        }
                    }
                }
                
                var a_fill = a['fill'];
                if (a_fill == null) {
                    a_fill = [];
                }
                var i_fill = i['fill'];
                a_fill.sort();
                i_fill.sort();

                i['inEqs'] = i['inEqs'].filter(Boolean);
                if (i['inEqs'].length === 0 && JSON.stringify(a_fill) === JSON.stringify(i_fill)) {
                    delete inswer_1['CompInEq1D'][ki];
                    break;
                }
            }
        }
    }

    inswer_1['CompInEq1D'] = inswer_1['CompInEq1D'].filter(Boolean);
    if (inswer_1['CompInEq1D'].length !== 0) {
        return false;
    }
    
    return true;
}


var object = {
    "type": "Cartesian1D",
    "elements": [
        {
            "type": "Partition1D",
            "points": [
            {
                "type": "Point1D",
                "coord": -3,
                "style": {
                    "fill": false
                }
            },
            {
                "type": "Point1D",
                "coord": 3,
                "style": {
                    "fill": false
                }
            }
            ],
            "fill": [
            
            ],
            "style": {
                "fillColor": {
                    "code": 0
                }
            },
            "interaction": {
                "selectable": true
            },
            "locianOptions": {
                "check": true,
                "answer": {
                    "fill": [
                        1
                    ]
                }
            }
        }
    ],
    "axis": {
        "type": "Axis1D",
        "label": {
            "type": "Math",
            "content": ""
        }
    },
    "grid": {
        "type": "Grid1D",
        "normal": {
            "unit": 1
        },
        "strong": {
            "color": {
                "code": -1
            }
        },
        "week": {
            "color": {
                "code": -1
            }
        },
        "labels": {
            "unit": 1
        }
    },
    "bounds": {
        "min": -10,
        "max": 10
    }
}