package Cartesian2D

import (
	"math"
)

type Interval_angle struct {
	start float64
	size float64
}

func (interval_angle Interval_angle) end() float64 {
	return angle_polar(interval_angle.start+interval_angle.size)
}

func (interval_angle Interval_angle) is_contained(interval_angle_1 Interval_angle) bool {
	return interval_angle_1.is_containing(interval_angle.start) == true && interval_angle_1.is_containing(interval_angle.end()) == true
}

func (interval_angle Interval_angle) is_containing(angle float64) bool {
	return angle_polar(angle-interval_angle.start) <= interval_angle.size
}


func (interval_angle Interval_angle) is_overlap(interval_angle_1 Interval_angle) bool {
	return interval_angle.is_containing(interval_angle_1.start) || interval_angle.is_containing(interval_angle_1.end())
}

func (interval_angle Interval_angle) union(interval_angle_1 Interval_angle) Interval_angle {
	var union Interval_angle
	if interval_angle.is_overlap(interval_angle_1) == false {
		return union
	}
	if interval_angle.is_containing(interval_angle_1.start) == true {
		union.start = interval_angle.start
		union.size = min(2*math.Pi, max(interval_angle.size, angle_polar(interval_angle_1.start-interval_angle.start)+interval_angle_1.size))
		return union
	}
	if interval_angle_1.is_containing(interval_angle.start) == true {
		union.start = interval_angle_1.start
		union.size = min(2*math.Pi, max(interval_angle_1.size, angle_polar(interval_angle.start-interval_angle_1.start)+interval_angle.size))
		return union
	}
	return union

}

type Set_Interval_angle struct {
	elements []Interval_angle
}

func (set_interval_angle Set_Interval_angle) append(interval_angle Interval_angle) {
	set_interval_angle.elements = append(set_interval_angle.elements, interval_angle)
}

func (set_interval_angle Set_Interval_angle) ascending() {
	var intervals_angle []Interval_angle
	for _, interval_angle := range set_interval_angle.elements {
		key := 0
		for _, interval_angle_1 := range set_interval_angle.elements {
			if interval_angle.start > interval_angle_1.start || (interval_angle.start == interval_angle_1.start && interval_angle.size > interval_angle_1.size) {
				key++
			}
		}
		intervals_angle[key] = interval_angle
	}
	set_interval_angle.elements = intervals_angle
}

func (set_interval_angle Set_Interval_angle) complement() Set_Interval_angle {

	var complement Set_Interval_angle

	intervals_angle := append(set_interval_angle.elements, set_interval_angle.elements[0])
	for i := 0; i < len(set_interval_angle.elements); i++ {
		var interval_angle Interval_angle
		interval_angle.start = intervals_angle[i].end()
		interval_angle.size = angle_polar(intervals_angle[i+1].start-intervals_angle[i].end())
		complement.elements = append(complement.elements, interval_angle)
	}
	return complement


}

func (set_interval_angle Set_Interval_angle) is_full() bool {
	set_interval_angle.ascending()
	intervals_angle := append(set_interval_angle.elements, set_interval_angle.elements[0])
	for key, _ := range intervals_angle {
		if intervals_angle[key].is_overlap(intervals_angle[key+1]) == false {
			return false
		}
	}
	return true
}

func (set_interval_angle Set_Interval_angle) max() Interval_angle {
	key := 0
	for i := 1; i < len(set_interval_angle.elements); i++ {
		if set_interval_angle.elements[key].size < set_interval_angle.elements[i].size || (set_interval_angle.elements[key].size == set_interval_angle.elements[i].size && set_interval_angle.elements[key].start > set_interval_angle.elements[i].start) {
			key = i
		}
	}
	return set_interval_angle.elements[key]
}

func (set_interval_angle Set_Interval_angle) union() Set_Interval_angle {
	
	set_interval_angle.ascending()
	intervals_angle := set_interval_angle.elements
	union_interval_angle := []Interval_angle{intervals_angle[0]}
	for i := 1; i < len(intervals_angle); i++ {
		if union_interval_angle[len(union_interval_angle)-1].is_overlap(intervals_angle[i]) == false {
			union_interval_angle = append(union_interval_angle, intervals_angle[i])
		} else {
			union_interval_angle[len(union_interval_angle)-1] = union_interval_angle[len(union_interval_angle)-1].union(intervals_angle[i])
		}
	}
	if union_interval_angle[0].is_overlap(union_interval_angle[len(union_interval_angle)-1]) == true {
		union_interval_angle[len(union_interval_angle)-1] = union_interval_angle[len(union_interval_angle)-1].union(union_interval_angle[0])
		union_interval_angle = union_interval_angle[1:]
	} 
	return Set_Interval_angle{union_interval_angle}

	
}

