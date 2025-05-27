package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func AuthMiddleware(tokenSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header format"})
			c.Abort()
			return
		}

		token := parts[1]
		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(tokenSecret), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		userID, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}

		c.Set("user_id", int64(userID))
		c.Next()
	}
}

func AdminAuthMiddleware(tokenSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Получаем токен из заголовка
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header format"})
			c.Abort()
			return
		}

		token := parts[1]
		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(tokenSecret), nil
		})

		if err != nil {
			fmt.Printf("Error parsing token: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		fmt.Printf("Token claims: %+v\n", claims)

		// Проверяем роль пользователя
		userRole, ok := claims["role"].(string)
		if !ok {
			fmt.Printf("Role not found in token claims or invalid type\n")
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: admin access required"})
			c.Abort()
			return
		}

		fmt.Printf("User role from token: %s\n", userRole)
		if userRole != "admin" {
			fmt.Printf("User role is not admin: %s\n", userRole)
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden: admin access required"})
			c.Abort()
			return
		}

		// Получаем ID пользователя
		userID, ok := claims["user_id"].(float64)
		if !ok {
			fmt.Printf("User ID not found in token claims or invalid type\n")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}

		// Сохраняем ID в контексте
		c.Set("user_id", int64(userID))
		c.Set("user_role", userRole)
		c.Next()
	}
}
