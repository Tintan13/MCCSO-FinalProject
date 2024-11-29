const connection = require('../config/database');

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const [results] = await connection.query('SELECT * FROM categories ORDER BY created_at DESC');
            res.render('category/list', { categories: results });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    addCategory: async (req, res) => {
        const { category_name } = req.body;
        
        if (!category_name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        try {
            const [result] = await connection.query('INSERT INTO categories (category_name) VALUES (?)', [category_name]);
            
            res.json({ 
                success: true, 
                message: 'Category added successfully',
                category: {
                    id: result.insertId,
                    category_name: category_name
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        }
    },
};

module.exports = categoryController;