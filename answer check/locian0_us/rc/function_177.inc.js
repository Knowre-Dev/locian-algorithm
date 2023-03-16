

export function compareBox(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Box_ahjin');
    //fb(input_1, 'user_Box_ahjin');

    return true;
}

export function Box_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    for (var element of object_1['elements']) {
        /*. // no more use
        if (element['type'] == 'Shade') {
            if (isset(answer['Shade'][0]['objs'])) {
                objs = answer['Shade'][0]['objs'];
                objs[] = element;
            } else {
                objs = [element];
            }
            shade = [
                'type' => 'Shade',
                'objs' => objs
            ];
            
            answer['Shade'] = [shade];
            if (isset(answer['Shade']['objs'])) {
                answer['Shade']['objs'][] = element;
            } else {
                objs = [element];
                answer['Shade']['objs'] = objs;
            }
        } else {
            organizeAnswerObj(element, answer, checktypeDefault);
        }
        */
        organizeAnswerObj(element, answer, checktypeDefault);
    }
    
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}
