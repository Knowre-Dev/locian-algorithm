import {organizeAnswerObj} from '../rc/functions.js';

export function compareLattice(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    

    return true;
}

export function Lattice_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Lattice') {
        return object_1;
    }
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
    
    
    return object_1;
}

export function Lattice_SelectInLattice(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Lattice') {
        return object_1;
    }
    var selectValue = [];
    for (var [k, row] of object_1['value'].entries()) {
        if (row[0]['object']['type'] === 'Select' && row[0]['object']['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1]['object'], answer, checktypeDefault_1);
        } else if (row[0]['type'] === 'Select' && row[0]['value'].length === 1) {
            selectValue.push(k);
            organizeAnswerObj(row[1], answer, checktypeDefault_1);
        }
    }
    var select = {
        'type': 'Select',
        'mode': 'checkbox',
        'value': selectValue
    };
    
    organizeAnswerObj(select, answer, checktypeDefault_1);
}


function getObject() {
    var valueArray = new Object();
    for (var [keyRow, row] of this.data.entries()) {
        var valueRow = [];
        for (var [keyColumn, cell] of row.entries()) {
            var option = new Object();
            option['background'] = 
                typeof this.option[keyRow][keyColumn]['background'] != 'undefined'
                ? this.option[keyRow][keyColumn]['background'] 
                : 0;
            option['preset'] = 
                typeof this.option[keyRow][keyColumn]['preset'] != 'undefined' 
                ? this.option[keyRow][keyColumn]['preset'] 
                : [];
            option['textAlign'] = 
                typeof this.option[keyRow][keyColumn]['textAlign'] != 'undefined' 
                ? this.option[keyRow][keyColumn]['textAlign'] 
                : 'center';
            option['verticalAlign'] = 
                typeof this.option[keyRow][keyColumn]['verticalAlign'] != 'undefined' 
                ? this.option[keyRow][keyColumn]['verticalAlign'] 
                : 'middle';

            if (typeof this.option[keyRow][keyColumn]['colspan'] != 'undefined') {
                option['colspan'] = this.option[keyRow][keyColumn]['colspan'];
            }
            if (typeof this.option[keyRow][keyColumn]['paddingTop'] != 'undefined') {
                option['paddingTop'] = this.option[keyRow][keyColumn]['paddingTop'];
            }
            if (typeof this.option[keyRow][keyColumn]['paddingBottom'] != 'undefined') {
                option['paddingBottom'] = this.option[keyRow][keyColumn]['paddingBottom'];
            }
            if (typeof this.option[keyRow][keyColumn]['paddingRight'] != 'undefined') {
                option['paddingRight'] = this.option[keyRow][keyColumn]['paddingRight'];
            }
            if (typeof this.option[keyRow][keyColumn]['paddingLeft'] != 'undefined') {
                option['paddingLeft'] = this.option[keyRow][keyColumn]['paddingLeft'];
            }
            if (typeof this.option[keyRow][keyColumn]['width'] != 'undefined') {
                option['width'] = this.option[keyRow][keyColumn]['width'];
            }
            if (typeof this.option[keyRow][keyColumn]['height'] != 'undefined') {
                option['height'] = this.option[keyRow][keyColumn]['height'];
            }
            if (typeof this.option[keyRow][keyColumn]['fixedWidth'] != 'undefined') {
                option['fixedWidth'] = this.option[keyRow][keyColumn]['fixedWidth'];
            }
            if (typeof this.option[keyRow][keyColumn]['fixedHeight'] != 'undefined') {
                option['fixedHeight'] = this.option[keyRow][keyColumn]['fixedHeight'];
            }
            if (cell['type'] === 'Block') {
                if (typeof this.option[keyRow][keyColumn]['textAlign'] != 'undefined') {
                    cell['option']['textAlign'] = this.option[keyRow][keyColumn]['textAlign'];
                }
            }
            valueRow.push(
                {
                    "object": cell,
                    "option": option
                }
            );
        }
        valueArray.push(valueRow);
    }
    var result = {
        "type": "Lattice",
        "value": valueArray
    };
    return result;
}