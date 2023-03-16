

export function compareGridChart(right = null, input = null) { 
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_GridChart_ahjin');
    //fb(input_1, 'user_GridChart_ahjin');
    
    return TRUE;
}

export function GridChart_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    organizeAnswerObj(object_1['labels']['x']['values'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['y']['values'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['x']['customLabel'], answer, checktypeDefault);
    organizeAnswerObj(object_1['labels']['y']['customLabel'], answer, checktypeDefault);
    
    //fb(object_1, object_1['type'] + 'ahjin');
    
    return object_1;
}