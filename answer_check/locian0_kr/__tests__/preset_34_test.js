
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {set_bounds} from "../rc/preset_34.inc.js";
import json from "./us_json_function";

var data;
for (var item of json) {
	if (item.id == 34) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = set_bounds(tree_1);
		tree_2 = set_bounds(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


