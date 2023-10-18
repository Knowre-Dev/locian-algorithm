/***********************************************************
name:   getOrderedAnswerArray
role:
input:
output:
***********************************************************/
function getOrderedAnswerArray(answerArray) {
    var answerArray_1 = JSON.parse(JSON.stringify(answerArray));
	var result = [];
	for (var answer of answerArray_1) {
		var regex = new RegExp('/([0-9]+)+/', 'g');
		var position = answer.get('order').split(regex);
        position = position.filter((str) => str !== '');
		var temp = result;
		for (var [k, v] of position.entries) {
			if (k === position.length - 1) {
                if (temp.has(v) === false) {
                    temp[v] = new Map();
                }
				temp.get(v).set('answer' + temp[v].toString(), answer);
            } else {
				temp = temp[v];
            }
		}
	}
	return result
}

/***********************************************************
name:   compareOrderedAnswerArray
role:
input:
output:
***********************************************************/
/*
function compareOrderedAnswerArray(A, B, type)
{
	$function = 'check'.$type.'_one';
	$keyA = array_keys($A);
	$delArray = array();
	if (substr($keyA[0],0,6) === 'answer')
	{
		foreach($A as $kA=>$vA)
		{
			foreach($B as $kB=>$vB)
			{
				if (in_Array($kB,$delArray)) {
					continue 1;
                } else {
                    if (isset($vA['blacklist'])) {
                        foreach($vA['blacklist'] as $b) {
                            if ($function(strtolower($b), strtolower($vB['value']), ['single', 'eq', 'simp', 'same', 0, []])) {
                                fb($b, 'blacklist-filtered');
                                return FALSE;
                            }
                        }
                    }
                    if ($function($vA['value'],$vB['value'],$vA['checktype'])) {
                        $delArray[] = $kB;
                        continue 2;
                    }
                    if (isset($vA['whitelist'])) {
                        $flag = false;
                        foreach($vA['whitelist'] as $b) {
                            if (strlen(trim($b)) && $function(strtolower($b), strtolower($vB['value']), $vA['checktype'])) {
                                fb($b, 'whitelist-filtered');
                                $delArray[] = $kB;
                                $flag = true;
                                continue 3;
                            }
                        }
                    }
				}
			}
			return FALSE;
		}
		if (sizeof($B) === sizeof($delArray))
			return TRUE;
		else
			return FALSE;
	}
	else if (is_numeric($keyA[0]))
	{
		$result = TRUE;
		foreach($A as $k=>$v)
		{
			if (compareOrderedAnswerArray($v,$B[$k],$type));
			else return FALSE;
		}
		return TRUE;
	}
	else
	{
		$delArray = array();
		foreach($A as $kA=>$vA)
		{
			foreach($B as $kB=>$vB)
			{
				if (in_array($kB,$delArray))
					continue 1;
				else if(compareOrderedAnswerArray($vA,$vB,$type))
				{
					$delArray[] = $kB;
					continue 2;
				}
			}
			return FALSE;
		}
		if (sizeof($B) === sizeof($delArray))
			return TRUE;
		else
			return FALSE;

	}
}
*/