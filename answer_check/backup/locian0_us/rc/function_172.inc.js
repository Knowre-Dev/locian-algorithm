

import {organizeAnswerObj} from '../rc/functions.js';

export function compareTree(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    return true;
}

export function Tree_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    if (typeof object_1['type'] == 'undefined' || object_1['type'] != 'Tree') {
        return object_1;
    }
    switch (object_1['type']) {
        case 'Tree':
            if (typeof object_1['nodes'] != 'undefined') {
                for (var node of object_1['nodes']) {
                    Tree_getAnswer(node, answer, checktypeDefault_1);
                }
                if (typeof object_1['edgeTitles'] != 'undefined') {
                    organizeAnswerObj(object_1['edgeTitles'], answer, checktypeDefault_1);
                }
                if (typeof object_1['nodeTitles'] != 'undefined') {
                    organizeAnswerObj(object_1['nodeTitles'], answer, checktypeDefault_1);
                }
                if (typeof object_1['elements'] != 'undefined') {
                    organizeAnswerObj(object_1['elements'], answer, checktypeDefault_1);
                }
                if (typeof object_1['lastLeafElements'] != 'undefined') {
                    organizeAnswerObj(object_1['lastLeafElements'], answer, checktypeDefault_1);
                }
            } else {
                organizeAnswerObj(object_1['value'], answer, checktypeDefault_1);
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
                organizeAnswerObj(object_1['content'], answer, checktypeDefault_1);
            }
            
            organizeAnswerObj(object_1['label'], answer, checktypeDefault_1);
            
            if (object_1['children'].length > 0) {
                for (var node of object_1['children']) {
                    Tree_getAnswer(node, answer, checktypeDefault_1);
                }
            } else {
               
            }
            break;
    }
    
    
    return object_1;
}





//object
function getObject() {
    var node = this.nodeData()[0];
    node['edgeLength'] = 0.3;
    
    var json = {
        'type': 'Tree',
        'nodes': [node],
        'nodeTitles': this.setNodeTitles(), //#Needs to be set
        'lastLeafElements': this.setOutcomes(),
        'flow': this.flow,
        'size': this.size,
        'ratio': this.ratio,
        'display': 'inline-block',
        'useLastLeafAlign': true
    };

    result = {
        'type': 'Tree',
        'newsinod': json
    };
   
    return result;
}