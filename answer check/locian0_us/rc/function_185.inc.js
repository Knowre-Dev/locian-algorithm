
export function compareConnect(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Connect_ahjin');
    //fb(input_1, 'user_Connect_ahjin');
    
    // get objects to compare
    var r_lines = [];
    for (var line of right_1['locianOptions']['lines']) {
        r_lines.puhs([line['source'], line['target']]);
    }
    //fb(r_lines, 'right_Connect_getInfo_ahjin');
    
    var i_lines = [];
    var i = input_1['lines'].slice(right_1['lines'].length);
    for (var line of i) {
        i_lines.push([line['source'], line['target']]);
    }
    //fb(i_lines, 'user_Connect_getInfo_ahjin');
    
    // compare
    if (right_1['locianOptions']['order'] === false) {
        if (right_1['locianOptions']['direction'] === true) {
            //fb('Connect', 'Order does NOT matter, direction does matter.');
            if (r_lines.length !== i_lines.length) {
                return false;
            }
            for (var [kr, r] of r_lines.entries()) {
                for (var [ki, i] of i_lines.entries()) {
                    if (r[0] === i[0] && r[1] === i[1]) {
                        delete r_lines[kr];
                        delete i_lines[ki];
                        break;
                    }
                }
            }
            
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        } else {
            //fb('Connect', 'Order does NOT matter, direction does NOT matter.');
            for (var [kr, r] of r_lines.entries()) {
                var count = 0;
                for (var [ki, i] of i_lines.entries()) {
                    if ( (r[0] === i[0] && r[1] === i[1]) ||
                        (r[1] === i[0] && r[0] === i[1]) ) {
                        count++;
                        delete i_lines[ki];
                    }
                }
                if ([1, 2].includes(count)) {
                    delete r_lines[kr];
                }
            }
            
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        }
    } else {
        if (right_1['locianOptions']['direction'] === true) {
            //fb('Connect', 'Order does matter, direction does matter.');
            if (r_lines.length !== i_lines.length) {
                return false;
            }
            for (var [kr, r] of r_lines.entries()) {
                if (r[0] !== i_lines[kr][0] || r[1] !== i_lines[kr][1]) {
                    return false;
                }
            }
        } else {
            //fb('Connect', 'Order does matter, direction does NOT matter.');
            
            for (var [kr, r] of r_lines.entries()) {
                if (i_lines.length > 0) {
                    if (r[0] === i_lines[0][0] && r[1] === i_lines[0][1]) {
                        delete i_lines[0];
                    }
                    if (r[1] === i_lines[1][0] && r[0] === i_lines[1][1]) {
                        delete i_lines[1];
                    }
                    delete r_lines[kr];
                    i_lines = [...i_lines.values()];
                } else {
                    break;
                }
            }
            
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        }
    }

    return true;
}

export function Connect_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}