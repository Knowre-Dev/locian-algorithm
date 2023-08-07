import {organizeAnswerObj} from '../rc/functions.js';

export function compareCases(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    

    return true;
}

export function Cases_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Cases') {
        return object_1;
    }
    organizeAnswerObj(object_1['cases'], answer, checktypeDefault_1);
    organizeAnswerObj(object_1['conditions'], answer, checktypeDefault_1);
    
    
    return object_1;
}
