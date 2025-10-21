package main

import (
	"log"
	"shopping/internal/app"
	"shopping/internal/list"
	"shopping/internal/security"
)

func main() {
	sec, err := security.NewSinglePasswordAuth()
	if err != nil {
		log.Fatal(err)
	}
	shoppingList := list.NewShoppingList()
	app.Run(sec, shoppingList)
}
