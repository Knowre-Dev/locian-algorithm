

export function compareTree(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Tree_ahjin');
    //fb(input_1, 'user_Tree_ahjin');
    
    return true;
}

export function Tree_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    switch (object_1['type']) {
        case 'Tree':
            if (typeof object_1['nodes'] != 'undefined') {
                for (var node of object_1['nodes']) {
                    Tree_getAnswer(node, answer, checktypeDefault);
                }
                organizeAnswerObj(object_1['edgeTitles'], answer, checktypeDefault);
                organizeAnswerObj(object_1['nodeTitles'], answer, checktypeDefault);
                organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
                organizeAnswerObj(object_1['lastLeafElements'], answer, checktypeDefault);
            } else {
                organizeAnswerObj(object_1['value'], answer, checktypeDefault);
            }
            break;
        
        case 'TreeNode':
            if (object_1['content']['type'] === 'Box' && object_1['content']['elements'][0]['type'] === 'Stack') {
                var objArr;
                if (typeof answer['Stack'][0]['objs'] != 'undefined') {
                    objArr = answer['Stack'][0]['objs'].concat(object_1['content']['elements']);
                } else
                    objArr = object_1['content']['elements'];
                
                obj = {
                    'type': 'Stack',
                    'objs': objArr
                };
                answer['Stack'] = [obj];
            } else {
                organizeAnswerObj(object_1['content'], answer, checktypeDefault);
            }
            
            organizeAnswerObj(object_1['label'], answer, checktypeDefault);
            
            if (object_1['children'].length > 0) {
                for (var node of object_1['children']) {
                    Tree_getAnswer(node, answer, checktypeDefault);
                }
            } else {
                //fb(object_1, 'no children');
            }
            break;
    }
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}
