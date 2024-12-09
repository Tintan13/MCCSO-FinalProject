const connection = require('../config/database');

// Get all Items with Pagination
exports.getItems = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM items';
    connection.query(countQuery, (err, countResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const query = `
            SELECT * FROM items 
            LIMIT ? OFFSET ?
        `;
        connection.query(query, [limit, offset], (err, items) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            res.render('item', {
                success: true,
                items: items || [],
                pagination: {
                    page,
                    totalPages,
                    totalRecords,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            });
        });
    });
};


// Add Item
exports.addItem = (req, res) => {
    // Destructure form data from request body
    const {
        category, item_name, product_number, serial_number,
        model, brand, amount, personnel, department,
        request_date, item_condition
    } = req.body;

    // Prepare SQL query to insert item data into database
    const query = `
        INSERT INTO items (category, item_name, product_number, serial_number, 
                           model, brand, amount, personnel, department, 
                           request_date, item_condition)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute query with the data from the form
    connection.execute(query, [
        category, item_name, product_number, serial_number, 
        model, brand, amount, personnel, department, 
        request_date, item_condition
    ], (error, results) => {
        if (error) {
            console.error('Error inserting item:', error);
            res.status(500).send('Server error');
        } else {
            // Redirect to the specified route after successful insertion
            res.redirect('/item');
        }
    });
};



// Update Item
exports.updateItem = (req, res) => {
    const { id } = req.params;
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

    // Validate ID
    if (!id || id === 'null' || id === 'undefined') {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid item ID' 
        });
    }

    // Convert empty strings to null for database
    const updateValues = [
        category || null,
        item_name || null,
        product_number || null,
        serial_number || null,
        model || null,
        brand || null,
        amount || null,
        personnel || null,
        department || null,
        request_date || null,
        item_condition || null,
        id
    ];

    const updateQuery = `
        UPDATE items
        SET 
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
        WHERE id = ?
    `;

    connection.query(updateQuery, updateValues, (err, results) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ success: false, message: 'Server Error', error: err });
        }

        if (results.affectedRows > 0) {
            res.redirect('/item');
        } else {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
    });
};


// Fetch categories
exports.getCategories = (req, res) => {
    const query = 'SELECT id, category_name FROM categories';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch categories' });
        }
        res.json(results); // Return the categories as JSON
    });
};

// Fetch department
exports.getDepartments = (req, res) => {
    const query = 'SELECT department_id, department_name FROM department';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch departments' });
        }
        res.json(results); // Return the departments as JSON
    });
};

// Fetch personnel
exports.getPersonnel = (req, res) => {
    const query = 'SELECT id, personnel_name FROM personnel';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to fetch personnel' });
        }
        res.json(results); // Return the personnel data as JSON
    });
};


// Delete Item
exports.deleteItem = (req, res) => {
    const itemId = req.params.id;

    // Prepare SQL query to delete the item
    const query = 'DELETE FROM items WHERE id = ?';

    // Execute query with the item ID
    connection.execute(query, [itemId], (error, results) => {
        if (error) {
            console.error('Error deleting item:', error);
            res.status(500).send('Server error');
        } else {
            // Check if any row was actually deleted
            if (results.affectedRows > 0) {
                res.status(200).send('Item deleted successfully');
            } else {
                res.status(404).send('Item not found');
            }
        }
    });
};





module.exports = exports;
