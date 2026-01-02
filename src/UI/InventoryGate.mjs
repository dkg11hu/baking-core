export const InventoryGate = {
    /**
     * Checks if all prerequisites for a product are in stock
     * @param {string} id - Product ID
     * @param {Object} ssot - Global definitions
     * @param {Object} inventory - Current stock levels
     */
    async isAvailable(id, ssot, inventory) {
        // We load the entity to see the specific recipe requirements
        const res = await fetch(`${ssot.orchestration.paths.entities}/${id}.json`);
        const entity = await res.json();
        
        // Logic: Every ingredient ID in formula must exist in inventory with amount > 0
        return entity.formula.every(ing => {
            const stock = inventory[ing.id] || 0;
            return stock > 0; // Or stock >= required_scaled_mass if target weight is known
        });
    }
};