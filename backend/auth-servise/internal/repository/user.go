package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/Mandarinka0707/newRepoGOODarhit/internal/entity"
	"github.com/jmoiron/sqlx"
)

type UserRepositoryInterface interface {
	Create(ctx context.Context, user *entity.User) error
	GetByID(ctx context.Context, id int64) (*entity.User, error)
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	Update(ctx context.Context, user *entity.User) error
	Delete(ctx context.Context, id int64) error
	GetAll(ctx context.Context) ([]*entity.User, error)
}

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *entity.User) error {
	query := `
		INSERT INTO users (email, password, name, role, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`

	err := r.db.QueryRowContext(
		ctx,
		query,
		user.Email,
		user.Password,
		user.Name,
		user.Role,
		user.CreatedAt,
		user.UpdatedAt,
	).Scan(&user.ID)

	return err
}

func (r *UserRepository) GetByID(ctx context.Context, id int64) (*entity.User, error) {
	query := `
		SELECT id, email, password, name, role, created_at, updated_at
		FROM users
		WHERE id = $1`

	user := &entity.User{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	query := `
		SELECT id, email, password, name, role, created_at, updated_at
		FROM users
		WHERE email = $1`

	user := &entity.User{}
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) Update(ctx context.Context, user *entity.User) error {
	// Проверяем, что ID пользователя установлен
	if user.ID == 0 {
		return errors.New("user ID is required")
	}

	// Сначала проверим, существует ли пользователь
	existingUser, err := r.GetByID(ctx, user.ID)
	if err != nil {
		fmt.Printf("Error checking existing user: %v\n", err)
		return err
	}
	if existingUser == nil {
		fmt.Printf("User with ID %d not found\n", user.ID)
		return errors.New("user not found")
	}

	fmt.Printf("Current user data in DB: %+v\n", existingUser)

	query := `
		UPDATE users
		SET email = $1, password = $2, name = $3, role = $4, updated_at = $5
		WHERE id = $6
		RETURNING id, email, name, role, created_at, updated_at`

	fmt.Printf("Executing update query: %s\n", query)
	fmt.Printf("Parameters: email=%s, password=%s, name=%s, role=%s, updated_at=%v, id=%d\n",
		user.Email, user.Password, user.Name, user.Role, user.UpdatedAt, user.ID)

	// Используем QueryRowContext вместо ExecContext, чтобы получить обновленные данные
	err = r.db.QueryRowContext(
		ctx,
		query,
		user.Email,
		user.Password,
		user.Name,
		user.Role,
		user.UpdatedAt,
		user.ID,
	).Scan(
		&user.ID,
		&user.Email,
		&user.Name,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		fmt.Printf("Error executing update: %v\n", err)
		return err
	}

	fmt.Printf("Updated user data: %+v\n", user)
	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM users WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		fmt.Printf("[UserRepository.Delete] Error executing delete: %v\n", err)
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Printf("[UserRepository.Delete] Error getting rows affected: %v\n", err)
		return err
	}
	if rowsAffected == 0 {
		fmt.Printf("[UserRepository.Delete] No user found with id: %d\n", id)
		return errors.New("user not found")
	}
	fmt.Printf("[UserRepository.Delete] Successfully deleted user with id: %d\n", id)
	return nil
}

func (r *UserRepository) GetAll(ctx context.Context) ([]*entity.User, error) {
	query := `SELECT id, name, email, role, created_at, updated_at FROM users`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*entity.User
	for rows.Next() {
		user := &entity.User{}
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Email,
			&user.Role,
			&user.CreatedAt,
			&user.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
