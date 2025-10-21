package list

import (
	"errors"
	"shopping/internal/item"
	"shopping/internal/shared"
	"sync"
)

// ShoppingList manages a thread-safe list of items.
type ShoppingList struct {
	items []shared.Item
	mu    sync.RWMutex
}

// NewShoppingList creates a new ShoppingList with the given factory.
func NewShoppingList() *ShoppingList {
	return &ShoppingList{
		items: make([]shared.Item, 0),
	}
}

// Add adds a new item to the list if it doesn't already exist.
func (list *ShoppingList) Add(name string) (shared.Item, error) {
	list.mu.Lock()
	defer list.mu.Unlock()
	for _, it := range list.items {
		if it.GetName() == name {
			return it, errors.New("item already exists")
		}
	}
	newItem := item.NewItem(name)
	list.items = append(list.items, newItem)
	return newItem, nil
}

// Remove deletes an item by name.
func (list *ShoppingList) Remove(name string) {
	list.mu.Lock()
	defer list.mu.Unlock()
	for i, it := range list.items {
		if it.GetName() == name {
			list.items = append(list.items[:i], list.items[i+1:]...)
			break
		}
	}
}

// Toggle flips the checked status of an item.
func (list *ShoppingList) Toggle(name string) (shared.Item, error) {
	list.mu.Lock()
	defer list.mu.Unlock()
	for _, it := range list.items {
		if it.GetName() == name {
			it.Check()
			return it, nil
		}
	}
	return nil, errors.New("item not found")
}

// GetItems returns a copy of the item list.
func (list *ShoppingList) GetItems() []shared.Item {
	list.mu.RLock()
	defer list.mu.RUnlock()
	return list.items
}

// Delete removes an item by name and returns true if successful.
func (list *ShoppingList) Delete(name string) error {
	list.mu.Lock()
	defer list.mu.Unlock()
	for i, it := range list.items {
		if it.GetName() == name {
			list.items = append(list.items[:i], list.items[i+1:]...)
			return nil
		}
	}
	return errors.New("item not found")
}

// DeleteAll clears the entire list.
func (list *ShoppingList) DeleteAll() {
	list.mu.Lock()
	defer list.mu.Unlock()
	list.items = make([]shared.Item, 0)
}
