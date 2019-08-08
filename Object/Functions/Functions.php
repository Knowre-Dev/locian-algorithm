<?php




class M_Math
{
	/*
	1. Function
		Compute inclucded angle of two angles
	2. Input
		$angle_1: angle of line_1
		$angle_2: angle of line_2
	3. Output
		Included angle
	*/

	public static function angle_included($angle_1,$angle_2)
	{
		$angle_included = M_math::angle_polar($angle_1-$angle_2);
		if ($angle_included <= M_PI)
		{
			return $angle_included;
		}
		return 2*M_PI - $angle_included;
	}

	/*
	1. 기능
		각을 polar coordinate의 각으로 변환
	2. 입력
		angle
	3. 출력
		polar coordinate의 각으로 변형된 각
	*/
	public static function angle_polar($angle)
	{
		return $angle-2*M_PI*floor($angle/(2*M_PI));
	}
	
	/*
	1. 기능
		atan2(number)를 계산해서 polar각으로 변환
	2. 입력
		number
	3. 출력
		number의 polar angle
	*/
	public static function atan2_polar($y,$x)
	{
		return M_math::angle_polar(atan2($y,$x));
	}

	/*
	1. Function
		To check if an angle is between two angles
	2. Input
		$angle: angle
		$start_angle: start angle
		$end_angle: end angle
	3. Output
		true: between angles
		false: not bewteen angles
	*/
	public static function is_between_angles($angle,$start_angle,$end_angle)
	{
		if (M_math::angle_polar($angle-$start_angle) <= M_math::angle_polar($end_angle-$start_angle))
		{
			return true;
		}
		return false;
	}
	
	/*
	1. 기능
		두 angle이 근사적으로 일치하는지 판별
	2. 입력
		$angle_1: angle
		$angle_2: angle
	3. 출력
		true: 근사치 내
		false: 근사치 밖
	*/
	public static function is_equal_approximately_angle($angle_1,$angle_2)
	{
		if (abs(M_math::angle_polar($angle_1-$angle_2)) < deg2rad(1))
		{
			return true;
		}

		return false;
	}

	/*
	1. Function
		mod 계산
	2. Input
		$a: real
		$b: positive real
	3. Output
		$c: $a == $c (mod $b)
	*/
	public static function mod($a,$b)
	{
		$c = fmod($a,$b);
		if ($c < 0)
		{
			$c += $b;
		}

		return $c;
	}

	/*
	1. 기능
		수의 부호 계산
	2. 입력
		number: 실수
	3. 출력
		-1: number < 0
		0: number = 0
		1: number >0
	*/
	public static function sign($number)
	{
		if ($number < 0)
		{
			return = -1;
		}
		else if ($number == 0)
		{
			return = 0;
		}
		else if ($number > 0)
		{
			return = 1;
		}

	}
	
}	
	
	
	


	

	


	























	








	



	

	
	








		









	
	







	



	




