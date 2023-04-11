
export function compareConnect(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    // get objects to compare
    var r_lines = [];
    if (typeof right_1['locianOptions'] != 'undefined' && 
        typeof right_1['locianOptions']['lines'] != 'undefined') {
        for (var line of right_1['locianOptions']['lines']) {
            r_lines.push([line['source'], line['target']]);
        }
    }
    
    
    var i_lines = [];
    var i = input_1['lines'].slice(right_1['lines'].length);
    for (var line of i) {
        i_lines.push([line['source'], line['target']]);
    }
    
    
    // compare
    if (typeof right_1['locianOptions'] != 'undefined' && 
        typeof right_1['locianOptions']['order'] != 'undefined' &&
        right_1['locianOptions']['order'] === false) {
        if (typeof right_1['locianOptions']['direction'] != 'undefined' &&
            right_1['locianOptions']['direction'] === true) {
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
            r_lines = r_lines.filter(Boolean);
            i_lines = i_lines.filter(Boolean);
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        } else {
            for (var [kr, r] of r_lines.entries()) {
                var count = 0;
                for (var [ki, i] of i_lines.entries()) {
                    if ((r[0] === i[0] && r[1] === i[1]) ||
                        (r[1] === i[0] && r[0] === i[1])) {
                        count++;
                        delete i_lines[ki];
                    }
                }
                if ([1, 2].includes(count)) {
                    delete r_lines[kr];
                }
            }
            r_lines = r_lines.filter(Boolean);
            i_lines = i_lines.filter(Boolean);
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        }
    } else {
        if (typeof right_1['locianOptions'] != 'undefined' && 
            typeof right_1['locianOptions']['direction'] != 'undefined' &&
            right_1['locianOptions']['direction'] === true) {
            if (r_lines.length !== i_lines.length) {
                return false;
            }
            for (var [kr, r] of r_lines.entries()) {
                if (r[0] !== i_lines[kr][0] || r[1] !== i_lines[kr][1]) {
                    return false;
                }
            }
        } else {
            
            for (var [kr, r] of r_lines.entries()) {
                if (i_lines.length > 0) {
                    if (r[0] === i_lines[0][0] && r[1] === i_lines[0][1]) {
                        delete i_lines[0];
                    }
                    if (r[1] === i_lines[1][0] && r[0] === i_lines[1][1]) {
                        delete i_lines[1];
                    }
                    delete r_lines[kr];
                    i_lines = i_lines.filter(Boolean);
                } else {
                    break;
                }
            }
            r_lines = r_lines.filter(Boolean);
            i_lines = i_lines.filter(Boolean);
            if (r_lines.length !== 0 || i_lines.length !== 0) {
                return false;
            }
        }
    }

    return true;
}

export function Connect_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    return object_1;
}

//this => connect
function getObject() {
    var dotStyle;
    var sameDotStyle
    if (!isNaN(parseFloat(this.edgeCount))) {
        dotStyle = {
            'lineLimit': {
                'source': DStophp(this.edgeCount), 
                'target': DStophp(this.edgeCount)
            }
        };
        sameDotStyle = true;
    } else if (Array.isArray(this.edgeCount) && 
        !isNaN(parseFloat(DStophp(this.edgeCount[0]))) && 
        !isNan(parseFloat(DStophp(this.edgeCount[1])))) {
        dotStyle = {
            'lineLimit': {
                'source': DStophp(this.edgeCount[0]), 
                'target': DStophp(this.edgeCount[1])
            }
        };
        sameDotStyle = true;
    } else {
        dotStyle = {
            'lineLimit': {
                'source': 1, 'target': 1
            }
        };
        sameDotStyle = false;
    }
    
    var json = {
        'type': 'Connect',
        'size': DStophp(this.size),
        'dots': this.getDots(),
        'labels': this.getLabels(),
        'lines': this.getLines(),
        'arrow': this.arrow,
        'dotStyle': $dotStyle,
        'sameDotStyle': $sameDotStyle,
        'display': 'inline-block'
    };

    if (!isNaN(parseFloat(this.dotColor))) {
        json['sameDotStyle'] = true;
        json['dotStyle']['style']['color']['code'] = DStophp(this.dotColor);
    }
    
    if (!isNaN(parseFloat(this.lineColor))) {
        json['color']['code'] = DStophp(this.lineColor);
    }
    
    var result = {
        'type': 'Connect',
        'newsinod': json
    };
    return result;
}