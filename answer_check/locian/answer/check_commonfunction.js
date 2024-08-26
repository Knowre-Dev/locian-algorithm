/* eslint-disable no-tabs */
import { is_numeric, is_include } from './functions.js'
import { checkMath_one } from './checkmath.js'
/***********************************************************
name:   getOrderedAnswerArray
role:
input:
output:
***********************************************************/
export function getOrderedAnswerArray(answers) {
	const result = {};
	answers.forEach(answer => {
		const exp = new RegExp('/([0-9]+)+/', 'g');
		const position = answer.order.split(exp);
		/*
		const position = preg_split(
			exp,
			answer.order,
			null,
			PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY
		);
		*/
		let temp = result; // temp =& result;
		position.forEach((v, k) => {
			if (k === position.length - 1) {
                if (typeof temp[v] === 'undefined') {
                    temp[v] = {};
                }
				temp[v]['answer' + temp[v].length] = answer;
            } else {
				temp = temp[v];// temp =& temp[v];
            }
		})
	})
	return result;
}

/***********************************************************
name:   compareOrderedAnswerArray
role:
input:
output:
***********************************************************/
export function compareOrderedAnswerArray(A, B, type) {
	// const func = 'check' + type + '_one';
	const func = checkMath_one;
	const keyA = A.keys();
	const delArray = [];
	if (keyA[0].substring(0, 6) === 'answer') {
		for_1: for (const vA of A) {
            const entries_B = B.entries();
			for_2: for (const [kB, vB] of entries_B) {
				if (is_include(delArray, vB)) {
					continue;
                } else {
                    if (Object.hasOwn(vA, 'blacklist')) {
                        for (const b of vA.blacklist) {
                            if (func(b.toLowerCase(), vB.value.toLowerCase(), ['single', 'eq', 'simp', 'same', 0, []])) {
                                // fb(b, 'blacklist-filtered');
                                return false;
                            }
                        }
                    }
                    if (func(vA.value, vB.value, vA.checktype)) {
                        delArray.push(kB);
                        continue for_2;
                    }
                    if (Object.hasOwn(vA, 'whitelist')) {
                        // let flag = false;
                        for (const b of vA.whitelist) {
                            if (b.trim.length && func(b.toLowerCase(), vB.value.toLowerCase(), vA.checktype)) {
                                // fb(b, 'whitelist-filtered');
                                delArray.push(kB);
                                // flag = true;
                                continue for_1;
                            }
                        }
                    }
				}
			}
			return false;
		}
		if (B.length === delArray.length) {
			return true;
        } else {
			return false;
        }
	} else if (is_numeric(keyA[0])) {
		const entries_A = A.entries();
        for (const [k, v] of entries_A) {
			if (!compareOrderedAnswerArray(v, B[k], type)) {
                return false;
            }
		}
		return true;
	} else {
		const delArray = [];
        for_1: for (const vA of A) {
            const entries_B = B.entries();
			for (const [kB, vB] of entries_B) {
				if (is_include(delArray, kB)) {
					continue;
                } else if (compareOrderedAnswerArray(vA, vB, type)) {
					delArray.push(kB);
					continue for_1;
				}
			}
			return false;
		}

		return B.length === delArray.length;
	}
}
