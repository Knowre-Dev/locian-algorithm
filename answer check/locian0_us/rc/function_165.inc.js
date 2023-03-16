

export function compareCartesian1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Cartesian1D' && input_1['type'] === 'Cartesian1D') {
        //fb(right_1, 'right_Cartesian1D_ahjin');
        //fb(input_1, 'user_Cartesian1D_ahjin');
        
        answer = Cartesian1D_getInfo(right_1);
        inswer = Cartesian1D_getInfo(input_1);
        //fb(answer, 'right_Cartesian1D_getInfo_ahjin');
        //fb(inswer, 'user_Cartesian1D_getInfo_ahjin');
        
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
    //fb(object_1, object_1['type'] + 'Aihua');
    
    for (var e of object_1['elements']) {
        organizeAnswerObj(e, answer, checktypeDefault);
    }
    
    return object_1;
}

export function Cartesian1D_getInfo(cart1d) {
    var cart1d_1 = JSON.parse(JSON.stringify(cart1d));
    var result = [];
    for (var object of cart1d_1['elements']) {
        if (typeof object['locianOptions']['check'] == 'undefined' || !object['locianOptions']['check']) {
            continue;
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
        if (ap['locianOptions']['answer']['checkType'] === 'movable') {
            ap_movable.push(ap);
        } else {
            ap_selected.push(ap);
        }
    }
           
    var ip_selected = [];
    var ip_movable = [];
    for (var ip of inswer_1['Point1D']) {
        if (ip['locianOptions']['answer']['checkType'] === 'movable') {
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
            var a = ap['locianOptions']['answer']['interaction']['selected'];
            var i = ip_selected[k]['interaction']['selected'];
            if (JSON.stringify(a) !== JSON.stringify(i)) {
                return false;
            }
        }
    }
    if (ap_movable.length > 0) { 
        for (var ap of ap_movable) {
            var a = ap['locianOptions']['answer']['coord'];
            for (var [ki, ip] of ip_movable.entries()) {
                var i = ip['coord'];
                if (JSON.stringify(a) === JSON.stringify(i)) {
                    delete ip_movable[ki];
                    break;
                }
            }
        }
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
        for (var [ki, iInEq] of inswer['InEq1D'].entries()) {
            var i_coord = iInEq['coord'];
            var i_ineq = iInEq['inequality'];
            if (JSON.stringify(a_coord) === JSON.stringify(i_coord) && JSON.stringify(a_ineq) === JSON.stringify(i_ineq)) {
                delete inswer['InEq1D'][ki];
                break;
            }
        }
    }
    
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
                        if (JSON.stringify(aInEq['coord']) === JSON.stringify(iInEq['coord']) && 
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
                if (i['inEqs'].length === 0 && JSON.stringify(a_fill) === JSON.stringify(i_fill)) {
                    delete inswer['CompInEq1D'][ki];
                    break;
                }
            }
        }
    }
    
    if (inswer_1['CompInEq1D'].length !== 0) {
        return false;
    }
    
    return true;
}
