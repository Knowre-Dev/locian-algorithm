

export function compareDotPlot1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'DotPlot1D' && input_1['type'] === 'DotPlot1D') {
        //fb(right_1, 'right_DotPlot1D_ahjin');
        //fb(input_1, 'user_DotPlot1D_ahjin');
        
        var right_data = DotPlot1D_getInfo(right_1, true);
        var input_data = DotPlot1D_getInfo(input_1, false);
        //fb(right_data, 'right_DotPlot1D_getInfo_ahjin');
        //fb(input_data, 'user_DotPlot1D_getInfo_ahjin');
        
        if (right_data === false && input_data === false) {
            return true;
        }
        if (right_data === false || input_data === false) {
            return false;
        }
        
        if (right_data['interaction'] === 'range') {
            if (JSON.stringify(right_data['coord']) !== JSON.stringify(input_data['coord'])) {
                return false;
            }
            var counttrue = 0;
            for (var dot of input_data['dots']) {
                if (dot['selected']) {
                    counttrue++;
                } else {
                    break;
                }
            }
            if (right_data['dots'] !== counttrue) {
                return false;
            }
        }
    }

    return true;
}

export function DotPlot1D_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['stacks'] != 'undefined') {
        for (var stack of object_1['stacks']) {
            organizeAnswerObj(stack, answer, checktypeDefault);
        }
    }
    
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}

export function DotPlot1D_getInfo(object, answer = true) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['locianOptions']['check'] == 'undefined' || 
        !object_1['locianOptions']['check']) {
        return false;
    }
    if (answer) { 
        return object_1['locianOptions']['answer']; 
    }
    return object_1;
}