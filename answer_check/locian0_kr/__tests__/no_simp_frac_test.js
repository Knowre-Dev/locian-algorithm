import { LatexToTree, is_equal_tree } from "../checkmath.js";
import { no_simp_frac } from "../rc/preset_20.inc";

const data = [
	{ answer: "\\frac{3}{1}", ianswer: "\\frac{6}{2}", result: 1 },
	{ answer: "1/(x-1)", ianswer: "2/(2x-2)", result: 1 },
	{ answer: "\\frac{27}{3}", ianswer: "\\frac{3}{1}", result: 0 },
	{ answer: "\\frac{25}{10}", ianswer: "\\frac{15}{6}", result: 1 },
	{ answer: "3", ianswer: "\\frac{3}{1}", result: 1 },
	{ answer: "\\frac{2}{4}", ianswer: "0.5", result: 1 },
	{ answer: "\\frac{27}{9}", ianswer: "3", result: 1 },
	{ answer: "\\frac{7}{2}", ianswer: "3\\frac{1}{2}", result: 1 },
	{ answer: "\\frac{12}{10}", ianswer: "1\\frac{1}{5}", result: 1 },
];
describe("Table Data Tests", () => {
	data.forEach((row, index) => {
		const tree1 = LatexToTree(row.answer);
		const tree2 = LatexToTree(row.ianswer);
		const resultTree1 = no_simp_frac(tree1);
		const resultTree2 = no_simp_frac(tree2);
		const compareResult = is_equal_tree(resultTree1, resultTree2) ? 1 : 0;
		test(`${row.answer} && ${row.ianswer} should have a result of ${row.result}`, () => {
			expect(compareResult).toBe(row.result)
		});
	});
});
