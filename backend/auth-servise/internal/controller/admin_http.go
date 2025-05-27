package controller

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/Mandarinka0707/newRepoGOODarhit/internal/entity"
	"github.com/Mandarinka0707/newRepoGOODarhit/internal/usecase"
	"github.com/gin-gonic/gin"
)

type AdminController struct {
	userUsecase    usecase.UserUsecaseInterface
	vacancyUsecase usecase.VacancyUsecaseInterface
	resumeUsecase  usecase.ResumeUsecaseInterface
}

func NewAdminController(
	userUsecase usecase.UserUsecaseInterface,
	vacancyUsecase usecase.VacancyUsecaseInterface,
	resumeUsecase usecase.ResumeUsecaseInterface,
) *AdminController {
	return &AdminController{
		userUsecase:    userUsecase,
		vacancyUsecase: vacancyUsecase,
		resumeUsecase:  resumeUsecase,
	}
}

// GetAllUsers returns all users in the system
func (c *AdminController) GetAllUsers(ctx *gin.Context) {
	users, err := c.userUsecase.GetAll(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, users)
}

// DeleteUser deletes a user by ID
func (c *AdminController) DeleteUser(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	if err := c.userUsecase.Delete(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// DeleteVacancy deletes a vacancy by ID
func (c *AdminController) DeleteVacancy(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid vacancy id"})
		return
	}

	// For admin, we pass 0 as employerID to bypass the ownership check
	if err := c.vacancyUsecase.Delete(ctx, id, 0); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// DeleteResume deletes a resume by ID
func (c *AdminController) DeleteResume(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid resume id"})
		return
	}

	if err := c.resumeUsecase.Delete(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}

// GetUserStats returns statistics about users
func (c *AdminController) GetStats(ctx *gin.Context) {
	stats, err := c.userUsecase.GetStats(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, stats)
}

func (c *AdminController) GetAllVacancies(ctx *gin.Context) {
	fmt.Printf("AdminController.GetAllVacancies: Starting to fetch all vacancies\n")
	vacancies, err := c.vacancyUsecase.GetAll(ctx)
	if err != nil {
		fmt.Printf("AdminController.GetAllVacancies: Error fetching vacancies: %v\n", err)
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("AdminController.GetAllVacancies: Successfully fetched %d vacancies\n", len(vacancies))
	ctx.JSON(200, vacancies)
}

func (c *AdminController) GetAllResumes(ctx *gin.Context) {
	resumes, err := c.resumeUsecase.GetAll(ctx)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, resumes)
}

// UpdateUser updates a user by ID
func (c *AdminController) UpdateUser(ctx *gin.Context) {
	id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	// Логируем тело запроса
	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		fmt.Printf("Error reading request body: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	fmt.Printf("Raw request body: %s\n", string(body))

	// Восстанавливаем тело запроса для дальнейшего использования
	ctx.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	var user entity.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Устанавливаем ID из URL параметра
	user.ID = id

	fmt.Printf("Received user data: %+v\n", user)

	// Получаем существующего пользователя
	existingUser, err := c.userUsecase.GetByID(ctx, id)
	if err != nil {
		fmt.Printf("Error getting existing user: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get user"})
		return
	}
	if existingUser == nil {
		fmt.Printf("User with ID %d not found\n", id)
		ctx.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	fmt.Printf("Existing user data: %+v\n", existingUser)

	// Сохраняем существующий пароль
	user.Password = existingUser.Password
	user.CreatedAt = existingUser.CreatedAt
	user.UpdatedAt = time.Now()

	fmt.Printf("Final user data to update: %+v\n", user)

	if err := c.userUsecase.Update(ctx, &user); err != nil {
		fmt.Printf("Error updating user: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update user"})
		return
	}

	fmt.Printf("User successfully updated\n")
	ctx.JSON(http.StatusOK, user)
}

// AdminUpdateVacancy updates a vacancy with admin privileges
func (c *AdminController) AdminUpdateVacancy(ctx *gin.Context) {
    id, err := strconv.ParseInt(ctx.Param("id"), 10, 64)
    if err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid vacancy id"})
        return
    }

    var vacancy entity.Vacancy
    if err := ctx.ShouldBindJSON(&vacancy); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Set the ID from the URL
    vacancy.ID = id

    // Call the admin update method
    if err := c.vacancyUsecase.AdminUpdate(ctx.Request.Context(), &vacancy); err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    ctx.JSON(http.StatusOK, vacancy)
}

// CreateUserRequest represents the request structure for creating a user
type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=jobseeker employer"`
}

// CreateUser creates a new user
func (c *AdminController) CreateUser(ctx *gin.Context) {
	fmt.Printf("AdminController.CreateUser: Starting to create new user\n")

	// Логируем тело запроса
	body, err := io.ReadAll(ctx.Request.Body)
	if err != nil {
		fmt.Printf("Error reading request body: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	fmt.Printf("Raw request body: %s\n", string(body))

	// Восстанавливаем тело запроса для дальнейшего использования
	ctx.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	var req CreateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Received user data: %+v\n", req)

	user := &entity.User{
		Email:    req.Email,
		Password: req.Password,
		Name:     req.Name,
		Role:     req.Role,
	}

	fmt.Printf("Creating user with data: %+v\n", user)

	if err := c.userUsecase.Register(ctx.Request.Context(), user); err != nil {
		fmt.Printf("Error registering user: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("User successfully created with ID: %d\n", user.ID)

	ctx.JSON(http.StatusCreated, gin.H{
		"id":        user.ID,
		"email":     user.Email,
		"name":      user.Name,
		"role":      user.Role,
		"createdAt": user.CreatedAt,
	})
}
