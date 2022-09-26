package Cartesian2D

type Interval struct {
	min float64
	max float64
}

func (interval Interval) center() float64 {
	return (interval.min+interval.max)/2
}

func (interval Interval) length() float64 {
	return interval.max-interval.min
}

func (interval Interval) is_overlap(interval_1 Interval) bool {
	if interval.min > interval_1.max || interval.max < interval_1.min {
		return false
	}
	return true
}