
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {rearrangeTreeEq} from "../rc/function_60.inc.js";
import json from "./kr_json_function";

var data;
for (var item of json) {
	if (item.id == 60) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		var compareResult = rearrangeTreeEq(tree_1, tree_2);
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


