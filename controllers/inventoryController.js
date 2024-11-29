const db = require('../config/database');

const inventoryController = {
    // Get all inventory items
    getInventory: (req, res) => {
        db.query(`
            SELECT * 
            FROM inventory 
            ORDER BY id DESC
        `, (inventoryError, inventory) => {
            if (inventoryError) {
                console.error('Error fetching inventory:', inventoryError);
                return res.status(500).send('Error fetching inventory data');
            }

            db.query('SELECT * FROM categories', (categoriesError, categories) => {
                if (categoriesError) {
                    console.error('Error fetching categories:', categoriesError);
                    return res.status(500).send('Error fetching categories');
                }

                res.render('inventory', {
                    inventory: inventory,
                    categories: categories,
                    title: 'Inventory Management'
                });
            });
        });
    },

    // Get a single inventory item by ID
    getInventoryById: (req, res) => {
        const id = req.params.id;
        db.query('SELECT * FROM inventory WHERE id = ?', [id], (error, item) => {
            if (error) {
                console.error('Error fetching inventory item:', error);
                return res.status(500).json({ message: 'Error fetching inventory item' });
            }

            if (item.length === 0) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.json(item[0]);
        });
    },

    // Add a new inventory item
    addInventoryItem: (req, res) => {
        console.log('Add Item Request Body:', req.body);
    
        const {
            category,        // Changed from category_name
            item_name,       // Changed from name
            serial_name,     // Changed from serial_no
            model,
            brand,
            amount,
            purchase_date
        } = req.body;
    
        // Detailed logging of each field
        console.log('category:', category);
        console.log('item_name:', item_name);
        console.log('serial_name:', serial_name);
        console.log('model:', model);
        console.log('brand:', brand);
        console.log('amount:', amount);
        console.log('purchase_date:', purchase_date);
    
        // Check each field individually
        const missingFields = [];
        if (!category) missingFields.push('category');
        if (!item_name) missingFields.push('item_name');
        if (!serial_name) missingFields.push('serial_name');
        if (!model) missingFields.push('model');
        if (!brand) missingFields.push('brand');
        if (!amount) missingFields.push('amount');
        if (!purchase_date) missingFields.push('purchase_date');
    
        if (missingFields.length > 0) {
            return res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
        }
    
        db.query(
            `INSERT INTO inventory 
            (category_name, name, serial_no, model, brand, amount, purchase_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [category, item_name, serial_name, model, brand, amount, purchase_date],
            (insertError, result) => {
                if (insertError) {
                    console.error('Error adding item:', insertError);
                    return res.status(500).send('Error adding inventory item');
                }
    
                res.redirect('/inventory');
            }
        );
    },
    
    // Similarly, update the update method
    updateInventory: (req, res) => {
        const id = req.params.id;
        const {
            category,        // Changed from category_name
            item_name,       // Changed from name
            serial_name,     // Changed from serial_no
            model,
            brand,
            amount,
            purchase_date
        } = req.body;
    
        // Check each field individually
        const missingFields = [];
        if (!category) missingFields.push('category');
        if (!item_name) missingFields.push('item_name');
        if (!serial_name) missingFields.push('serial_name');
        if (!model) missingFields.push('model');
        if (!brand) missingFields.push('brand');
        if (!amount) missingFields.push('amount');
        if (!purchase_date) missingFields.push('purchase_date');
    
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: `Missing fields: ${missingFields.join(', ')}`,
                missingFields: missingFields
            });
        }
    
        db.query(
            `UPDATE inventory SET 
            category_name = ?, 
            name = ?, 
            serial_no = ?, 
            model = ?, 
            brand = ?, 
            amount = ?, 
            purchase_date = ? 
            WHERE id = ?`,
            [category, item_name, serial_name, model, brand, amount, purchase_date, id],
            (updateError, result) => {
                if (updateError) {
                    console.error('Error updating item:', updateError);
                    return res.status(500).json({ success: false, message: 'Error updating inventory item' });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: 'Item not found' });
                }
    
                res.json({ success: true, message: 'Item updated successfully' });
            }
        );
    },

    // Delete an inventory item
    deleteInventory: (req, res) => {
        const id = req.params.id;

        db.query('DELETE FROM inventory WHERE id = ?', [id], (error, result) => {
            if (error) {
                console.error('Error deleting item:', error);
                return res.status(500).json({ success: false, message: 'Error deleting inventory item' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Item not found' });
            }

            res.json({ success: true, message: 'Item deleted successfully' });
        });
    }
};

module.exports = inventoryController;