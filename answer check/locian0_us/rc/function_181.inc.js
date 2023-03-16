

export function compareLattice(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Lattice_ahjin');
    //fb(input_1, 'user_Lattice_ahjin');

    return true;
}

export function Lattice_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (object_1['value'][0][0]['object']['type'] === 'Select') {
        Lattice_SelectInLattice(object, answer, checktypeDefault);
    } else if (object_1['value'][0][0]['type'] === 'Select') {
        Lattice_SelectInLattice(object, answer, checktypeDefault);
    } else {
        for (var eachRow of object['value']) {
            for (var eachCell of eachRow) {
                if (typeof eachCell['object'] != 'undefined') {
                    organizeAnswerObj(eachCell['object'], answer, checktypeDefault);
                } else if (typeof eachCell['type'] != 'undefined') {
                    organizeAnswerObj(eachCell, answer, checktypeDefault);
                }
            }
        }
    }
    
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}

export function Lattice_SelectInLattice(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var selectValue = [];
    for (var [k, row] of object_1['value'].entries()) {
        if (row[0]['object']['type'] === 'Select' && row[0]['object']['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1]['object'], answer, checktypeDefault);
        } else if (row[0]['type'] === 'Select' && row[0]['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1], answer, checktypeDefault);
        }
    }
    var select = {
        'type': 'Select',
        'mode': 'checkbox',
        'value': selectValue
    };
    
    organizeAnswerObj(select, answer, checktypeDefault);
}
