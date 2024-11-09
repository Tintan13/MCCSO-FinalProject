// controllers/controller_inventory.js
const connection = require('../config/database');

// Get all inventory items
exports.getInventory = (req, res) => {
    const inventoryQuery = 'SELECT * FROM inventory';
    const categoryQuery = 'SELECT * FROM categories';

    connection.query(inventoryQuery, (err, inventory) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving inventory');
        }

        connection.query(categoryQuery, (err, categories) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving categories');
            }

            res.render('inventory', { inventory, categories });
        });
    });
};
// Get a single inventory item by ID
exports.getInventoryById = (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM inventory WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving item');
        }
        res.json(results[0]);
    });
};

// Add a new inventory item
exports.addInventoryItem = (req, res) => {
    const { 
        category,  // This will now be the category name from the form
        item_name, 
        serial_name, 
        model, 
        brand, 
        amount, 
        purchase_date 
    } = req.body;

    const query = `
        INSERT INTO inventory 
        (category_name, name, serial_no, model, brand, amount, purchase_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [category, item_name, serial_name, model, brand, amount, purchase_date],
        (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({
                    error: 'Internal Server Error',
                    details: err.message
                });
            }
            res.redirect('/inventory');
        }
    );
};

// Update inventory item
exports.updateInventory = (req, res) => {
    const { id } = req.params;
    const { category, name, serial_no, model, brand, amount, purchase_date } = req.body;
    
    const query = `
        UPDATE inventory 
        SET category_name = ?, 
            name = ?, 
            serial_no = ?, 
            model = ?, 
            brand = ?, 
            amount = ?, 
            purchase_date = ?
        WHERE id = ?
    `;
    
    const values = [category, name, serial_no, model, brand, amount, purchase_date, id];

    connection.query(query, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating item');
        }
        res.redirect('/inventory');
    });
};

// Delete inventory item
exports.deleteInventory = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM inventory WHERE id = ?';

    connection.query(query, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting item');
        }
        res.status(200).send('Item deleted');
    });
};