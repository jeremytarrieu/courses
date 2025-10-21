package app

import (
	"log"
	"net/http"
	"shopping/internal/middleware"
	"shopping/internal/routes"
	"shopping/internal/shared"
)

// Run sets up the HTTP server with routes and middleware.
func Run(auth shared.Auth, shoppingList shared.ShoppingList) {
	handler := routes.NewHandler(auth, shoppingList)

	// Serve static files
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	// Public routes
	http.HandleFunc("/", handler.HandleHome)
	http.HandleFunc("/api/login", handler.HandleLogin)

	// Protected routes
	protectedRoutes := map[string]http.HandlerFunc{
		"/api/items":           handler.HandleItems,
		"/api/items/add":       handler.HandleAddItem,
		"/api/items/toggle":    handler.HandleToggleItem,
		"/api/items/delete":    handler.HandleDeleteItem,
		"/api/items/deleteAll": handler.HandleDeleteAll,
	}

	for path, fn := range protectedRoutes {
		http.HandleFunc(path, middleware.AuthMiddleware(auth, fn))
	}

	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
