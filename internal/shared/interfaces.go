package shared

// Item interface defines the behavior expected from any item.
type Item interface {
	Check()
	GetName() string
	GetChecked() bool
}

// ShoppingList interface abstracts shopping list operations.
type ShoppingList interface {
	Add(name string) (Item, error)
	Toggle(name string) (Item, error)
	GetItems() []Item
	Delete(name string) error
	DeleteAll()
}

// Auth interface abstracts authentication logic.
type Auth interface {
	Login(password string) (string, error)
	VerifyToken(token string) error
}
