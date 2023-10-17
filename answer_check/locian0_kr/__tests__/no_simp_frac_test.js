import { jest } from "@jest/globals";
import {LatexToTree, match_all} from '../checkmath.js';
import { no_simp_frac } from "../rc/preset_20.inc";
//const no_simp_frac = require('../rc/preset_20.inc');

const data = [
	{ answer: "\frac{1}{2}", ianswer: "\frac{2}{4}", result: 1 },
	{ answer: "0.5x", ianswer: "\frac{1}{2}x", result: 1 },
	{ answer: "3x-y+0+1a-0+\frac{1}{2}x", ianswer: "\frac{1}{2}", result: 1 },
];
describe("Table Data Tests", () => {
  data.forEach((row, index) => {
    const tree1 = LatexToTree(row.answer)
    const tree2 = LatexToTree(row.ianswer)
    const resultTree1 = no_simp_frac(tree1)
    const resultTree2 = no_simp_frac(tree2)
    test(`Row ${index + 1} should have a result of ${row.result}`, () => {
      const compareResult = JSON.stringify(resultTree1) == JSON.stringify(resulTree2)
      expect(compareResult).toBe(row.result);
    });
  });
});
