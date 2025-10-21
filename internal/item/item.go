package item

type Item struct {
	Name    string `json:"name"`
	Checked bool   `json:"checked"`
}

func NewItem(name string) *Item {
	return &Item{name, false}
}

func (item *Item) GetName() string {
	return item.Name
}

func (item *Item) GetChecked() bool {
	return item.Checked
}

func (item *Item) Check() {
	item.Checked = !item.Checked
}
