
import {LatexToTree, compareMathTree} from "../checkmath.js";
import {rearrangeTreeEq} from "../rc/function_60.inc.js";
import json from "./kr_json_function";

let data;
for (let item of json) {
	if (item.id ===  60) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		let tree_1 = LatexToTree(row.answer);
		let tree_2 = LatexToTree(row.inswer);
		let compareResult = rearrangeTreeEq(tree_1, tree_2);
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


