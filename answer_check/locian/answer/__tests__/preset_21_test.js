import { LatexToTree } from '../LatexToTree.js';
import { compareMathTree } from '../checkmath.js';
import { no_identities } from "../rc/preset_21.inc.js";
import json from "./kr_json_preset";

let data;
for (let item of json) {
	if (item.id ===  21) {
		data = item.data;
		break;
	}
}


describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		let tree_1 = LatexToTree(row.answer);
		let tree_2 = LatexToTree(row.inswer);
		tree_1 = no_identities(tree_1);
		tree_2 = no_identities(tree_2);
		let compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


