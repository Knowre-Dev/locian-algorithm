

export function compareTrig(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Trig' && input_1['type'] === 'Trig') {
        //fb(right_1, 'right_Trig_ahjin');
        //fb(input_1, 'user_Trig_ahjin');
        
        var right_data = Trig_getInfo(right_1);
        var input_data = Trig_getInfo(input_1);
        //fb(right_data, 'right_Trig_getInfo_ahjin');
        //fb(input_data, 'user_Trig_getInfo_ahjin');
        
        if (right_data.length === 0) { 
            return true;
        }
        if (right_data.length !== input_data.length) {
            return false;
        }
        //print_r(right_data); echo '<br>';
        //print_r(input_data);
        for (var r of right_data) {
            for (var i of input_data) {
                if (typeof r['base'] != 'undefined') {
                    if (typeof r['base']['degree'] != 'undefined') {
                        if (r['base']['degree'] !== i['base']['degree']) {
                            return false;
                        }
                    }
                    if (typeof r['base']['selected'] != 'undefined') {
                        if (r['base']['selected'] !== i['base']['selected']) {
                            return false;
                        }
                    }
                }
                
                if (typeof r['needle'] != 'undeinfed') {
                    if (typeof r['needle']['degree'] != 'undefined') {
                        if (r['needle']['degree'] !== i['needle']['degree']) {
                            return false;
                        }
                    }
                    if (typeof r['needle']['selected'] != 'undefined') {
                        if (r['needle']['selected'] !== i['needle']['selected']) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function Trig_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
     for (var e of object_1['needles']) {
        if (typeof e['degreeContent'] != 'undefined' && e['degreeContent'].length > 0) {
            organizeAnswerObj(e['degreeContent']['element'], answer, checktypeDefault);
        } else if (typeof e['radianContent'] != 'undefined' && e['radianContent'].length > 0) {
            organizeAnswerObj(e['radianContent']['element'], answer, checktypeDefault);
        } else if (typeof e['contents'] != 'undefined') {
            for (var ee of e['contents']) {
                organizeAnswerObj(ee, answer, checktypeDefault);
            }
        }
    }
    
    return object_1;
}

export function Trig_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var result = [];
    for (var TrigNeedle of object_1['needles']) {
        if (typeof TrigNeedle['locianOptions']['check'] != 'undefined' && TrigNeedle['locianOptions']['check']) {
            var arr = new Object();
            if (typeof TrigNeedle['needle'] != 'undefined') { // user input
                arr['base'] = TrigNeedle['base'];
                arr['needle'] = TrigNeedle['needle'];
            } else {  // right answer
                if (typeof TrigNeedle['locianOptions']['base'] != 'undefined') {
                    var base = TrigNeedle['locianOptions']['base'];
                    if (typeof base['degree'] != 'undefined') {
                        arr['base']['degree'] = base['degree'];
                    }
                    
                    if (typeof base['selected'] != 'undefined') {
                        arr['base']['selected'] = base['selected'];
                    }
                }
                
                if (typeof TrigNeedle['locianOptions']['needle'] != 'undefined') {
                    var needle = TrigNeedle['locianOptions']['needle'];
                    if (typeof needle['degree'] != 'undefined') {
                        arr['needle']['degree'] = needle['degree'];
                    }
                    
                    if (typeof needle['selected'] != 'undefined') {
                        arr['needle']['selected'] = needle['selected'];
                    } 
                } 
            }
            
            result.push(arr);
        }
    }
    
    return result;
}