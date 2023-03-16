

export function compareBoxPlot1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'BoxPlot1D' && input_1['type'] === 'BoxPlot1D') {
        //fb(right_1, 'right_BoxPlot1D_ahjin');
        //fb(input_1, 'user_BoxPlot1D_ahjin');
        
        var right_data = BoxPlot1D_getInfo(right);
        var input_data = BoxPlot1D_getInfo(input);
        //fb(right_data, 'right_BoxPlot1D_getInfo_ahjin');
        //fb(input_data, 'user_BoxPlot1D_getInfo_ahjin');
        
        if (right_data === false && input_data === false) {
            return true;
        }
        if (right_data === false || input_data === false) {
            return false;
        }
        if (right_data.length === 0) { 
            return true;
        }
        for (var [kr, r] of right_data.entries()) {
            for (var [ki, i] of input_data.entries()) {
                if (kr === ki) {
                    if (kr === 'outliers') {
                        
                    } else {
                        if (typeof r['coord'] != 'undefined') {
                            if (JSON.stringify(r['coord']) !== JSON.stringify(i['coord'])) {
                                return false;
                            }
                        }
                        if (typeof r['selected'] != 'undefined') {
                            if (r['selected'] !== i['selected']) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function BoxPlot1D_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    return object;
}

export function BoxPlot1D_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['locianOptions']['check'] != 'undefined' || 
        !object_1['locianOptions']['check']) {
        return false;
    }
    
    var keys = ['min', 'q1', 'median', 'q3', 'max', 'outliers'];
    var result = new Object();
    for (var [key, prop] of object_1.entries()) {
        if (keys.includes(key)) {
            if (key === 'outliers') {
                
            } else {
                if (typeof prop['locianOptions'] != 'undefined') { // right answer
                    if (prop['locianOptions']['check']) {
                        result[key] = new Object();
                        if (typeof prop['locianOptions']['coord'] != 'undefined') {
                            result[key]['coord'] = prop['locianOptions']['coord'];
                        }
                        if (typeof prop['locianOptions']['selected'] != 'undefined') {
                            result[key]['selected'] = prop['locianOptions']['selected'];
                        }
                    }
                } else {  // user input
                    result[key] = new Object();
                    result[key]['coord'] = prop['coord'];
                    result[key]['selected'] = prop['interaction']['selected'];
                }
            }
        }
    }
    
    return result;
}