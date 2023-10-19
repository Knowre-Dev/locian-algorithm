
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";
import {곱셈결합법칙} from "../rc/function_44.inc.js";
import jsonData from "./kr_function_tests.json";

// var data = [
// 	{ answer: "a(b(cd))", inswer: "abcd", result: 1 },
// 	{ answer: "0.2", inswer: "12", result: 0}
// ];
const data = jsonData.filter(item => item.id === 44);
// [
// 	{ answer: "a(b(cd))", inswer: "abcd", result: 1 },
// 	{ answer: "0.2", inswer: "12", result: 1}
// ];

describe("곱셈결합법칙", () => {
	data.forEach((row, index) => {
		var tree_1 = LatexToTree(row.answer);
		var tree_2 = LatexToTree(row.inswer);
		tree_1 = 곱셈결합법칙(tree_1);
		tree_2 = 곱셈결합법칙(tree_2);
		var compareResult = compareMathTree(tree_1, tree_2) ? 1 : 0;
		test(`${row.answer} && ${row.inswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});


