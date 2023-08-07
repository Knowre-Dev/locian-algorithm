import {Dropzone_getAnswer} from '../rc/function_148.inc.js';
import {SingleChoice_getAnswer} from '../rc/function_150.inc.js';
import {MultipleChoice_getAnswer} from '../rc/function_151.inc.js';
import {Cartesian1D_getAnswer} from '../rc/function_165.inc.js';
import {Cartesian2D_getAnswer} from '../rc/function_168.inc.js';
import {Relation_getAnswer} from '../rc/function_169.inc.js';
import {Tree_getAnswer} from '../rc/function_172.inc.js';
import {Chart_getAnswer} from '../rc/function_173.inc.js';
import {GridChart_getAnswer} from '../rc/function_174.inc.js';
import {Cases_getAnswer} from '../rc/function_175.inc.js';
import {Partial_getAnswer} from '../rc/function_176.inc.js';
import {Box_getAnswer} from '../rc/function_177.inc.js';
import {Block_getAnswer} from '../rc/function_178.inc.js';
import {Layer_getAnswer} from '../rc/function_179.inc.js';
import {Span_getAnswer} from '../rc/function_180.inc.js';
import {Lattice_getAnswer} from '../rc/function_181.inc.js';
import {Table_getAnswer} from '../rc/function_182.inc.js';
import {DotPlot1D_getAnswer} from '../rc/function_189.inc.js';
import {Trig_getAnswer} from '../rc/function_193.inc.js';
import {CircleGraph_getAnswer} from '../rc/function_203.inc.js';

var checktypeDefault = null;

var answer = new Object();

console.log('148. Dropzone_getAnswer');
var dropzone = {"type":"Dropzone","elements":[{"type":"DraggableObject","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}]],"size":{"width":0},"dynamic":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1}}]],"size":{"width":0},"dynamic":true}],"padding":{"top":0.75,"bottom":0.75,"left":0.75,"right":0.75}},{"type":"DraggableObject","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}]],"size":{"width":0},"dynamic":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1}}]],"size":{"width":0},"dynamic":true}],"padding":{"top":0.75,"bottom":0.75,"left":0.75,"right":0.75}},{"type":"DraggableObject","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}],[{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/flower.png"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}},{"type":"TableCellBox","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"size":{"fixedWidth":32,"fixedHeight":32}}]],"size":{"width":0},"dynamic":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1}}]],"size":{"width":0},"dynamic":true}],"padding":{"top":0.75,"bottom":0.75,"left":0.75,"right":0.75}}],"valid":[],"count":3,"remove":false,"copy":false,"align":"center","verticalAlign":"top","size":{"height":10},"answer":[],"locianOptions":{"check":false},"useElementPosition":false,"elementPosition":"left","border":{"top":{"width":0,"style":"solid","color":{"code":0}},"right":{"width":0,"style":"solid","color":{"code":0}},"bottom":{"width":0,"style":"solid","color":{"code":0}},"left":{"width":0,"style":"solid","color":{"code":0}}}}

console.log(Dropzone_getAnswer(dropzone, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('150. SingleChoice_getAnswer');

var singleChoice = {"type":"SingleChoice","display":"inline-block","choices":[{"type":"Box","elements":[{"type":"Math","content":"1","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"inch","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Math","content":"2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"inches","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Math","content":"5","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"inches","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Math","content":"10","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"inches","wrap":true,"whiteSpaces":false}],"display":"inline-block"}],"answer":"2","choiceBorder":false,"buttonAlign":"middle"}

console.log(SingleChoice_getAnswer(singleChoice, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('151. MultipleChoice_getAnswer');
var multipleChoice = {"type":"MultipleChoice","display":"inline-block","choices":[{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a yellow","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"and","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a white","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a purple","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"an orange","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a white","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a red","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"an orange","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"and","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a purple","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"},{"type":"Box","elements":[{"type":"Text","content":"drawing","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"a yellow","wrap":true,"whiteSpaces":false},{"type":"Text","content":" ","wrap":true,"whiteSpaces":false},{"type":"Text","content":"marble","wrap":true,"whiteSpaces":false}],"display":"inline-block"}],"answer":["1","2","3","4","6"],"choiceBorder":false,"buttonAlign":"middle"}

console.log(MultipleChoice_getAnswer(multipleChoice, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('165. Cartesian1D_getAnswer');
var cartesian1D = {"type":"Cartesian2D","object":[{"type":"Grid2D","value":[[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12],[-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12]]},{"type":"GridLabel2D","value":[[[-10,{"type":"Static","mode":"math","value":"-10"}],[-8,{"type":"Static","mode":"math","value":"-8"}],[-6,{"type":"Static","mode":"math","value":"-6"}],[-4,{"type":"Static","mode":"math","value":"-4"}],[-2,{"type":"Static","mode":"math","value":"-2"}],[2,{"type":"Static","mode":"math","value":"2"}],[4,{"type":"Static","mode":"math","value":"4"}],[6,{"type":"Static","mode":"math","value":"6"}],[8,{"type":"Static","mode":"math","value":"8"}],[10,{"type":"Static","mode":"math","value":"10"}]],[[-10,{"type":"Static","mode":"math","value":"-10"}],[-8,{"type":"Static","mode":"math","value":"-8"}],[-6,{"type":"Static","mode":"math","value":"-6"}],[-4,{"type":"Static","mode":"math","value":"-4"}],[-2,{"type":"Static","mode":"math","value":"-2"}],[-0.84,{"type":"Static","mode":"math","value":"0"}],[2,{"type":"Static","mode":"math","value":"2"}],[4,{"type":"Static","mode":"math","value":"4"}],[6,{"type":"Static","mode":"math","value":"6"}],[8,{"type":"Static","mode":"math","value":"8"}],[10,{"type":"Static","mode":"math","value":"10"}]]]},{"type":"Axis2D","value":[{"name":{"type":"Static","mode":"math","value":"x"},"visible":true},{"name":{"type":"Static","mode":"math","value":"y"},"visible":true}],"origin":false},{"type":"Punctum","input":false,"coord":[-3,-10],"isFill":true,"selected":false,"color":104},{"type":"Label2D","coord":["-3","-10"],"label":{"type":"Static","mode":"math","value":"D\\left(-3,\\text{  }-10\\right)"},"labelSign":"SS","input":false,"option":[]},{"type":"Punctum","input":false,"coord":[4,"-2"],"isFill":true,"selected":false,"color":100},{"type":"Label2D","coord":["4","-2"],"label":{"type":"Static","mode":"math","value":"D'"},"labelSign":"SS","input":true,"option":[],"color":100}],"bound":[[-12,12],[-12,12]],"menu":[],"menuOption":{"curveColor":[103],"pointColor":[103],"defaultPosition":"parent","bounded":false,"endPoint":[true,true],"bound":[-12,12]},"size":1}
  
console.log(Cartesian1D_getAnswer(cartesian1D, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('168. Cartesian2D_getAnswer');
var cartesian2D = {"type":"Cartesian2D","object":[{"type":"Grid2D","value":[[-1,0,1,2,3,4,5],[-1,0,1,2,3,4,5]]},{"type":"GridLabel2D","value":[[[1,{"type":"Static","mode":"math","value":"1"}],[2,{"type":"Static","mode":"math","value":"2"}],[3,{"type":"Static","mode":"math","value":"3"}],[4,{"type":"Static","mode":"math","value":"4"}]],[[-0.21,{"type":"Static","mode":"math","value":"0"}],[1,{"type":"Static","mode":"math","value":"1"}],[2,{"type":"Static","mode":"math","value":"2"}],[3,{"type":"Static","mode":"math","value":"3"}],[4,{"type":"Static","mode":"math","value":"4"}]]]},{"type":"Axis2D","value":[{"name":{"type":"Static","mode":"math","value":"x"},"visible":true},{"name":{"type":"Static","mode":"math","value":"y"},"visible":true}],"origin":false},{"type":"Punctum","input":false,"coord":[1,3],"isFill":true,"selected":false,"color":100},{"type":"Punctum","input":false,"coord":[2,3],"isFill":true,"selected":false,"color":100},{"type":"Punctum","input":false,"coord":[3,3],"isFill":true,"selected":false,"color":100},{"type":"Punctum","input":false,"coord":[4,3],"isFill":true,"selected":false,"color":100}],"bound":[[-1,5],[-1,5]],"menu":[],"menuOption":{"curveColor":[103],"pointColor":[103],"defaultPosition":"parent","bounded":false,"endPoint":[true,true],"bound":[-1,5]},"size":1}
  
console.log(Cartesian2D_getAnswer(cartesian2D, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('169. Relation_getAnswer');
var relation = {"type":"Relation","sets":[{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.2},"align":{"hor":"right"},"elements":[{"type":"Math","content":"-5","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"1","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"4","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"x","wrap":false,"whiteSpaces":true,"innerPadding":false}},{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.2},"align":{"hor":"left"},"elements":[{"type":"Math","content":"-2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"3","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"5","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"y","wrap":false,"whiteSpaces":true,"innerPadding":false}}],"maps":[{"type":"RelationMap","data":[],"interaction":true,"arrow":true,"source":{"offset":0.07,"size":0.3,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"target":{"offset":0.07,"size":0.3,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"size":{"width":0.4},"color":{"code":0,"weight":"opaqueHard"}}],"size":1,"locianOptions":{"answer":{"data":[[{"source":3,"target":2},{"source":1,"target":2},{"source":0,"target":0},{"source":2,"target":1}]]}},"display":"inline-block","align":{"hor":"right"},"input":false}
  
console.log(Relation_getAnswer(relation, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('172. Tree_getAnswer');
var tree = {"type":"Tree","nodes":[{"type":"TreeNode","content":{"type":"Blank"},"style":{"lineVisible":false},"children":[{"type":"TreeNode","content":{"type":"MathInput","content":"\\text{p}","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B0","answerType":"84","lacoType":"3","whitelist":[],"blacklist":[]},"keypadGroups":[]},"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}},"children":[{"type":"TreeNode","content":{"type":"MathInput","content":"1","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"2","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"3","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"4","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"5","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"6","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1B1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}}]},{"type":"TreeNode","content":{"type":"MathInput","content":"\\text{b}","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C0","answerType":"84","lacoType":"3"},"keypadGroups":[]},"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}},"children":[{"type":"TreeNode","content":{"type":"MathInput","content":"1","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"2","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"3","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"4","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"5","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"6","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1C1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}}]},{"type":"TreeNode","content":{"type":"MathInput","content":"\\text{r}","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D0","answerType":"84","lacoType":"3"},"keypadGroups":[]},"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}},"children":[{"type":"TreeNode","content":{"type":"MathInput","content":"1","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"2","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"3","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"4","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"5","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}},{"type":"TreeNode","content":{"type":"MathInput","content":"6","size":{"width":0.8,"height":1},"align":{"hor":"left"},"locianOptions":{"order":"A1D1","answerType":"84","lacoType":"3"},"keypadGroups":[]},"children":[],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"style":{"color":{"code":0}}}]}],"label":{"type":"Blank","font":{"color":{"background":{"code":7}}}},"border":{"top":{"width":0},"right":{"width":0},"bottom":{"width":0},"left":{"width":0}},"edgeLength":0.3}],"nodeTitles":[],"lastLeafElements":[],"flow":"right","size":1,"ratio":1,"display":"inline-block","useLastLeafAlign":true,"value":null}

console.log(Tree_getAnswer(tree, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('173. Chart_getAnswer');
var chart = new Object();

console.log(Chart_getAnswer(chart, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('174. GridChart_getAnswer');
var gridChart = new Object();

console.log(GridChart_getAnswer(gridChart, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('175. Cases_getAnswer');
var cases = new Object();

console.log(Cases_getAnswer(cases, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('176. Partial_getAnswer');
var partial = {
    "type": "Partial",
    "value": "3\\times \\frac{5}{8}= \\editable{}",
    "object": [
        {
            "type": "Input",
            "mode": "math",
            "value": "",
            "option": {
                "order": 0,
                "width": 2,
                "height": 2,
                "answerType": "0",
                "lacoType": "2",
                "whitelist": [],
                "blacklist": [],
                "grammar": "default_up"
            },
            "content": "\\frac{15}{8}",
            "size": {
                "width": 2
            }
        }
    ],
    "content": "3\\times \\frac{5}{8}= \\editable{}"
}

console.log(Partial_getAnswer(partial, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('177. Box_getAnswer');
var box = {"type":"Box","elements":[{"type":"MultipleChoice","display":"block","choices":[{"type":"Relation","sets":[{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"right"},"elements":[{"type":"Math","content":"9","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"1","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"x","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}},{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"left"},"elements":[{"type":"Math","content":"-7","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"4","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"3","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"7","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"y","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}}],"maps":[{"type":"RelationMap","data":[{"source":0,"target":3},{"source":1,"target":0},{"source":1,"target":2},{"source":2,"target":1}],"interaction":false,"arrow":true,"source":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"target":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"size":{"width":0.2},"color":{"code":4,"weight":"opaqueHard"}}],"size":1,"ratio":0.8},{"type":"Relation","sets":[{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"right"},"elements":[{"type":"Math","content":"7","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"9","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"6","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"4","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"x","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}},{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"left"},"elements":[{"type":"Math","content":"3","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"6","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"5","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"y","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}}],"maps":[{"type":"RelationMap","data":[{"source":0,"target":1},{"source":1,"target":3},{"source":2,"target":0},{"source":3,"target":2}],"interaction":false,"arrow":true,"source":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"target":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"size":{"width":0.2},"color":{"code":4,"weight":"opaqueHard"}}],"size":1,"ratio":0.8},{"type":"Relation","sets":[{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"right"},"elements":[{"type":"Math","content":"-2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"1","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"9","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-5","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"x","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}},{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"left"},"elements":[{"type":"Math","content":"-5","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-2","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"9","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"1","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"y","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}}],"maps":[{"type":"RelationMap","data":[{"source":0,"target":1},{"source":1,"target":3},{"source":1,"target":0},{"source":2,"target":2}],"interaction":false,"arrow":true,"source":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"target":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"size":{"width":0.2},"color":{"code":4,"weight":"opaqueHard"}}],"size":1,"ratio":0.8},{"type":"Relation","sets":[{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"right"},"elements":[{"type":"Math","content":"3","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"8","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-4","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-2","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"x","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}},{"type":"RelationSet","border":{"top":{"color":{"code":0,"weight":"translucentHard"},"width":2},"bottom":{"color":{"code":0,"weight":"translucentHard"},"width":2},"right":{"color":{"code":0,"weight":"translucentHard"},"width":2},"left":{"color":{"code":0,"weight":"translucentHard"},"width":2},"radius":{"topLeft":0.4,"topRight":0.4,"bottomRight":0.4,"bottomLeft":0.4}},"size":{"width":0.4},"align":{"hor":"left"},"elements":[{"type":"Math","content":"-1","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"0","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"5","wrap":false,"whiteSpaces":true,"innerPadding":false},{"type":"Math","content":"-8","wrap":false,"whiteSpaces":true,"innerPadding":false}],"label":{"type":"Math","content":"y","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"background":{"code":7}},"size":1}}}],"maps":[{"type":"RelationMap","data":[{"source":0,"target":2},{"source":0,"target":3},{"source":1,"target":0},{"source":2,"target":2},{"source":3,"target":1}],"interaction":false,"arrow":true,"source":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"target":{"offset":0.1,"size":0.2,"color":{"code":0,"weight":"opaqueHard"},"fillColor":{"code":0,"weight":"opaqueHard"}},"size":{"width":0.2},"color":{"code":4,"weight":"opaqueHard"}}],"size":1,"ratio":0.8}],"answer":["1"],"choiceBorder":false,"buttonAlign":"top","column":2,"numbering":"A"}],"align":{"hor":"left"},"size":{"width":1}}

console.log(Box_getAnswer(box, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');


console.log('178. Block_getAnswer');
var block = {"type":"Block","value":[{"type":"Static","mode":"text","value":"The lengths of two sides of "},{"type":"Static","mode":"math","value":"\\triangle {\\text{BCA}}","option":[]},{"type":"Static","mode":"text","value":" are "},{"type":"Static","mode":"math","value":"4","option":{"color":0}},{"type":"Static","mode":"text","value":" units and "},{"type":"Static","mode":"math","value":"6","option":{"color":0}},{"type":"Static","mode":"text","value":" units, and the lengths of the corresponding sides of "},{"type":"Static","mode":"math","value":"\\triangle {\\text{DEA}}","option":[]},{"type":"Static","mode":"text","value":" are "},{"type":"Static","mode":"math","value":"g","option":[]},{"type":"Static","mode":"text","value":" units and "},{"type":"Static","mode":"math","value":"h","option":[]},{"type":"Static","mode":"text","value":" units, respectively. Since the lengths of the corresponding sides of similar triangles are proportional, "},{"type":"Static","mode":"math","value":"\\frac{3}{2}=\\frac{3}{2}"},{"type":"Static","mode":"text","value":"."},{"type":"Static","mode":"newline","height":"0.1"},{"type":"Static","mode":"newline","height":"0.1"},{"type":"Static","mode":"text","value":"Using the vertices "},{"type":"Static","mode":"math","value":"\\text{A}\\left(0,\\text{  }0\\right)"},{"type":"Static","mode":"text","value":" and "},{"type":"Static","mode":"math","value":"\\text{B}\\left(4,\\text{  }6\\right)"},{"type":"Static","mode":"text","value":", the slope "},{"type":"Static","mode":"math","value":"m_{1}","option":[]},{"type":"Static","mode":"text","value":" of "},{"type":"Static","mode":"math","value":"\\overline{\\text{AB}}","option":[]},{"type":"Static","mode":"text","value":" of "},{"type":"Static","mode":"math","value":"\\triangle {\\text{BCA}}","option":[]},{"type":"Static","mode":"text","value":" is "},{"type":"Static","mode":"math","value":"m_{1}= \\frac{3}{2}"},{"type":"Static","mode":"text","value":". Using the vertices "},{"type":"Static","mode":"math","value":"\\text{A}\\left(0,\\text{  }0\\right)"},{"type":"Static","mode":"text","value":" and "},{"type":"Static","mode":"math","value":"\\text{D}\\left(g,\\text{  }h\\right)"},{"type":"Static","mode":"text","value":", the slope "},{"type":"Static","mode":"math","value":"m_{2}","option":[]},{"type":"Static","mode":"text","value":" of "},{"type":"Static","mode":"math","value":"\\overline{\\text{AD}}","option":[]},{"type":"Static","mode":"text","value":" is "},{"type":"Static","mode":"math","value":"m_{2}= \\frac{3}{2}"},{"type":"Static","mode":"text","value":"."},{"type":"Static","mode":"newline","height":"0.1"},{"type":"Static","mode":"newline","height":"0.1"},{"type":"Static","mode":"text","value":"Since "},{"type":"Static","mode":"math","value":"\\frac{3}{2}=\\frac{3}{2}"},{"type":"Static","mode":"text","value":", "},{"type":"Static","mode":"math","value":"m_{1}=m_{2}"},{"type":"Static","mode":"text","value":"."}],"option":{"mode":"normal","width":100,"align":"center","textAlign":"left","title":null,"border":false}}

console.log(Block_getAnswer(block, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('179. Layer_getAnswer');
var layer = {"type":"Layer","source":{"type":"Image","url":"https:\/\/contents.knowreapi.com\/us\/illust\/ThermC.png"},"elements":[{"type":"Shade","row":12,"border":{"color":{"code":0},"width":2},"cellBorder":{"color":{"code":2},"width":1.7},"size":{"fixedWidth":49,"fixedHeight":382},"position":{"fixedLeft":541,"fixedTop":59},"selectedCells":[{"row":10,"column":0},{"row":11,"column":0}],"interaction":{"draggable":true,"continuous":true},"direction":"backward","locianOptions":{"check":true,"selectedCells":[{"row":10,"column":0},{"row":11,"column":0},{"row":9,"column":0},{"row":8,"column":0},{"row":7,"column":0},{"row":6,"column":0},{"row":5,"column":0},{"row":4,"column":0},{"row":3,"column":0},{"row":2,"column":0},{"row":1,"column":0},{"row":0,"column":0}]}}],"target":null}

console.log(Layer_getAnswer(layer, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('180. Span_getAnswer');
var span = {"type":"Span","value":[{"type":"Static","mode":"math","value":"0.8","option":{"color":0}},{"type":"Static","mode":"math","value":"\\qquad"},{"type":"Static","mode":"math","value":"0.08","option":{"color":0}},{"type":"Static","mode":"math","value":"\\qquad"},{"type":"Static","mode":"math","value":"\\frac{8}{1,000}","option":{"color":0}}]}
//,{"type":"Static","mode":"text","value":" "},{"type":"Static","mode":"math","value":"\\qquad"},{"type":"Static","mode":"text","value":" "},{"type":"Static","mode":"math","value":"0.0008"},{"type":"Static","mode":"text","value":" "},{"type":"Static","mode":"math","value":"\\qquad"},{"type":"Static","mode":"text","value":" "},{"type":"Span","value":[{"type":"Static","mode":"math","value":"0.00008","option":{"color":0}}]}//


console.log(Span_getAnswer(span, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('181. Lattice_getAnswer');
var lattice = {"type":"Lattice","value":[[{"object":{"type":"Static","mode":"illust","value":"marking\/png\/mark_noncheck.png"},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":5}},{"object":{"type":"Static","mode":"text","value":"No solution"},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":10}}],[{"object":{"type":"Static","mode":"illust","value":"marking\/png\/mark_noncheck.png"},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":5}},{"object":{"type":"Static","mode":"text","value":"Infinitely many solutions"},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":10}}],[{"object":{"type":"Static","mode":"illust","value":"marking\/png\/mark_check.png"},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":5}},{"object":{"type":"Span","value":[{"type":"Static","mode":"text","value":"One solution: "},{"type":"Static","mode":"math","value":"\\left(-2,\\text{ }-1\\right)"}]},"option":{"background":0,"preset":[],"textAlign":"left","verticalAlign":"middle","paddingTop":5,"paddingBottom":5,"paddingRight":5,"paddingLeft":10}}]]}

console.log(Lattice_getAnswer(lattice, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('182. Table_getAnswer');
var table = {"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Box","elements":[{"type":"Math","content":"0.5"}],"align":{"hor":"right","ver":"middle"},"size":{"height":2,"fixedWidth":80}}],"align":{"hor":"right","ver":"middle"},"size":{"height":2,"fixedWidth":80},"padding":{"top":0,"bottom":0.3}},{"type":"TableCellBox","elements":[{"type":"Stack","elements":[{"type":"Box","elements":[{"type":"Blank"}],"align":{"hor":"center","ver":"middle"},"border":{"top":{"width":1,"color":{"code":1}},"right":{"width":1,"color":{"code":1}},"bottom":{"width":1,"color":{"code":1}},"left":{"width":1,"color":{"code":1}},"radius":{"topLeft":1,"topRight":1,"bottomRight":1,"bottomLeft":1}},"size":{"height":2,"fixedWidth":55},"color":{"code":1}},{"type":"Box","elements":[{"type":"Math","content":"\\gt"}],"align":{"hor":"center","ver":"middle"},"border":{"top":{"width":1,"color":{"code":1}},"right":{"width":1,"color":{"code":1}},"bottom":{"width":1,"color":{"code":1}},"left":{"width":1,"color":{"code":1}},"radius":{"topLeft":1,"topRight":1,"bottomRight":1,"bottomLeft":1}},"size":{"height":2,"fixedWidth":55}},{"type":"Box","elements":[{"type":"Math","content":"="}],"align":{"hor":"center","ver":"middle"},"border":{"top":{"width":1,"color":{"code":1}},"right":{"width":1,"color":{"code":1}},"bottom":{"width":1,"color":{"code":1}},"left":{"width":1,"color":{"code":1}},"radius":{"topLeft":1,"topRight":1,"bottomRight":1,"bottomLeft":1}},"size":{"height":2,"fixedWidth":55}},{"type":"Box","elements":[{"type":"Math","content":"\\lt"}],"align":{"hor":"center","ver":"middle"},"border":{"top":{"width":1,"color":{"code":1}},"right":{"width":1,"color":{"code":1}},"bottom":{"width":1,"color":{"code":1}},"left":{"width":1,"color":{"code":1}},"radius":{"topLeft":1,"topRight":1,"bottomRight":1,"bottomLeft":1}},"size":{"height":2,"fixedWidth":55}}],"interaction":true,"locianOptions":{"check":true,"answer":{"index":3}},"display":"block"}],"size":{"fixedWidth":55},"padding":{"left":0.1,"right":0.1,"top":0,"bottom":0},"align":{"ver":"middle"}},{"type":"TableCellBox","elements":[{"type":"Box","elements":[{"type":"Math","content":"0.52"}],"align":{"hor":"left","ver":"middle"},"size":{"height":1,"fixedWidth":80}}],"align":{"hor":"left","ver":"middle"},"size":{"height":2,"fixedWidth":80},"padding":{"top":0,"bottom":0.3}}]],"dynamic":false,"fixed":true,"useRadius":true,"size":{"fixedWidth":225}}

console.log(Table_getAnswer(table, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('189. DotPlot1D_getAnswer');
var dotPlot1D = {
    "type": "DotPlot1D",
    "coord": -3,
    "count": 10,
    "start": 0.5,
    "style": {
      "size": 0.4,
      "color": {
        "code": 1
      }
    },
    "locianOptions": {
      "check": true,
      "answer": {
        "interaction": "range",
        "coord": -3,
        "dots": 3
      }
    },
    "interaction": "range"
  }
  
console.log(DotPlot1D_getAnswer(dotPlot1D, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('193. Trig_getAnswer');
var trig = {
    "type": "Trig",
    "radius": 1,
    "needles": [
      {
        "type": "TrigNeedle",
        "degree": 0,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 10,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 20,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 30,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 40,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 50,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 60,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 70,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 80,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 90,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 100,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 110,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 120,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 130,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 140,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 150,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 160,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 170,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 180,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 190,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 200,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 210,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 220,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 230,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 240,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 250,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 260,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 270,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 280,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 290,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 300,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 310,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 320,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 330,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 340,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 350,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 360,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 1,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 0,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 3,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "0\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 30,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 27,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "30\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 60,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 65,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "60\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 90,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 87,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "90\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 120,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 115,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "120\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 150,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 155,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "150\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 180,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 177,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "180\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 210,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 197,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "210\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 240,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 245,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "240\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 270,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 273,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "270\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 300,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 300,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "300\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 330,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 340,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "330\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "degree": 360,
        "style": {
          "stroke-width": 0,
          "color": {
            "code": 0
          }
        },
        "pointer": {
          "pointerType": "point",
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        }
      },
      {
        "type": "TrigNeedle",
        "degree": 357,
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": -1
          }
        },
        "degreeContent": {
          "element": {
            "type": "Math",
            "content": "360\\degree",
            "font": {
              "color": {
                "text": {
                  "code": 0
                }
              }
            }
          },
          "offset": 1.1
        },
        "radianContent": [
          
        ],
        "coordContent": [
          
        ]
      },
      {
        "type": "TrigNeedle",
        "style": {
          "stroke-width": 2.5,
          "color": {
            "code": 1
          }
        },
        "degree": 0,
        "pointer": {
          "pointerType": "arrow"
        },
        "base": {
          "pointerType": "arrow",
          "degree": 0,
          "style": {
            "color": {
              "code": 0,
              "weight": "normalMedium"
            }
          }
        },
        "interaction": {
          "movable": true
        },
        "locianOptions": {
          "check": true,
          "needle": {
            "degree": 250
          }
        }
      }
    ],
    "step": 10,
    "degree": {
      "start": 0,
      "end": 360
    }
  }
console.log(Trig_getAnswer(trig, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');

console.log('203. CircleGraph_getAnswer');
var circleGraph = {"type":"CircleGraph","data":[{"value":0.27272727272727,"color":{"code":6,"weight":"translucentWeak"}},{"value":0.090909090909091,"color":{"code":5,"weight":"translucentWeak"}},{"value":0.090909090909091,"color":{"code":3,"weight":"translucentWeak"}},{"value":0.36363636363636,"color":{"code":2,"weight":"translucentWeak"}},{"value":0.18181818181818,"color":{"code":4,"weight":"translucentWeak"}}],"labels":[{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Text","content":"Oregano","wrap":true,"whiteSpaces":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}],[{"type":"TableCellBox","elements":[{"type":"Math","content":"\\frac{3}{11}","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"text":{"code":0}}}}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}]],"size":{"width":0},"dynamic":true},{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Text","content":"Basil","wrap":true,"whiteSpaces":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}],[{"type":"TableCellBox","elements":[{"type":"Math","content":"\\frac{1}{11}","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"text":{"code":0}}}}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}]],"size":{"width":0},"dynamic":true},{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Text","content":"Dill","wrap":true,"whiteSpaces":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}],[{"type":"TableCellBox","elements":[{"type":"Math","content":"\\frac{1}{11}","wrap":false,"whiteSpaces":true,"innerPadding":false,"font":{"color":{"text":{"code":0}}}}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}]],"size":{"width":0},"dynamic":true},{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Text","content":"Cilantro","wrap":true,"whiteSpaces":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}],[{"type":"TableCellBox","elements":[{"type":"MathInput","content":"\\frac{4}{11}","size":{"width":2,"height":1},"align":{"hor":"left"},"locianOptions":{"answerType":"0","lacoType":"2","whitelist":[],"blacklist":[]},"keypadGroups":[]}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}]],"size":{"width":0},"dynamic":true},{"type":"Table","cells":[[{"type":"TableCellBox","elements":[{"type":"Text","content":"Fennel","wrap":true,"whiteSpaces":false}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}],[{"type":"TableCellBox","elements":[{"type":"MathInput","content":"\\frac{2}{11}","size":{"width":2,"height":1},"align":{"hor":"left"},"locianOptions":{"order":1,"answerType":"0","lacoType":"2"},"keypadGroups":[]}],"align":{"hor":"center","ver":"middle"},"color":{"code":-1},"padding":{"top":0.1875,"right":0.1875,"bottom":0.1875,"left":0.1875}}]],"size":{"width":0},"dynamic":true}],"radius":7,"ratio":0.8,"border":{"color":{"code":0,"weight":"normalMedium"}},"title":{"type":"Text","content":"Favorite Type of Herb","wrap":false},"titleAlign":{"ver":"top"}}

console.log(CircleGraph_getAnswer(circleGraph, answer, checktypeDefault));
console.log('##############################################################')
console.log(answer);
console.log('          ');


var connect = {"type":"Connect","size":0.7,"dots":[{"type":"Dot","coords":{"point":{"x":-2,"y":-7}},"size":0.35,"style":{"color":{"code":1,"weight":"normalMedium"}},"lineLimit":{"source":5,"target":0}},{"type":"Dot","coords":{"point":{"x":-8,"y":-2}},"size":0.35,"style":{"color":{"code":1,"weight":"normalMedium"}},"lineLimit":{"source":0,"target":5}},{"type":"Dot","coords":{"point":{"x":0,"y":7}},"size":0.35,"style":{"color":{"code":1,"weight":"normalMedium"}},"lineLimit":{"source":0,"target":5}},{"type":"Dot","coords":{"point":{"x":7,"y":1}},"size":0.35,"style":{"color":{"code":1,"weight":"normalMedium"}},"lineLimit":{"source":0,"target":5}},{"type":"Dot","coords":{"point":{"x":7,"y":-7}},"size":0.35,"style":{"color":{"code":1,"weight":"normalMedium"}},"lineLimit":{"source":0,"target":5}}],"labels":[{"type":"Label","coords":{"point":{"x":-2.67,"y":-7.67}},"label":{"type":"Text","content":"R"}},{"type":"Label","coords":{"point":{"x":-8.67,"y":-2.67}},"label":{"type":"Text","content":"S"}},{"type":"Label","coords":{"point":{"x":0.67,"y":7.67}},"label":{"type":"Text","content":"T"}},{"type":"Label","coords":{"point":{"x":7.67,"y":1.67}},"label":{"type":"Text","content":"U"}},{"type":"Label","coords":{"point":{"x":7.67,"y":-7.67}},"label":{"type":"Text","content":"V"}}],"lines":[{"source":0,"target":1,"color":{"code":4,"weight":"normalMedium"},"fixed":true},{"source":1,"target":2,"color":{"code":4,"weight":"normalMedium"},"fixed":true},{"source":2,"target":3,"color":{"code":4,"weight":"normalMedium"},"fixed":true},{"source":3,"target":4,"color":{"code":4,"weight":"normalMedium"},"fixed":true},{"source":4,"target":0,"color":{"code":4,"weight":"normalMedium"},"fixed":true}],"arrow":false,"dotStyle":{"lineLimit":{"source":1,"target":1}},"sameDotStyle":false,"display":"inline-block","interaction":{"selectable":true,"bidirectional":true},"locianOptions":{"direction":false,"order":false,"lines":[{"source":0,"target":2,"color":{"code":3,"weight":"normalMedium"},"dash":true},{"source":0,"target":3,"color":{"code":3,"weight":"normalMedium"},"dash":true}]}}

var selectBox = [{"type":"SelectBox","choices":[{"type":"Text","content":"Movie F","wrap":false,"whiteSpaces":false},{"type":"Text","content":"Movie G","wrap":false,"whiteSpaces":false},{"type":"Text","content":"Movie H","wrap":false,"whiteSpaces":false},{"type":"Text","content":"Movie J","wrap":false,"whiteSpaces":false},{"type":"Text","content":"Movie K","wrap":false,"whiteSpaces":false}],"answer":"1","buttonAlign":"middle"},{"type":"Text","content":": ","wrap":true,"whiteSpaces":false},{"type":"MathInput","content":"20,000","size":{"width":2,"height":1},"align":{"hor":"left"},"locianOptions":{"order":1,"lacoType":"6"},"keypadGroups":[]}]

var shade = {"type":"Shade","row":1,"column":10,"border":{"width":1,"color":{"code":2}},"cellBorder":{"width":1,"color":{"code":2}},"interaction":{"selectable":true,"draggable":true},"size":{"fixedWidth":300,"fixedHeight":300},"selectedCells":[],"locianOptions":{"check":true,"selectedCells":[{"row":0,"column":0},{"row":0,"column":1},{"row":0,"column":2}]}}