import {organizeAnswerObj} from '../rc/functions.js';

export function compareGridChart(right = null, input = null) { 
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    return true;
}

export function GridChart_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'GridChart') {
        return object_1;
    }
    organizeAnswerObj(object_1['labels']['x']['values'], answer, checktypeDefault_1);
    organizeAnswerObj(object_1['labels']['y']['values'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['x']['customLabel'], answer, checktypeDefault_1);
    organizeAnswerObj(object_1['labels']['y']['customLabel'], answer, checktypeDefault_1);
    
    
    return object_1;
}