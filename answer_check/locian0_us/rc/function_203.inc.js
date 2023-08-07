import {organizeAnswerObj} from '../rc/functions.js';

export function compareCircleGraph(right = null, input = null) {
    return true;
}

export function CircleGraph_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'CircleGraph') {
        return object_1;
    }

    organizeAnswerObj(object_1['labels'], answer, checktypeDefault_1);
    if (typeof object_1['legend'] != 'undefined' && typeof object_1['legend']['elements'] != 'undefined') {
        organizeAnswerObj(object_1['legend']['elements'], answer, checktypeDefault_1);
    }
    
    return object_1;
}