<?php

function 고2015_집합의연산_드모르간의법칙_연산법칙이용_정리_과정_빈칸($A, $B, $C, $U = null, $flag = null)
{
    
    //default
    
    $defA = new CSet_Union([new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Complement(new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))]))]);  
    // defA = (A \cup B) \cup (A^c \cup B^c)^c

    $defA = new CSet_Intersection([new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    // defA = (A \cap B) \cap  (A^c \cup B^c)

    $defA = new CSet_Union([lte('\PolyAlg{A}-\PolyAlg{B}'), lte('\PolyAlg{A}-\PolyAlg{C}')]);
    // defA = (A - B) \cup (A - C)    


    $defA = new CSet_Intersection([new CSet_Intersection([new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))]), new CSet_Union([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{B}'))])]), lte('\PolyAlg{A}')]);    
    // defA = ((A^c \cup B^c) \cap (A \cup B^c)) \cap A

    $defA = new CSet_Union([new CSet_Complement(new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])), new CSet_Intersection([new CSet_Complement(lte('\PolyAlg{A}')), lte('\PolyAlg{B}')])]);
    // defA = (A \cup B)^c \cup (A^c \cap B^c)



    // 드모르간을 먼저 의도했는데 차집합이 먼저 되고 있음.
    
    $defA = new CSet_Union([new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Intersection([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    // defA = (A \cup B) \cup (A^c \cap B^c)
    
    //  A + [-1, B] === A - B ? 이게 맞다고 가정한 결과는 화살표로
    $defA = new AddChain(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), [-1, new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{C}')])]); // 분배법칙으로 가지를 못 함.
    // defA = (A + [-1, A]) + [-1, A + [-1, C]]  => (A - A) - (A - C) {1, 2, 3} - {1, 4} = {2, 3}

    $defA = new AddChain(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), [-1, lte('\PolyAlg{C}')]);
    // defA = (A + [-1, B]) + [-1, C] +> (A - B) - C

    $defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{C}')])]);
    // defA = (A + [-1, B]) \cap (A + [-1, C]) => (A - B) \cap (A - C)

    $defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), lte('\PolyAlg{B}')]);
    // defA = (A + [-1, B]) \cup B => (A - B) \ cup B
    
    $defA = new CSet_Intersection([new CSet_Complement(new AddChain(lte('\PolyAlg{B}'), [-1, lte('\PolyAlg{A}')])), lte('\PolyAlg{B}')]);
    // (B + [-1, A])^c \cap B => (B - A)^c \cap B

    $defA = new AddChain(lte('\PolyAlg{A}'), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])]);
    // defA = A + [-1, A \cap B] => A - (A \ cap B)

    $defA = new AddChain(lte('\PolyAlg{A}'), [-1, new CSet_Intersection([lte('\PolyAlg{B}'), lte('\PolyAlg{C}')])]);
    // defA = A + [-1, B \cap C] => A - (B \ cap C)
    
    $defA = new AddChain(new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{C}')])]);
    // defA = (A \cap B) + [-1, A \cap C] => (A \cap B) - (A \cap C)

    $defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{C}')])]);
    // defA = (A + [-1, B]) \cup (A \ cap C) => (A - B) \cup (A \cap C) 

    // A^c 합집합 B 꼴을 드모르간을 써야 되는데 이걸 어떻게 판단?
    
    $defA = new CSet_Intersection([new CSet_Union([new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')])]), lte('\PolyAlg{B}')]);
    // defA = ((A \cap B) \cap (A + [-1, B])) \cap B => ((A \cap B) \cap (A - B)) \cap B
    
    $defA = new CSet_Intersection([new CSet_Complement(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')])), new CSet_Complement(lte('\PolyAlg{B}'))]);
    // defA = (A + [-1, B])^c \cap B^c => (A - B)^c \cap B^c

    $defA = new CSet_Complement(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]));
    // defA = (A + [-1, B])^c => (A - B)^c

    $defA = new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]))]);
    // defA = A \cap(A \cap B)^c


    $defB = [lte(3), lte(1), lte(1)];



    $defC = [new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])];
    // defC = [A \cap B, A \cap B, A \cup C]

    
    $defA = new CSet_Union([new CSet_Complement(new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])), new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    // defA = (A \cup B)^c \cup (A \cap B^c)


    $defB = [lte(3), lte(5), lte(1), lte(1)];

    $defC =  [new CSet_Complement(lte('\PolyAlg{A}')), [new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))], lte('\PolyAlg{U}'), new CSet_Complement(lte('\PolyAlg{B}'))];
    // defC = [A^c, [A^c, B^c], U, B^c]

    $defA = new AddChain(lte('\PolyAlg{B}'), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])]);
    // defA = B + [-1, A \cap B] => B - (A \cap B)

    $defB = [lte(2), lte(3), lte(5), lte(1), lte(1), lte(2)];
    
    $defC = [new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Complement(lte('\PolyAlg{B}')), new CSet_Complement(lte('\PolyAlg{B}')), new CSet(null), new CSet_Complement(lte('\PolyAlg{A}')), new AddChain(lte('\PolyAlg{B}'), [-1, lte('\PolyAlg{A}')])];
    // defC = [A \cap B, B^c, A^c, \empty, A^c, B + [-1, A]] => [A \cap B, B^c, A^c, \empty, A^C, B - A]

    variable('VA', $A, $defA);
    variable('VB', $B, $defB);
    variable('VC', $C, $defC);
    
    
    //solution
        
    sysout('Vu', $U = $U ? $U : lte('\PolyAlg{U}'));
    
    $set = find_SetName($A);
    $set = array_unique_($set);
    sort($set);
    sysout('Vsi', sizeof($set));
    sysout('Vset', $set);
    $count = 0;
    $set = $A;
    $num = null;
    
    $ueq = sub_29703($C);
    while($count >= 0) {
        if(Force::php($B[$count]) == 3 || intval(Force::php($B[$count])/10) == 3){
            if(type($set) == 'CSet_Union'){
                $term = $set->terms;
                $nterm = [];
                sysout('VSSS', $set);
                $rest = intval(Force::php($B[$count])%10);
                if ($rest == 3) { 
                    $rest = 0; 
                }
                foreach ($term as $k => $v) {
                    if ($k+1 == $rest || $rest == 0) {
                        $cal = set_calculation($v, $U, 3, $flag);
                    } else {
                        $cal = $v;
                    }
                    $nterm[] = $cal;
                }
                $set2 = new CSet_Union($nterm);
            } else if (type($set) == 'CSet_Intersection') {
                $term = $set->terms;
                $nterm = [];
                foreach($term as $k => $v){
                    $cal = set_calculation($v, $U, Force::php($B[$count]), $flag);
                    $nterm[] = $cal;
                }
                $set2 = new CSet_Intersection($nterm);
            } else {
                $set2 = set_calculation($set, $U, Force::php($B[$count]), $flag);
            }
        } else {
            $set2 = set_calculation($set, $U, Force::php($B[$count]), $flag);
        }
        
        if (compare_set($set2, $set)) {
            $result = $set2;
            break;
        } else {
            $Set[$count] = $set2;
            sysout('VSet'.($count+1), $Set[$count]);
            $un[$count] = es_보류_4875($set2, $ueq[$count]);   
            $count++;
            $set = $set2;
        }
    }
    
    sysout('VSet', $Set);
    foreach($Set as $s){
        if (strpos(ObjToLatex($s), '((') !== false) {
            $cflag = 1;
        }
    }
    if (type($A) == 'CSet_Union' || type($A) == 'CSet_Intersection') {
        $count = 0;
        $cterms = $A ->  terms;
        foreach($cterms as $c){
            if(in_type('CSet_Union', $c) || in_type('CSet_Intersection', $c)){
                $count++;
            }
        }
        if ($count > 1) { 
            $cflag = 1; 
        }
    }
    sysout('Vcf', $cflag);
    var_dump($cflag);
    sysout('Vun', $un);
    sysout('Vusi', sizeof($un));
    sysout('Vssi', sizeof($Set));
    
    foreach($un as $k => $v){
        sysout('Vun'.($k+1), $v);
    }
    
    foreach($Set as $k => $v){
        sysout('Vset'.($k+1), $v);
    }
    
    
    sysout('VR', $result);
    
    //whitelist 추가 (2019.06.18 mj)
    
    $un_value = find_unval($un);
    $i = 1;
    foreach ($un_value as $ k=> $v) {
        white_setComplement($v, $i);
        $i++;
    }
    return $result;
}


function sub_29703($arr) {// [$val = fit_unknown($val)]
    $order = 1;
    foreach ($arr as $k => $v) {
        if (!is_array($v)) {
            if ($v !== null) {
                $un = fit_unknown($v, $order++);
                $result[$k] = [new Equation($v, $un)];
            } else {
                $result[$k] = [];
            }            
        } else {
            foreach($v as $w){
                $un = fit_unknown($w, $order++);
                $result[$k][] = new Equation($w, $un);
            }
        }        
    }
    return $result;
}

/*
function 고2015_집합의연산_드모르간의법칙_연산법칙이용_정리_과정_빈칸($A, $B, $C, $U = null, $flag = null)
{
    
    //default
    
    $defA = new CSet_Union([new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Complement(new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))]))]);  
    // defA = (A \cup B) \cup (A^c \cup B^c)^c



    //$defA = new CSet_Intersection([new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    //$defA = new CSet_Union([lte('\PolyAlg{A}-\PolyAlg{B}'), lte('\PolyAlg{A}-\PolyAlg{C}')]);
    //$defA = new CSet_Intersection([new CSet_Intersection([new CSet_Union([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))]), new CSet_Union([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{B}'))])]), lte('\PolyAlg{A}')]);    
    //$defA = new CSet_Union([new CSet_Complement(new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])), new CSet_Intersection([new CSet_Complement(lte('\PolyAlg{A}')), lte('\PolyAlg{B}')])]);
    // 드모르간을 먼저 의도했는데 차집합이 먼저 되고 있음.
    //$defA = new CSet_Union([new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Intersection([new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    //$defA = new AddChain(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), [-1, new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{C}')])]); // 분배법칙으로 가지를 못 함.
    //$defA = new AddChain(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), [-1, lte('\PolyAlg{C}')]);
    //$defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{C}')])]);
    //$defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), lte('\PolyAlg{B}')]);
    //$defA = new CSet_Intersection([new CSet_Complement(new AddChain(lte('\PolyAlg{B}'), [-1, lte('\PolyAlg{A}')])), lte('\PolyAlg{B}')]);
    //$defA = new AddChain(lte('\PolyAlg{A}'), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])]);
    //$defA = new AddChain(lte('\PolyAlg{A}'), [-1, new CSet_Intersection([lte('\PolyAlg{B}'), lte('\PolyAlg{C}')])]);
    //$defA = new AddChain(new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{C}')])]);
    //$defA = new CSet_Union([new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]), new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{C}')])]);
    // A^c 합집합 B 꼴을 드모르간을 써야 되는데 이걸 어떻게 판단?
    //$defA = new CSet_Intersection([new CSet_Union([new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')])]), lte('\PolyAlg{B}')]);
    //$defA = new CSet_Intersection([new CSet_Complement(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')])), new CSet_Complement(lte('\PolyAlg{B}'))]);
    //$defA = new CSet_Complement(new AddChain(lte('\PolyAlg{A}'), [-1, lte('\PolyAlg{B}')]));
    //$defA = new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]))]);



    $defB = [lte(3), lte(1), lte(1)];
    //$defB = [lte(2), lte(5), lte(3), lte(2)];
    //$defB = [lte(5), lte(1), lte(1), lte(2)];
    //$defB = [lte(3), lte(5), lte(1), lte(1)];
    //$defB = [lte(3), lte(1)];
    //$defB = [lte(2), lte(3), lte(5), lte(4), lte(1), lte(2)];
    //$defB = [lte(2), lte(4), lte(3), lte(2)];
    //$defB = [lte(2), lte(5), lte(3), lte(2)];
    //$defB = [lte(2), lte(5), lte(1), lte(1)];
    //$defB = [lte(2), lte(3), lte(5), lte(1), lte(1)];
    //$defB = [lte(2), lte(3), lte(5), lte(1), lte(1), lte(2)];
    //$defB = [lte(2), lte(3), lte(5), lte(2)];
    //$defB = [lte(2), lte(3), lte(5), lte(1), lte(1), lte(2)];
    //$defB = [lte(2), lte(5), lte(3), lte(2)];
    //$defB = [lte(2), lte(5), lte(1), lte(1)];
    //$defB = [lte(2), lte(3), lte(5), lte(1), lte(1)];
    //$defB = [lte(2), lte(3)];
    //$defB = [lte(3), lte(5), lte(1), lte(1), lte(2)];


    $defC = [new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])];
    // defC = [A \cap B, A \cap B, A \cup C


    //$defC = [[lte('\PolyAlg{B}'), new CSet_Complement(lte('\PolyAlg{C}'))], new CSet_Union([new CSet_Complement(lte('\PolyAlg{B}')), new CSet_Complement(lte('\PolyAlg{C}'))]), new CSet_Intersection([lte('\PolyAlg{B}'), lte('\PolyAlg{C}')]), new CSet_Intersection([lte('\PolyAlg{B}'), lte('\PolyAlg{C}')])];
    
    $defA = new CSet_Union([new CSet_Complement(new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])), new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{B}'))])]);
    // defA = (A \cup B)^c \cup (A \cap B^c)


    $defB = [lte(3), lte(5), lte(1), lte(1)];

    $defC =  [new CSet_Complement(lte('\PolyAlg{A}')), [new CSet_Complement(lte('\PolyAlg{A}')), new CSet_Complement(lte('\PolyAlg{B}'))], lte('\PolyAlg{U}'), new CSet_Complement(lte('\PolyAlg{B}'))];
    // defC = [A^c, [A^c, B^c], U, B^c]

    $defA = new AddChain(lte('\PolyAlg{B}'), [-1, new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')])]);
    // defA = B + [-1, A \cap B]

    $defB = [lte(2), lte(3), lte(5), lte(1), lte(1), lte(2)];
    
    $defC = [new CSet_Intersection([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), new CSet_Complement(lte('\PolyAlg{B}')), new CSet_Complement(lte('\PolyAlg{B}')), new CSet(null), new CSet_Complement(lte('\PolyAlg{A}')), new AddChain(lte('\PolyAlg{B}'), [-1, lte('\PolyAlg{A}')])];
    // defC = [A \cap B, B^c, A^c, \empty, A^C, B + [-1, A]]

    variable('VA', $A, $defA);
    variable('VB', $B, $defB);
    variable('VC', $C, $defC);
    
    
    //solution
        
    sysout('Vu', $U = $U ? $U : lte('\PolyAlg{U}'));
    
    $set = find_SetName($A);
    $set = array_unique_($set);
    sort($set);
    sysout('Vsi', sizeof($set));
    sysout('Vset', $set);
    //print_r(set_diff($A));
    //print_r(set_calculation_기초(new CSet_Union([new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{A}'))]), new CSet_Intersection([lte('\PolyAlg{A}'), new CSet_Complement(lte('\PolyAlg{B}'))])])));
    //return;
    $count = 0;
    $set = $A;
    $num = null;
    
    $ueq = sub_29703($C);
    //sysout('Vunn', new Unknown(new CSet_Union([lte('\PolyAlg{A}'), lte('\PolyAlg{B}')]), 1, 3));
    while($count >= 0) {
        if(Force::php($B[$count]) == 3 || intval(Force::php($B[$count])/10) == 3){
            if(type($set) == 'CSet_Union'){
                $term = $set->terms;
                $nterm = [];
                sysout('VSSS', $set);
                $rest = intval(Force::php($B[$count])%10);
                if($rest == 3){ $rest = 0; }
                foreach($term as $k=>$v){
                    if($k+1 == $rest || $rest == 0){
                        $cal = set_calculation($v, $U, 3, $flag);
                    }else{
                        $cal = $v;
                    }
                    $nterm[] = $cal;
                }
                $set2 = new CSet_Union($nterm);
            }else if(type($set) == 'CSet_Intersection'){
                $term = $set->terms;
                $nterm = [];
                foreach($term as $k=>$v){
                    $cal = set_calculation($v, $U, Force::php($B[$count]), $flag);
                    $nterm[] = $cal;
                }
                $set2 = new CSet_Intersection($nterm);
            }else{
                $set2 = set_calculation($set, $U, Force::php($B[$count]), $flag);
            }
        }else{
            $set2 = set_calculation($set, $U, Force::php($B[$count]), $flag);
        }
        
        //print_r($set2);
        if(compare_set($set2, $set)){
            $result = $set2;
            break;
        }else{
            //print_r($set);
            $Set[$count] = $set2;
            sysout('VSet'.($count+1), $Set[$count]);
            $un[$count] = es_보류_4875($set2, $ueq[$count]); 
            //return set_calculation_기초($set2);
            //print_r($set2);             
            $count++;
            $set = $set2;
            
            //if($count == 4){
            //    print_r($set2[0]);
            //    return $num;
            // }
        }
    }
    
    sysout('VSet', $Set);
    foreach($Set as $s){
        if(strpos(ObjToLatex($s), '((') !== false){
            $cflag = 1;
        }
    }
    if(type($A) == 'CSet_Union' || type($A) == 'CSet_Intersection'){
        $count = 0;
        $cterms = $A ->  terms;
        foreach($cterms as $c){
            if(in_type('CSet_Union', $c) || in_type('CSet_Intersection', $c)){
                $count++;
            }
        }
        if($count > 1){ $cflag = 1; }
    }
    sysout('Vcf', $cflag);
    var_dump($cflag);
    sysout('Vun', $un);
    //print_r(set_distributive($result));
    //print_r($result);
    sysout('Vusi', sizeof($un));
    sysout('Vssi', sizeof($Set));
    
    foreach($un as $k => $v){
        sysout('Vun'.($k+1), $v);
    }
    
    foreach($Set as $k => $v){
        sysout('Vset'.($k+1), $v);
    }
    
    
    sysout('VR', $result);
    
    //whitelist 추가 (2019.06.18 mj)
    
    $un_value = find_unval($un);
    $i = 1;
    foreach($un_value as $k=>$v){
        white_setComplement($v, $i);
        $i++;
    }
    return $result;
}


function sub_29703($arr) // [$val = fit_unknown($val)]
{
    
    $order = 1;
    
    foreach($arr as $k => $v){
        if(!is_array($v)){
            //$un = new Unknown(lte($v), $order++, 3);
            if($v !== null){
                $un = fit_unknown($v, $order++);
                $result[$k] = [new Equation($v, $un)];
            }else{
                $result[$k] = [];
            }            
        }else{
            foreach($v as $w){
                $un = fit_unknown($w, $order++);
                $result[$k][] = new Equation($w, $un);
            }
        }        
    }
    
    return $result;
}
*/

/*
[block,center,true,90]
[이분출력,\Vcf\,[등식3,\VA\,\Vun\],[equation,2,\VA\,\Vun\]]
[/block]
*/