import { LatexToTree, is_equal_tree } from "../checkmath.js";
import jsonData from "./kr_json";

const presetBasePath = "../rc/";
for (const item of jsonData) {
	// temporary code to stop running all data
	/**/  if (item.id > 54) continue; 

	describe(`tests for preset_${item.id} - ${item.name}`, () => {
		let presetModule;
		let functionName;
		beforeAll(async () => {
			presetModule = await importModule(item.id);
			functionName = getFuncName(presetModule);
		});
		const testData = item.data;
		testData.forEach((row) => {
			it(`Test ${row.answer} & ${row.ianswer} equals ${row.result}`, () => {
				const tree1 = LatexToTree(row.answer);
				const tree2 = LatexToTree(row.ianswer);
				const resultTree1 = presetModule[functionName](tree1);
				const resultTree2 = presetModule[functionName](tree2);
				const compareResult = is_equal_tree(resultTree1, resultTree2) ? 1 : 0;
				try {
					expect(compareResult).toEqual(row.result);
				} catch (e) {
					e.message = `${e.message}\n\nlogs:\n${JSON.stringify(
						{ tree1, tree2, resultTree1, resultTree2, compareResult, }, null, 2
					)}`;
					throw e;
				}
			});
		});
	});
};

const importModule = async (id) => {
	try {
		const modulePath = `${presetBasePath}preset_${id}.inc.js`;
		return await import(modulePath);
	} catch (error) {
		throw new Error(`Failed to import 'preset_${id}.inc': ${error}`);
	}
};

const getFuncName = (presetModule) => {
	try {
		const names = Object.keys(presetModule);
		let functionName = "";

		if (
			presetModule &&
			names.length > 0 &&
			typeof presetModule[names[0]] === "function"
		) {
			return names[0];
		} else {
			throw new Error(`Failed go get function from module`);
		}
	} catch (err) {
		console.error(err);
	}
};