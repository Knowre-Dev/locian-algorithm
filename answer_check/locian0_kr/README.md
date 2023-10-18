# Locian Answer Check
* This project is a javascript port of the current php answer check system running on all knowre services

# Environment vars
This project uses the following environment variables:

| Name                          | Value                         | Reason                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|NODE_OPTIONS           | --experimental-vm-modules            | to use jest native support for modules      |


# Pre-requisites
- Node version 18.12.1
- direnv
- jest

# Getting started
- Install dependencies
```
npm install
```

- run tests
```
npm run test
```

## Testing
The tests are formatted following test inputs at locian laco presets page.

### Example test of preset
```
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
```
### Running tests using NPM Scripts
````
npm run test

````
Test files are created under test folder. `__tests__`


# Common Issues
## `replaceAll` function fails
- need to use node version 18.12.1
## SyntaxError when using import statement
- need to set --experimental-vm-modules
