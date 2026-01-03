# Data Schemas & SSoT Dictionary

## 1. Registry (`registry`)
The primary index of bread components and products.
- **Field: `type`**: `BRANCH` (Product) or `LEAF` (Ingredient).
- **Field: `formula`**: Array of IDs and percentages (`pct`).
- **Field: `technology_ref`**: Pointer to the specific `technology` ID.

## 2. Physics (`physics_categories`)
Defines the behavior of materials and environmental variables.
- **Hydration Roles**: `base`, `fluid`, `additive`.
- **Calculation Keys**:
    - `SALTS`: Influences conductivity and flavor profile.
    - `SWEETENERS`: Influences fermentation rate.



## 3. Technologies (`technologies`)
The "Locked" instructions for Track #2.
- **Steps**: Object containing `video`, `tools`, and `logic_behaviors`.
- **Asset Handling**: 
    - Failed `video` paths trigger the `media-fallback` (Inline Data-URI SVG).

## 4. Localization (`locale`)
The bridge between technical IDs and the UI.
- **Standard**: `locale[ID] || ID.clean()`
- **Constraint**: No raw string literals allowed in UI components.