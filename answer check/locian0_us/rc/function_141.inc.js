

export function compareNumberLine(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'NumberLine' && input_1['type'] === 'NumberLine') {
        //fb(right_1, 'right_NumberLine_ahjin');
        //fb(input_1, 'user_NumberLine_ahjin');
        
        var obj_right = NumberLine_getInfo(right_1);
        var obj_input = NumberLine_getInfo(input_1);
        if (obj_right === false || obj_input === false) {
            return false;
        }
        //fb(obj_right, 'right_NumberLine_getInfo_ahjin');
        //fb(obj_input, 'user_NumberLine_getInfo_ahjin');
        
        if (obj_right['point'].length === obj_input['point'].length) {
            for (var rp of obj_right['point']) {
                for (var [ki, ip] of obj_input['point'].entries()) {
                    if (JSON.stringify(rp['value']) == JSON.stringify(ip['value'])) {
                        delete obj_input['point'][ki];
                        break;
                    }
                }
            }
            
            if (obj_input['point'].length !== 0) {
                return false;
            }
        } else {
            return false;
        }
        if (obj_right['region'].length === obj_input['region'].length) {
            for (var robj of obj_right['region']) {
                for (var [ki, iobj] of obj_input['region'].entries()) {
                    if (NumberLine_region(robj, iobj)) {
                        delete obj_input['region'][ki];
                        break;
                    }
                }
            }
            
            if (obj_input['region'].length !== 0) {
                return false;
            }
        } else
            return false;
        
        return true;
    }

    return false;
}

export function NumberLine_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object)); 
    //fb(object_1, object_1['type'] + 'Aihua');
    return object;
}

export function NumberLine_region(regionObj1, regionObj2) {
    var regionObj1_1 = JSON.parse(JSON.stringify(regionObj1));
    var regionObj2_1 = JSON.parse(JSON.stringify(regionObj2));
    if (JSON.stringify(regionObj1['type']) !== JSON.stringify(regionObj2['type'])) {
        return false;
    }
    if (regionObj1_1['value'].length !== regionObj2_1['value'].length) {
        return false;
    }
    if (regionObj1_1['sign'].length !== regionObj2_1['sign'].length) {
        return false;
    }
    if (regionObj1_1['pointFill'].length !== regionObj2_1['pointFill'].length) {
        return false;
    }
    if (regionObj1_1['dataFill'].length !== regionObj2_1['dataFill'].length) {
        return false;
    }
   
    // comparing coord and pointFill if necessary
    var size = regionObj2_1['value'].length;
    var i = 0;
    for (var value1 of regionObj1_1['value']) {
        for (var [k2, value2] of regionObj2_1['value'].entries()) {
            //tree1 = Relation_getTree(value1, 'equi');
            //tree2 = Relation_getTree(value2, 'equi');
            if (is_null(value2)) {
                i++;
                //mapping[] = k2;
                delete regionObj2_1['value'][k2];
                break;
            } else if (value1 == value2/*Relation_compTree(tree1, tree2)*/ && 
            JSON.stringify(regionObj1_1['sign'][k1]) === JSON.stringify(regionObj2_1['sign'][k2]) && 
            JSON.stringify(regionObj1_1['pointFill'][k1]) === JSON.stringify(regionObj2_1['pointFill'][k2])) {
                i++;
                //mapping[] = k2;
                delete regionObj2_1['value'][k2];
                break;
            }
        }
    }
   
    if (size !== i) {
        return false;
    }
   
    // comparing dataFill
    var dataFill1 = [];
    for (var data of regionObj1_1['dataFill']) {
        var count = 0;
        for (var d of data) {
            if (d) {
                count++;
            }
        }
        dataFill1.push(count);
    }
    var dataFill2 = [];
    for (var data of regionObj2_1['dataFill']) {
        var count = 0;
        for (var d of data) {
            if (d) {
                count++;
            }
        }
        dataFill2.push(count);
    }
    
    dataFill1.sort();
    dataFill2.sort();
    
    return JSON.stringify(dataFill1) === JSON.stringify(dataFill2);
    /*
    newDataFill = array();
    foreach (regionObj2['dataFill'] as data) {
        newData = array();
        foreach (mapping as m) {
            newData[] = data[m];
        }
        newDataFill[] = newData;
    }
    
    foreach (regionObj1['dataFill'] as idata) {
        foreach (newDataFill as k => rdata) {
            if (rdata === idata) {
                unset(newDataFill[k]);
                break;
            }
        }
    }
    
    return sizeof(newDataFill) === 0;
    */
}

export function NumberLine_getInfo(nlineObj) {
    var nlineObj_1 = JSON.parse(JSON.stringify(nlineObj));
    // We didn't add `checkFlag` to the parser, 
    if (nlineObj_1['checkFlag'] === false) {
        return false;
    }
    
    var point = [];
    var region = [];
    for_1:
    for (var eachObj of nlineObj_1['object']) {
        switch (eachObj['type']) {
            case 'Input:Point':
                var object = {
                    'type': 'point',
                    'value': eachObj['coord'],
                    'pointFill': true
                };
                point.push(object);
                break;
            
            case 'Input:InEq':
                object = {
                    'type': 'region',
                    'value': [eachObj['coord']],
                    'sign': [eachObj['sign']],
                    'pointFill': [eachObj['pointFill']],
                    'dataFill': [[eachObj['sign']]]
                };
                region.push(object);
                break;
            
            case 'Input:CompInEq':
                var value = [];
                var pointFill = [];
                var sign = [];
                for (var obj of eachObj['object']) {
                    value.push(obj['coord']);
                    sign.push(obj['sign']);
                    pointFill.push(obj['pointFill']);
                }
                object = {
                    'type': 'region',
                    'value': value,
                    'sign': sign,
                    'pointFill': pointFill,
                    'dataFill': eachObj['dataFill']
                };
                region.push(object);
                break;
                     
            default: 
                continue for_1;
        }
    }
    
    return {
        'point': point,
        'region': region
    };
}


/*






*/