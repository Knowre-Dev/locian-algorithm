
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {fracExpress} from "../rc/function_5.inc.js";
import json from "./us_json_function.json";

var data;
for (var item of json) {
	if (item.id == 5) {
		data = item.data;
		break;
	}
}

describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = fracExpress(tree_1);
		tree_2 = fracExpress(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});