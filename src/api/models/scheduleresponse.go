package models

type ScheduleResponse struct {
	Explanation string         `json:"explanation"`
	Tasks       []ScheduleItem `json:"tasks"`
}
