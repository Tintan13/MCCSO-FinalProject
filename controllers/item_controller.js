const db = require('../config/database');

const itemController = {
    // Get all items
    getItems: (req, res) => {
        db.query(`
            SELECT * 
            FROM items 
            ORDER BY id DESC
        `, (error, items) => {
            if (error) {
                console.error('Error fetching items:', error);
                return res.status(500).render('error', { 
                    message: 'Error fetching items data',
                    error: error 
                });
            }

            res.render('items', {
                items: items,
                title: 'Item Management'
            });
        });
    },

    // Search items
    searchItems: (req, res) => {
        const searchTerm = req.query.term;
        
        db.query(`
            SELECT * 
            FROM items 
            WHERE category LIKE ? OR 
                  item_name LIKE ? OR 
                  product_number LIKE ? OR 
                  serial_number LIKE ? OR 
                  model LIKE ? OR 
                  brand LIKE ? OR 
                  personnel LIKE ? OR 
                  department LIKE ?
            ORDER BY id DESC
        `, Array(8).fill(`%${searchTerm}%`), (error, items) => {
            if (error) {
                console.error('Error searching items:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error searching items' 
                });
            }

            res.json(items);
        });
    },

    // Get a single item by ID
    getItemById: (req, res) => {
        const id = req.params.id;
        db.query('SELECT * FROM items WHERE id = ?', [id], (error, items) => {
            if (error) {
                console.error('Error fetching item:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error fetching item' 
                });
            }

            if (items.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Item not found' 
                });
            }

            res.json(items[0]);
        });
    },

    // Add a new item
    addItem: (req, res, next) => {
        const {
            category,
            item_name,
            product_number,
            serial_number,
            model,
            brand,
            amount,
            personnel,
            department,
            request_date,
            item_condition
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'category', 'item_name', 'amount', 'request_date', 'item_condition'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        db.query(
            `INSERT INTO items 
            (category, item_name, product_number, serial_number, model, brand, 
            amount, personnel, department, request_date, item_condition) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                category, item_name, 
                product_number || null, 
                serial_number || null, 
                model || null, 
                brand || null, 
                parseFloat(amount), 
                personnel || null, 
                department || null, 
                request_date, 
                item_condition
            ],
            (insertError, result) => {
                if (insertError) {
                    console.error('Error adding item:', insertError);
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Error adding item',
                        error: insertError.message 
                    });
                }

                res.status(201).json({ 
                    success: true, 
                    message: 'Item added successfully',
                    id: result.insertId 
                });
            }
        );
    },

    updateItem: (req, res) => {
        const id = req.params.id;
        const {
            category,
            item_name,
            product_number,
            serial_number,
            model,
            brand,
            amount,
            personnel,
            department,
            request_date,
            item_condition
        } = req.body;

        // More strict validation
        if (!category || !item_name || !amount || !request_date || !item_condition) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields' 
            });
        }

        db.query(
            `UPDATE items SET 
            category = ?, 
            item_name = ?, 
            product_number = ?, 
            serial_number = ?, 
            model = ?, 
            brand = ?, 
            amount = ?, 
            personnel = ?, 
            department = ?, 
            request_date = ?, 
            item_condition = ? 
            WHERE id = ?`,
            [
                category, item_name, 
                product_number || null, 
                serial_number || null, 
                model || null, 
                brand || null, 
                parseFloat(amount), 
                personnel || null, 
                department || null, 
                request_date, 
                item_condition,
                id
            ],
            (updateError, result) => {
                if (updateError) {
                    console.error('Error updating item:', updateError);
                    return res.status(500).json({ 
                        success: false, 
                        message: updateError.message || 'Error updating item'
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Item not found' 
                    });
                }

                res.json({ 
                    success: true, 
                    message: 'Item updated successfully' 
                });
            }
        );
    },

    // Delete an item
    deleteItem: (req, res) => {
        const id = req.params.id;

        db.query('DELETE FROM items WHERE id = ?', [id], (error, result) => {
            if (error) {
                console.error('Error deleting item:', error);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error deleting item',
                    error: error 
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Item not found' 
                });
            }

            res.json({ 
                success: true, 
                message: 'Item deleted successfully' 
            });
        });
    }
};

module.exports = itemController;