package middleware

import (
	"net/http"
	"strings"
)

// Auth interface abstracts authentication logic.
type Auth interface {
	Login(password string) (string, error)
	VerifyToken(token string) error
}

func AuthMiddleware(auth Auth, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: missing token", http.StatusUnauthorized)
			return
		}

		// Format attendu : "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Unauthorized: invalid token format", http.StatusUnauthorized)
			return
		}

		token := parts[1]
		if err := auth.VerifyToken(token); err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	}
}
