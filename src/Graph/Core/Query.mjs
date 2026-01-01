// src/Graph/Core/Query.mjs

export class DatabaseQuery {
    constructor(ssot) {
        this.ssot = ssot;
    }

    /**
     * QUERY 1: Filter for Products
     * Returns only items that can be "Baked" (BRANCH nodes)
     */
    getBakeableProducts() {
        // Fieldnames are pulled strictly from the database-driven inventory
        return Object.entries(this.ssot.inventory)
            .filter(([id, item]) => item.type === 'BRANCH')
            .map(([id, item]) => ({
                id: id,
                category: item.category_id
            }));
    }

    /**
     * QUERY 2: Search by Attribute
     * Allows the frontend to filter by 'hydration_role' or 'type'
     */
    filterByCategory(categoryId) {
        return Object.entries(this.ssot.inventory)
            .filter(([id, item]) => item.category_id === categoryId);
    }
}