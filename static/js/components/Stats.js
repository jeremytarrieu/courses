// /static/js/components/Stats.js
export class Stats {
    render(items) {
        const total = items.length;
        const checked = items.filter(i => i.checked).length;

        return `
            <div class="stats">
                <p id="statsText">${checked}/${total}</p>
            </div>
        `;
    }

}