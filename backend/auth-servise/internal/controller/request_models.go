package controller

// CreateVacancyRequest represents the request structure for creating a vacancy
type CreateVacancyRequest struct {
    Title            string   `json:"Title" binding:"required"`
    Company          string   `json:"Company" binding:"required"`
    Description      string   `json:"Description"`
    Requirements     string   `json:"Requirements"`
    Responsibilities string   `json:"Responsibilities"`
    Salary          int      `json:"Salary" binding:"required"`
    Location        string   `json:"Location" binding:"required"`
    EmploymentType  string   `json:"EmploymentType" binding:"required"`
    Skills          []string `json:"Skills"`
    Education       string   `json:"Education"`
    EmployerID      int64    `json:"EmployerID"`
}

// UpdateVacancyRequest represents the request structure for updating a vacancy
type UpdateVacancyRequest struct {
    Title            string   `json:"Title" binding:"required"`
    Company          string   `json:"Company" binding:"required"`
    Description      string   `json:"Description"`
    Requirements     string   `json:"Requirements"`
    Responsibilities string   `json:"Responsibilities"`
    Salary          int      `json:"Salary" binding:"required"`
    Location        string   `json:"Location" binding:"required"`
    EmploymentType  string   `json:"EmploymentType" binding:"required"`
    Status          string   `json:"Status" binding:"required"`
    Skills          []string `json:"Skills"`
    Education       string   `json:"Education"`
    EmployerID      int64    `json:"EmployerID"`
} 