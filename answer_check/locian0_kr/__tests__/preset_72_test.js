
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {식간단히_지수유리수} from "../rc/preset_72.inc.js";
import json from "./kr_json_preset";

var data;
for (var item of json) {
	if (item.id == 72) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = 식간단히_지수유리수(tree_1);
		tree_2 = 식간단히_지수유리수(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


