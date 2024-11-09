const connection = require('../config/database');

const categoryController = {
    getCategories: (req, res) => {
        const query = 'SELECT * FROM categories ORDER BY created_at DESC';
        connection.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.render('category/list', { categories: results });
        });
    },

    addCategory: (req, res) => {
        const { category_name } = req.body;
        
        if (!category_name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const query = 'INSERT INTO categories (category_name) VALUES (?)';
        
        connection.query(query, [category_name], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ 
                success: true, 
                message: 'Category added successfully',
                category: {
                    id: result.insertId,
                    category_name: category_name
                }
            });
        });
    }




};

module.exports = categoryController;