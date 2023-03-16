

export function compareTable(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Table_ahjin');
    //fb(input_1, 'user_Table_ahjin');

    return TRUE;
}

export function Table_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['locianOptions'] != 'undefined' && typeof object_1['locianOptions']['type'] != 'undefined' && object_1['locianOptions']['type'] === 'Stack' && typeof object['locianOptions']['willAllow'] != 'undefined') {
        var willAllow = object_1['locianOptions']['willAllow'];
        
        var objArr = [];
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                if (cell['elements'][0]['type'] === 'Stack') {
                    objArr = objArr.concat(cell['elements']);
                } else {
                    organizeAnswerObj(cell['elements'], answer, checktypeDefault);
                }
            }
        }
        
        if (typeof answer['Stack'][0]['pattern'] != 'undefined') {
            objArr = answer['Stack'][0]['pattern'].concat(objArr);
        }
        
        var pattern = {
            'type': 'Stack',
            'pattern': objArr,
            'willAllow': willAllow
        };
        answer['Stack'] = [pattern];
    } else if (typeof object_1['locianOptions'] != 'undefined' && 
            typeof object_1['locianOptions']['type'] != 'undefined' && 
            object_1['locianOptions']['type'] == 'Stack' && 
            typeof object_1['locianOptions']['order'] != 'undefined' && 
            object_1['locianOptions']['order'] === true) {
        var objArr = [];
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                if (cell['elements'][0]['type'] === 'Stack') {
                    objArr = objArr.concat(cell['elements']);
                } else {
                    organizeAnswerObj(cell['elements'], answer, checktypeDefault);
                }
            }
        }
        
        var obj = {
            'type': 'Stack',
            'objs': objArr
        };
        answer['Stack'] = [obj];
    } else {
        for (var eachRow of object_1['cells']) {
            for (var cell of eachRow) {
                for (var element of cell['elements']) {
                    if (element['type'] == 'Shade') {
                        var objs = [];
                        if (typeof answer['Shade'][0]['objs'] != 'undefined') {
                            objs = answer['Shade'][0]['objs'];
                            objs.push(element);
                        } else {
                            objs = [element];
                        }
                        
                        var shade = {
                            'type': 'Shade',
                            'objs': objs
                        };
                        
                        answer['Shade'] = [shade];
                    } else {
                        organizeAnswerObj(element, answer, checktypeDefault);
                    }
                }
            }
        }
    }    
    
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}
