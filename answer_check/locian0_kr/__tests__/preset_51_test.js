
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {분수와소수} from "../rc/preset_51.inc.js";
import json from "./us_json_function";

var data;
for (var item of json) {
	if (item.id == 51) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = 분수와소수(tree_1);
		tree_2 = 분수와소수(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


