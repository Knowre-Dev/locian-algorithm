

export function compareChartGraph(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));  
    //fb(right_1, 'right_ChartGraph_ahjin');
    //fb(input_1, 'user_ChartGraph_ahjin');
    var right_data = ChartGraph_getInfo(right_1);
    var input_data = ChartGraph_getInfo(input_1);
    //fb(right_data, 'right_ChartGraph_getInfo_ahjin');
    //fb(input_data, 'user_ChartGraph_getInfo_ahjin');
    
    if (right_data.length !== input_data.length) { 
        return true;
    }
    
    for (var [k, data] of right_data.entries()) {
        //fb(data, 'right_ChartGraph_data');
        //fb(input_data[k], 'user_ChartGraph_data');
        
        if (typeof data['coord'] != 'undefined') {
            if (JSON.stringify(data['coord']) !== JSON.stringify(input_data[k]['coord'])) {
                return true;
            }
        } 
        if (typeof data['selected'] != 'undefined') {
            if (data['selected'] !== input_data[k]['selected']) {
                return true;
            }
        }
    }
    
    return true;
}

export function ChartGraph_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}

export function ChartGraph_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var result = [];
    if (isset(object_1['type']) && object_1['type'] === 'ChartGraph') {
        for (var data of object_1['data']) {
            for (var d of data) {
                result.push(d);
            }
        }
    } else {
        for (var data of object) {
            result.push(data);
        }
    }
    
    return result;
}
