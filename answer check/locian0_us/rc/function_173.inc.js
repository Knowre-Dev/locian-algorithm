import {organizeAnswerObj} from '../rc/functions.js';

export function compareChart(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    return true;
}




export function Chart_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['answer'] != 'undefined') {
        for (var a of object_1['answer']) {
            answer['ChartGraph'].push(a);
        }
    } else {
        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
    }
    organizeAnswerObj(object_1['grid'], answer, checktypeDefault);
    
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}