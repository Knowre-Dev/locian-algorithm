
import { is_numeric, match_all} from './app/functions.js';

function _ganswer(object, answer) { // getanswer
    const escp = new Map([
        ["\\text{ }", ''],
        ["\\:", ''],
        ['< ', "\\lt "],
        ['> ', "\\gt "],
        ['<= ', "\\le "],
        ['>= ', "\\gt "],
        ['<', "\\lt "],
        ['>', "\\gt "],
        ['<=', "\\le "],
        ['>=', "\\gt "],
        ["\\neq", "\\ne"],
        ["\\plusminus \\times", "\\pm"],
        ["\\plusminus", "\\pm"],
        ["\\pi ", "\\pi"]
    ]);
    const escp_2 = new Map([
        ["+\\pm", "\\pm"],
        ["\\pi", "\\pi "],
    ]);

    if (Array.isArray(object)) {
        object.forEach((item) => {
            _ganswer(item, answer); 
        })
    } 
    if (Object.hasOwn(object, 'type')) {
        return;
    }
    const type = object.type;
    switch(type) {
        case 'Cases': {
            _ganswer(object.cases, answer);
            _ganswer(object.conditions, answer);
            return;
        }
        case 'MathInput': {
            if (Object.hasOwn(object, 'content')) {
                object.value = object.content;
            }
            if (Object.hasOwn(object,'answer')) {
                object.value = object.answer;
            }
            object.option = object.locianOptions;
        }
        case 'Input': {
            if (Object.hasOwn(object, 'option') && object.option.order === null) {
                object.option.order = 0;
            } else if (object.order === null) {
                object.order = 0;
            }
            if (Object.hasOwn(object.option, 'order')) {
                escp.forEach((value, key) => object.value = object.values.replaceAll(key, value));
                escp_2.forEach((value, key) => object.value = object.values.replaceAll(key, value));
                let exp = new RegEx("/^(\\\\overline)\\\\text{([A-Z]+)}/", 'g');
                if (object.value.match(regex)) {
                    object.value =object.value.replaceAll(exp, '1{2}');
                }
                exp = new RexEx("/^(\\\\overline)([A-Z]+)/", 'g');
                if (object.value.match(exp))
                    object.value = object.value(exp, '1{2}');
                exp = new RegEx('/[가-힣]/', 'g');
                if (object.value.match(exp)) {
                    object.option.answerType = 99;
                }
                let ct;
                switch (object.option.answerType) {
                    case 21: { /* 역밀 */ 
                        ct = ['single', 'eq', 'simp', 'simp', 0, [['string', '0']]]; 
                        break;
                    }
                    case 22: { /* 역순 */ 
                        ct = ['single', 'eq', 'simp', 'simp', 0, [['string', '2']]]; 
                        break;
                    }
                    case 23: { /* 밀림 */ 
                        ct = ['single', 'eq', 'simp', 'simp', 0, [['string', '0']]]; 
                        break;
                    }
                    case 99: { /* 고정 */ 
                        ct = ['single', 'eq', 'simp', 'same', 0, [['string', '3']]]; 
                        break;
                    }
                    case 88: { /* 교환 */ 
                        ct = ['single', 'ex', 'simp', 'simp', 3, []]; 
                        break;
                    }
                    case 89: { /* 결합 */
                        ct = ['single', 'ex', 'simp', 'simp', 12, []]; 
                        break;
                    }
                    case 81: { /* 분수 */
                        ct = ['single', 'ex', 'simp', 'simp', 32, []]; 
                        break;
                    }
                    case 82: { /* 분소 */
                        ct = ['single', 'ex', 'simp', 'simp', 0, []]; 
                        break;
                    }
                    case 83: { /* 거듭 */
                        ct = ['single', 'ex', 'simp', 'simp', 0, []]; 
                        break;
                    }
                    case 84: { /* 대소 */ 
                        ct = ['single', 'ex', 'simp', 'simp', 0, []]; 
                        break;
                    }
                    case 85: { /* 좌우 */ 
                        ct = ['single', 'eq', 'simp', 'simp', 0, []]; 
                        break;
                    }
                    case 86: { /* 인수 */ 
                        ct = ['single', 'ex', 'fact', 'simp', 0, []]; 
                        break;
                    }
                    case 0: { /* 자유 */
                        ct = ['single', 'eqeq', 'simp', 'simp', 0, []]; 
                        break;
                    }
                    default: {
                        ct = object.value.indexOf(',') !== -1 
                            ? object.value.indexOf("(") !== -1 
                                ? ['single', 'eq', 'simp    ', 'simp', 0] 
                                : ['set', 'eq', 'simp', 'equi', 0] 
                            : ['single', 'eq', 'simp', 'equi', 0];
                    }
                }

                if (object.option.answerType === null) {
                    ct = ['single', 'eqeq', 'simp', 'simp', 0];
                }

                if (object.option.order === 'degree') {
                    object.option.order = 1;
                }

                // 170206 larwein - laco
                if (Object.hasOwn(object.option, 'lacoType')) {
                    ct = ['laco', object.option.lacoType];
                }
                const obj = {
                    'value' : object.value, 
                    'order' : is_numeric(object.option.order) 
                        ? 'A' + (object.option.order + 1) 
                        : object.option.order, 
                    'checktype' : ct,
                    'answertype' : object.option.answerType,
                    'whitelist' : object.option.whitelist,
                    'blacklist' : object.option.blacklist,
                };
                answer.E.Input.push(obj);
            } else if (Object.hasOwn(object, 'order')) {
                escp.forEach((value, key) => {
                    object.value = object.value.replaceAll(key, value);
                })
                escp_2.forEach((value, key) => {
                    object.value = object.value.replaceAll(key, value);
                })
                if (object.order === 'degree') {
                    object.order = 1;
                }
                const obj = {
                    'value' : object.value, 
                    'order' : is_numeric(object.order) 
                        ? 'A' + (object.order + 1) 
                        : object.order,
                    'checktype' : null,
                    'answertype' : null,
                    'whitelist' : object.option.whitelist,
                    'blacklist' : object.option.blacklist,
                };
                answer.E.Input.push(obj);
            }
            return;
        }
        case 'TextInput': {
            if (Object.hasOwn(object, 'content')) {
                object.answer = object.content;
            }
    
            if (object.locianOptions.whitelist.length) {
                const obj = {
                    'value' : object.answer,
                    'order' : is_numeric(object.locianOptions.order) 
                        ? 'A' + (object.locianOptions.order + 1) 
                        : object.locianOptions.order,
                    'checktype' : ['laco', object.locianOptions.lacoType],
                    'whitelist' : object.locianOptions.whitelist,
                    'blacklist' : object.locianOptions.blacklist
                };
                answer.E.Input.push(obj);
            } else {
                const obj = {
                    'value' : object.answer,
                    'order' : is_numeric(object.locianOptions.order) 
                        ? 'A' + (object.locianOptions.order + 1) 
                        : object.locianOptions.order,
                    'checktype' : ['laco', object.locianOptions.lacoType]
                };
                answer.E.Input.push(obj); 
            }
            return;
        }
        case 'Select': {
            if (!Array.isArray(object.value)) {
                object.value = [object.value];
            }
            object.value.sort();
            const ans = object.value.join(',');
            answer.E[type].push(ans);
            return;
        }
        case 'SelectBox': {
            const obj = {
                'type' : 'SelectBox', 
                'answer' : Array.isArray(object.answer) 
                    ? object.answer[0] 
                    : object.answer
            };
            answer.M.push(obj);
            return;
        }
        case 'SingleChoice': {
            const obj = {
                'type' : 'SingleChoice', 
                'answer' : object.answer
            };
            answer.M.push(obj);
            if (Array.isArray(object.answer)) {
                object.answer.forEach((oa) => {
                    _ganswer(object.choices[oa], answer);
                });
            } else {
                _ganswer(object.choices[object.answer], answer);
            }
            return;
        }
        case 'MultipleChoice': {
            const obj = {
                'type' : 'MultipleChoice', 
                'answer' : object.answer
            };
            answer.M.push(obj);
            object.answer.forEach((oa) => {
                _ganswer(object.choices[oa], answer);
            });
            return;
        }
        case 'Partial': {
            _ganswer(object.object, answer);
            _ganswer(object.elements, answer);
            return;
        }
        case 'Span':
        case 'Block':
        case 'Tree':
        case 'Lattice': {
            _ganswer(object.value, answer);
            return;
        }
        case 'Layer':
        case 'Directional': {
            _ganswer(object.source, answer);
            _ganswer(object.target, answer);
            _ganswer(object.elements, answer);
            return;
        }
        case 'Static': {
            return;
        }
        case 'Table': {
            _ganswer(object.cells, answer);
            return;
        }
        case 'TableCellBox': {
            _ganswer(object.elements, answer);
            return;
        }
        case 'Box':
        case 'TitleBox': {
            _ganswer(object.elements, answer);
            return;
        }
        case 'Chart': {
            _ganswer(object.elements, answer);
            _ganswer(object.grid, answer);
            return;
        }
        case 'GridChart': {
            _ganswer(object.labels.x.values, answer);
            _ganswer(object.labels.y.values, answer);
            _ganswer(object.labels.x.customLabel, answer);
            _ganswer(object.labels.y.customLabel, answer);
            return;
        }
        case 'CircleGraph':
        case 'BandGraph': {
            _ganswer(object.labels, answer);
            return;
        }
        case 'ChartGraph': {
            const condition = Object.hasOwn(object, 'locianOptions') && object.locianOptions.version === 2
            if (condition) {
                const obj = JSON.stringify(JSON.parse(object));
                obj.type = 'ChartGraphNew';
                answer.M.push(obj);
            } else {
                answer.M.push(object);
            }
            return;
        }

        case 'Stack': {
            if (Object.hasOwn(object, 'interaction')) {
                if (object.locianOptions.single) { //single
                    const obj = {
                        'type' : 'Stack',
                        'key' : object.locianOptions.key,
                        'index' : object.locianOptions.answer.answerIndex
                    }
                    answer.M.push(obj);
                } else { // count
                    object.locianOptions.answer.forEach((oa) => {
                        answer.Stack[object.locianOptions.groupIndex][oa.answerIndex] = oa.count;
                    });
                }
            } else {
                if (object.locianOptions.single) { // single
                    const obj = {
                        'type' : 'Stack',
                        'key' : object.locianOptions.key,
                        'index' : object.index
                    };
                    answer.M.push(obj);
                } else { // count
                    answer.Stack[object.locianOptions.groupIndex][object.index]++;
                }
            }
            return;
        }
        case 'Relation': {
            _ganswer(object.sets, answer);
            _ganswer(object.maps, answer);
            return;
        }
        case 'RelationSet': {
            _ganswer(object.elements, answer);
            return;
        }
        case 'RelationMap': {
            if (object.locianOptions.check) {
                const ans = [];
                if (Object.hasOwn(object, 'answer')) {
                    object.answer.forEach((e) => {
                        ans.push(e.source + '-' + e.target);
                    });
                } else {
                    object.data.forEach((e) => {
                        ans.push(e.source + '-' + e.target);
                    });
                }
                ans.sort();
                const obj = {
                    'type' : 'Relation',
                    'answer' : ans
                };
                answer.M.push(obj);
            }
            return;
        }
        case 'Dropzone': {
            if (object.locianOptions.check) {
                const ans = [];
                if (Object.hasOwn(object, 'answer')) {
                    object.answer.forEach((e) => {
                        ans.push(e);
                    })
                } else {
                    object.elements.forEach((e) => {
                        ans.push(e.elements[0]);
                    })
                }
                if (!object.locianOptions.order) {
                    ans.sort(sort_dropzone);
                }
                const obj = {
                    'type' : 'Dropzone',
                    'answer' : ans
                };
                if (Object.hasOwn(object.locianOptions, 'orderIndex')) {
                    answer.G_Dropzone[object.locianOptions.orderIndex].push(obj);
                } else {
                    answer.M.push(obj);
                }
            }
            return;
        }
        case 'Clock': {
            answer.M.push(obj);
            return;
        }
        case 'Connect': {
            if (!Object.hasOwn(object, 'locianOptions')) {
                return;
            }
            const condition = Object.hasOwn(object, 'locianOptions') && Object.hasOwn(object.locianOptions, 'check') && !object.locianOptions.check
            if (condition) {
                return;
            }
            answer.M.push(object);
            return;
        }
        case 'Grid': {
            const ans = [];
            for (let k1 in object.value) {
                const number = k1 + object.value[k1].length;
                object.value[k1].forEach((v2, k2) => {
                    if (v2.cell) {
                        ans.push(number + k2);
                    }
                })
            }
            let obj = {
                'key' : object.key 
                    ? object.key
                    : 0,
                'count' : object.count 
                    ? object.count
                    : 0,
                'answer' : []
            };
            if (ans.length === 0 && Object.hasOwn(object, 'answer')) {
                obj.anwser = object.answer
            } else {
                obj.answer = ans;
            }
            answer.Grid.push(obj);
            return;
        }
        case 'NumberLine':
        case 'CoordPlane': {
            _ganswer(object.object, answer);
            return;
        }
        case 'GridLabel1D': {
            _ganswer(object.value, answer);
            return;
        }
        case 'Cartesian1D': {
            _ganswer(object.elements, answer);
            return;
        }
        case 'Label1D': {
            _ganswer(object.label, answer);
            return;
        }
        case 'Point1D': {
            const condition_1 = object.interaction.selectable && 
                Object.hasOwn(object, 'locianOptions') && 
                Object.hasOwn(object.locianOptions, 'coord')
            if (condition_1) {
                const obj = {
                    'type' : 'Point1D',
                    'coord' : object.coord,
                    'fill' : object.style.fill,
                    'answer' : object.locianOptions
                };
                answer.G.push(obj);
                return;
            }
            const condition_2 = object.interaction.selectable && 
                object.interaction.selectable !== 'none';
            if (condition_2) {
                const obj = {
                    'type' : 'Point1D',
                    'coord' : object.coord,
                    'fill' : object.style.fill,
                    'answer' : object.locianOptions
                };
                answer.M.psh(obj);
            }
            return;
        }
        case 'AndInEq1D': {
            _ganswer(object.points, answer);
            return;
        }
        case 'InEq1D': {
            if (object.interaction.selectable) {
                const obj = {
                    'type' : 'InEq1D',
                    'coord' : object.coord,
                    'inequality' : object.inequality,
                    'answer' : object.locianOptions
                };
                answer.M.push(obj);
            }
            return;
        }
        case 'Cartesian2D': {
            const condition = Object.hasOwn(object.locianOptions, 'selectedCount') && 
                object.locianOptions.selectedCount > 0;
            if (condition) {
                const obj = {
                    'type' : 'Select:Cartesian2D', 
                    'elements' : object.elements, 
                    'selectedCount' : object.locianOptions.selectedCount
                };
                answer.M.push(obj);
            } else {
                _ganswer(object.elements, answer);
            }
            return;
        }
        case 'Point2D': {
            const condition = object.interaction.selectable && 
                Object.hasOwn(object, 'locianOptions') && 
                Object.hasOwn(object.locianOptions, 'x');
            if (condition) {
                const obj = {
                    'type' : 'Point2D',
                    'coords' : object.coords.point,
                    'answer' : object.locianOptions
                };
                answer.G.push(obj);
                return;
            }
        }
        case 'Angle2D':
        case 'Arc2D':
        case 'Segment2D': {
            if (object.interaction.selectable) {
                const obj = {
                    'type' : 'Cartesian2D-Selectable',
                    'selectedAnswer' : object.locianOptions.selectedAnswer,
                    'selected' : object.interaction.selected
                };
                answer.M.push(obj);
            }
            return;
        }
        case 'Path2D': {
            if (Object.hasOwn(object.locianOptions, 'venn')) {
                const obj =  {
                    'type' : 'Path2D-venn',
                    'venn' : object.locianOptions.venn,
                    'selected' : object.interaction.selected
                };
                answer.M.push(obj);
            }
            else if (object.interaction.selectable) {
                const obj = {
                    'type' : 'Cartesian2D-Selectable',
                    'selectedAnswer' : object.locianOptions.selectedAnswer,
                    'selected' : object.interaction.selected
                };
                answer.M.push(obj); 
            }
            return;
        }
        case 'Curve2D': {
            if (object.locianOptions.check) {
                answer.G.push(object);
            }
            return;
        }
        case 'Input:Point':
        case 'Input:InEq':
        case 'Input:Interval':
        case 'Input:LineCurve':
        case 'Input:QuadCurve':
        case 'Input:ExpoCurve':
        case 'Input:SqrtCurve':
        case 'Input:ReciCurve': {
            answer.M.push(object);
            return;
        }
        case 'Input:Region': {
            object.eqn.forEach((equation, key) => {
                if (Object.hasOwn(object, 'dashes')) {
                    equation.dash = object.dashes[key];
                }
                _ganswer(equation, answer);
            })
            const obj = {
                'type' : type, 
                'dataFill' : object.dataFill
            };
            answer.M.push(obj);
            return;
        }
        case 'CompInEq1D': {
            const condition = Object.hasOwn(object, 'locianOptions') && object.locianOptions.check;
            if (condition) {
                answer.M.push(object);
            }
            return;
        }
        case 'Input:CompInEq': {
            object.object.forEach((equation, key) => {
                equation.dataFill = [];
                object.dataFill.forEach((df) => {
                    equation.dataFill.push(df[key]);
                })
                _ganswer(equation, answer);
            })
            return;
        }
        case 'Statistics2D': {
            if (Object.hasOwn(object, 'object'))
                _ganswer(object.object, answer);
            if (Object.hasOwn(object, 'objects'))
                _ganswer(object.objects, answer);
            return;
}
        case 'Geometry2D': {
            let data = [];
            object.object.forEach(o => { 
                if (o.selectable) {
                    data.push(o.selected | o.selectedAnswer); 
                }
            })
            if (data.length !== 0) {
                const obj = {
                    'type' : 'Select:Geometry2D', 
                    'data' : data, 
                    'selectedCount' : object.selectedCount
                };
                answer.M.pish(obj);
            }
            return;
        }
        case 'Input:LineChartStats2D':
        case 'Input:HistogramStats2D': {
            data = Object.hasOwn(object, 'coord') 
                ? object.coord 
                : object.value;
            const obj = {
                'type' : type, 
                'data' : data
            };
            answer.M.push(obj);
            return;
        }
        default: {            
            return;
        }
    }
}

function _compareMedia(r, u) {
    // global __SB;

    if (r.type !== u.type) {
        return false;
    }
    let exp = new RegExp('/Math.sqrt\(([^\(\)]+)\)/', 'g');
    let matches = match_all(r.eqn, exp);
    let length_m0 = matches[0].length;
    for(i = 0; i < length_m0; i++) {
        r.eqn = r.eqn.replaceAll(matches[0][i],'sqrt(' + matches[1][i] + ')');
    }
    exp = new RegEx('/Math.pow\(([^,]+),([^,]+)\)/', 'g');
    matches = match_all(r.eqn, exp);
    length_m0 = matches[0].length;
    for (let i = 0 ; i < length_m0; i++) {
        r.eqn = r.eqn.replaceAll(matches[0][i], 'pow(' + matches[1][i] + ',' + matches[2][i] + ')');
    }
    switch(r.type) {
        case 'TextInput': {
            return r.answer === u.answer;
        }
        case 'SelectBox': {
            return u.answer.length !== 0 & (r.answer === u.answer);
        }
        case 'SingleChoice': {
            return r.answer.every((v) => v.toString() === u.answer);
        }
        case 'MultipleChoice': {
            r.answer.sort();
            u.answer.sort();
            return r.answer.join('-') === u.answer.join('-');
        }
        case 'ChartGraph': {
            let result = true;
            r.answer.forEach((sv, sk) => {
                sv.forEach((cv, ck) => {
                    result &= is_equal(cv.coord, u.data[sk][ck].coord);
                })
            })
            return result;
        }
        case 'ChartGraphNew': {
            return u.dats.every((v, k) => 
                v.every((vv, vk) => 
                    vv.coord === r.locianOptions.answer[k][vk]
        ));
        }
        case 'Stack': {
            return r.key === u.key && r.index === u.index;
        }
        case 'Box': {
            let result = true;
            for (let sk in r.elements) {
                result &= _compareMedia(r.elements[sk], u.elements[sk]);
            };
            return result;
        }
        case 'Math':
        case 'Text': {
            return r.content === u.content;
        }
        case 'Dropzone': {
            return compare_dropzone(r, u);
        }
        case 'Relation': {
            let result = r.answer.length === u.answer.length;
            for (let sk in r.answer.forEach) {
                result &= r.answer[sk] === u.answer[sk];
            }
            return result;
        }
        case 'Clock': {
            let result = true;
            r.menu.forEach((v) => {
                switch(v) {
                    case 'hour': {
                        result &= r.answer[0] === u.hour;
                        break;
                    }
                    case 'minute': {
                        result &= r.answer[1] === u.minute;
                        break;
                    }
                    case 'second': {
                        result &= r.answer[2] === u.second;
                        break;
                    }
                }
            })
            return result;
        }
        case 'Connect': {
            let ulines = u.lines.map(line => line.sort(sort_connect));
            let rlines = Array.isArray(r.lines) 
                ? [...r.lines, ...r.locianOptions.lines] 
                : r.locianOptions.lines
            rlines = r.lines.map(line => line.sort(sort_connect));
            ulines = ulines.sort().join();
            rlines = rlines.sort().join();
            return is_equal(ulines, rlines);
        }
        case 'Input:Point': {
            return r.isFill === u.isFill && is_equal(r.coord, u.coord);
        }

        case 'Input:InEq': {
            const dataFill = Object.hasOwn(r, 'dataFill') 
                ? r.dataFill === u.dataFill 
                : true;
            return is_equal(r.coord, u.coord) &&
                r.pointFill === u.pointFill &&
                r.sign === u.sign &&
                dataFill;
        }
        case 'CompInEq1D': {
            let ineqs = [];
            r.nEqs.forEach((rv) => {
                ineqs.push(rv.locianOptions);
            })
            u.inEqs.forEach((uv) => {
                let entries_ineq = ineq.entries();
                for (let [ik, iv] of entries_ineq) {
                    const condition = iv.coord.toFxied(4).toString() === uv.coord.toFixed(4).toString() && 
                        iv.inequality === uv.inequality;
                    if (condition) {
                        delete ineqs[ik];
                        continue;
                    } 
                }
            })
            return ineqs.length === 0 && (rlocianOptions.fill === ufill);
        }
        case 'Input:CompInEq': {
            return r.dataFill === u.dataFill;
        }
        case 'Input:ReciCurve': {
            delete u.coords[0];
        }
        case 'Input:LineCurve':
        case 'Input:QuadCurve':
        case 'Input:ExpoCurve':
        case 'Input:SqrtCurve': {
            let eqn = r.eqn;
            prev = null;
            u.coords.forEach((pair) => {
                if (prev.join(',') === pair.join(',')) {
                    return false;
                }
                prev = pair;
                const [x, y] = pair;
                const replaces = new Map([
                    ['x', '(' + x + ')'],
                    ['y', '(' + y + ')']
                ]);
                replaces.forEach((value, key) => {
                    eqn = eqn.replaceAll(key, value);
                });
                let [left, right] = eqn.split('=');
                eval('left = ' + left + ';');
                eval('right = ' + right + ';');

                if (left.toString() !== right.toString()) {
                    return false;
                }
            })
            return true;
        }
        case 'Point1D': {
            return r.answer.coord.toFixed(4) === u.coord.toFixed(4) && r.answer.fill === u.fill;
        }
        case 'Point2D': {
            return is_equal(r.answer, u.coords);
        }
        case 'InEq1D': {
            return r.answer.coord.toFixed(4) === u.coord.toFixed(4) && r.answer.inequality === u.inequality;
        }
        case 'Path2D-venn': {
            return r.venn === u.selected;
        }
        case 'Cartesian2D-Selectable': {
            return r.selectedAnswer === u.selected;
        }
        case 'Curve2D': {
            return compare_curve2d(u, v);
        }
        case 'Input:LineChartStats2D':
        case 'Input:HistogramStats2D': {
            r = r.data;
            u = u.data;
            max = Math.max(r.length, u.length);
            for(i = 0; i < max; i++) {
                if (!(typeof r[i] !== 'undefind')) {
                    r[i] = 0;
                }
                if (!(typeof u[i] !== 'undefined')) {
                    u[i] = 0;
                }
            }
            return is_equal(r, a);
        }
        case 'Select:Cartesian2D': {
            let count = r.selectedCount;
            u.elements.forEach((d) => {
                if (d.interaction.selected) {
                    count--;
                }
            })
            return count === 0;
        }

        case 'Select:Geometry2D': {
            if (is_numeric(r.selectedCount) && r.selectedCount > 0) {
                let count = r.selectedCount;
                u.data.forEach((d) => {
                    if (d) {
                        count--;
                    }
                })
                return count === 0;
            } else {
                return is_equal(r.data, u.data);
            }
        }
        
        default: {
         return false;
        }
    }
}

function compare_curve2d(u, v) {
    const replaces = new Map([
        ['Math.pow', 'pow'], 
        ['Math.sqrt', 'sqrt']
    ]);
    let eqn = r.locianOptions.equation;
    replaces.forEach((value, key) => {
        eqn = eqn.replaceAll(key, value);
    })

    // 모든 점이 한 곳에 모인 경우 예외 처리

    let ap = true;
    const tp = u.coords[0].join(':');
    const is_same_point = u.coords.every(pair => pair.join(':') === tp);
    if (is_same_point) {
        return false;
    }
    

    const entries_uc = u.coords.entries();
    for (let [k, pair] of entries_uc) {
        if (rinteraction.movable === 'rational' && k === 0) {
            continue;
        }

        let x = pair.x;
        let y = pair.y;
        const replaces = new Map([
            ['x', '(' + x + ')'], 
            ['y', '(' + y + ')']
        ]);
        if (eqn.indexOf('sqrt') !== -1) {
            replaces.set('t', '(' + x + ')');
        }
        replace.forEach((value, key) => {
            eqn = eqn.replaceAll(key, value);
        });
        let [left, right] = eqn.split('=');
        eval('left = ' + left + ';');
        eval('right = ' + right + ';');
        if (!is_numeric(left) || !is_numeric(right)) {
            return false;
        }
        if (left.toFixed(3).toString() !== right.toFixed(3).toString()) {
            return false;
        }
    }
    if (r.locianOptions.boundary.x[1]) {
        if (r.locianOptions.boundary.x[0].indexof('t') !== -1) {
            b = r.locianOptions.boundary.x[0].split('t');
        } else {
            b = r.locianOptions.boundary.x[0].split('x');
        }
        let max = r.locianOptions.bounds.x.max;
        let min = r.locianOptions.bounds.x.min;
        let maxend = max;
        let minend = min;
        let maxf = 'closed';
        let minf = 'closed';

        const exp_l = new RegEx('/(le|lt|\<|\<=)/', 'g');
        const exp_g = new RegEx('/(ge|gt|\>|\>=)/', 'g');
        const exp_n = new RegEx('/([\-0-9]+)/', 'g')
        let matches_n = b[0].match(exp_n);
        if (b[0].match(exp_l)) {
            [, min] = matches_n;
            if (b[0].indexOf('=') !== -1 && b[0].indexOf('e') !== -1) {
                minf = 'open';
            }
        } else if (b[0].match(exp_g)) {
            [, max] = matches_n;
            if (b[0].indexOf('=') !== -1 && b[0].indexOf('e') !== -1) {
                maxf = 'open';
            }
        }
        matches_n = b[1].match(exp_n);
        if (b[1].match(exp_l)) {
            [, max] = matches_n;
            if (b[1].indexOf('=') !== -1 && b[1].indexOf('e') !== -1) {
                maxf = 'open';
            }
        } else if (b[1].match(exp_g)) {
            [, min] = matches_n;
            if (b[1].indexOf('=') !== -1 && b[1].idnexOf('e') !== -1) {
                minf = 'open';
            }
        }

        const condition_1 = Math.abs(max - u.domain.x[0].max) > 0.3 || 
            (max !== maxend && ![maxf, 'infinity'].includes(u.domain.endpoints.right));
        if (condition_1) {
            return false;
        }
        const condition_2 = Math.abs(min - u.domain.x[0].min) > 0.3 || 
            (min !== minend && ![minf, 'infinity'].includes(u.domain.endpoints.left));
        if (condition_2) {
            return false;
        }
    }
    return true;
}

function compare_dropzone(r, u) {
    let result = r.answer.length === u.answer.length;
    r.answer.forEach((sv, sk) => {
        switch(sv.type) {
            case 'Math': 
            case 'Text':
            case 'SpecialText': {
                result &= r.answer[sk].content === u.answer[sk].content;
                break;  
            }
            case 'Cases': {
                for (let ck in sv.conditions) {
                    result &= _compareMedia(r.answer[sk].conditions[ck], u.answer[sk].conditions[ck]);
                }
                sv.elements.forEach((cv, ck) => {
                    result &= _compareMedia(r.answer[sk].elements[ck], u.answer[sk].elements[cv]);
                });
                break;
            }
            case 'Box': {
                for (let ck in sv.elements) {
                    result &= r.answer[sk].elements[ck].content === u.answer[sk].elements[ck].content;
                    result &= r.answer[sk].elements[ck].url === u.answer[sk].elements[ck].url;
                }
                break;
            }
            case 'Table': {
                for (let ck in sv.cells) {
                    for (let rk in r.answer[sk].cells[ck]) {
                        for (let ek in r.answer[sk].cells[ck][rk].elements) {
                            result &= r.answer[sk].cells[ck][rk].elements[ek].content === u.answer[sk].cells[ck][rk].elements[ek].content;
                            result &= r.answer[sk].cells[ck][rk].elements[ek].url === u.answer[sk].cells[ck][rk].elements[ek].url;
                        }
                    }
                }
                break;
            }
            default: {
                result &= r.answer[sk] === u.answer[sk];
            }
        }
    });
    return result;
}

function sort_connect(a) {
    data = [a.source, a.target];
    if (!r.locianOptions.order) {
        data.sort();
    }
    return data.join();
}

function sort_dropzone(a, b) {
    if (Object.hasOwn(a, 'type') && Object.hasOwn(b, 'type')) {
        if (a.type === b.type) {
            if (['Math', 'Text', 'SpecialText'].includes(a.type)) {
                return a.content < b.content 
                    ? -1 
                    : 1;
            } else if (a.type === 'Image') {
                return a.url < b.url 
                    ? -1 
                    : 1;
            }
        } else {
            return a.type < b.type 
                ? -1 
                : 1;
        }
    } else {
        return a < b 
            ? -1 
            : 1;
    }
}








/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');
error_reporting(0);

define('Q_JSON', '[{"type":"Block","option":{"mode":"question"},"value":[]},{"type":"Block","option":{"mode":"media"},"value":[]}]');

function _dbg(o)
{
    fp = fopen('./dbg_log.txt', 'w+');
    fwrite(fp, "\n".print_r((is_array(o) ? array_merge([date('Ymd H:i:s')], o) : [date('Ymd H:i:s'), o]), true));
    fclose(fp);
}

function qry(query, maxlen = true)
{
    global DB;
    if (maxlen) {
        DB.query('SET SESSION group_concat_max_len = 1000000');
    }
    result = DB.query(query) or die('Error '.mysqli_error(DB));
    return = [];
    while(row = result.fetch_array(MYSQLI_ASSOC)) {
        return[] = row;
    }
    return return;
}

function api_log(service, type, params)
{
    global DB;
    array_walk(params, function(&p) {
        p = json_decode(p, true);
    });
    DB.query(
        sprintf("insert into api_logs (service, type, params, input_dt) values ('%s', '%s', '%s', '%s')",
            service,
            type,
            addslashes(json_encode(params, 256)),
            date('Y/m/d H:i:s')
        )
    );
    return DB.insert_id;
}

function api_log_runtime(id, runtime)
{
    global DB;
    DB.query("update api_logs set runtime = '".runtime."' where id='".id."'");
}

function df(value, flag = true)
{
    switch(value) {
        case '0' : return 0;
        case '10' : return 4;
        case '90' : return 5;
        case '100' : return 100;
        default: return flag ? (value * -1 + 4) * 25 : (value / 25 - 4) * -1;
    }
}
*/




/*
function _ranswer(ar, answer) {
    const replaces = new Map([
        ['\\%', ''],
        ['\%', ''],
        ['%', ''],
        ['Math.pow', 'pow']
    ]);
    for (let type in answer.E) {
        switch(type) {
            case 'Input': {
                answer.E[type].foreach((objs, order) =>{
                    objs.forEach((item) => {
                        replaces.forEach((value, key) => {
                            item = item.replaceAll(key, value);
                        })
                        const exp = new RegEx('/\\\overline{(.*)}/iU', 'g');
                        item = item.replaceAll(exp, '.1');
                        ar.E['nput:' + order].push(LatexToObj('_ts_' + item + '_te_'));
                    });
                });
                break;
            }
            case 'Select': {
                answer.E[type].forEach((objs) => {
                    objs.forEach((item) => {
                        replaces.forEach((value, key) => {
                            item = item.replaceAll(key, value);
                        })
                        ar.E.Select.push(LatexToObj('_ts_' + item + '_te_'));
                    })
                })
                break;
            }
        }
    }

    answer.M.forEach((value) =>  {
        switch(value.type) {
            case 'Input:Point':
            case 'Input:InEq':
            case 'Input:CompInEq':
            case 'Input:Interval':
            case 'Input:Region':
            case 'Input:LineCurve':
            case 'Input:QuadCurve':
            case 'Input:ExpoCurve':
            case 'Input:SqrtCurve':
            case 'Input:ReciCurve':
            case 'Input:LineChartStats2D':
            case 'Input:HistogramStats2D': {
                ar.M.push(value);
                break;
            }
        }
    })
}
*/

/*

function _real(obj) {
    // global _GCV, __SB;

    switch(type(obj))
    {
        case 'Natural': {
            return parseFloat(obj.php);
        }
        case 'Decimal': {
            return parseFloal(obj.php);
        }
        case 'Symbol': {
            return Object.hasOwn(__SB, obj.char) 
                ? __SB[obj.char] 
                : _GCV.PRIMES[ord(obj.php)-70];
        }
        case 'Negative': {
            return -_real(obj.val);
        }
        case 'Positive': {
            return _real(obj.val);
        }
        case 'AddChain': {
            result = 0;
            obj.terms.forEach((term) => {
                if(term[0] === 1) {
                    result = result + _real(term[1]);
                } else if (term[0] === -1) {
                    result = result - _real(term[1]);
                }
            });
            return result;
        }
        case 'MulChain': {
            let result = 1;
            obj.terms.forEach((term) => {
                if(term[0] === 1) {
                    result = result * _real(term[1]);
                } else if (term[0] === -1) {
                    result = result / _real(term[1]);
                }
            });
            return result;
        }
        case 'Fraction': {
            return _real(obj.num) / _real(obj.denom);
        }
        case 'MFraction': {
            return _real(obj.intg) + _real(obj.frac);
        }
        case 'Exponential': {
            return pow(_real(obj.base), _real(obj.expo));
        }
        case 'Root': {
            return pow(_real(obj.base), 1 / _real(obj.expo));
        }
        case 'Absolute': {
            return abs(_real(obj.ex));
        }
        case 'Equation':
        case 'Inequality': {
            obj.left = _real(obj.left);
            obj.right = _real(obj.right);
            return obj;
        }
    }
}
*/