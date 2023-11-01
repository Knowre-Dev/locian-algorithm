
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {eqMulNeg} from "../rc/function_73.inc.js";
import json from "./kr_json_function";

var data;
for (var item of json) {
	if (item.id == 73) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = eqMulNeg(tree_1);
		tree_2 = eqMulNeg(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


