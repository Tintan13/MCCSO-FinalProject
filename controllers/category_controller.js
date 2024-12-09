const connection = require('../config/database').promise(); // Use promise wrapper

const categoryController = {
    getCategories: async (req, res) => {
        try {
            const [results] = await connection.query('SELECT * FROM categories ORDER BY created_at DESC');
            res.render('category/list', { categories: results });
        } catch (err) {
            console.error('Error in getCategories:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
        }
    },

    addCategory: async (req, res) => {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({ 
                success: false,
                error: 'Category name is required' 
            });
        }

        try {
            const [result] = await connection.query(
                'INSERT INTO categories (category_name, created_at) VALUES (?, NOW())', 
                [category_name]
            );

            res.status(201).json({ 
                success: true, 
                message: 'Category added successfully',
                category: {
                    id: result.insertId,
                    category_name: category_name
                }
            });
        } catch (err) {
            console.error('Error in addCategory:', err);
            res.status(500).json({ 
                success: false,
                error: 'Failed to add category',
                details: err.message
            });
        }
    },


    deleteCategory: async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Category ID is required',
            });
        }

        try {
            const [result] = await connection.query(
                'DELETE FROM categories WHERE id = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Category deleted successfully',
            });
        } catch (err) {
            console.error('Error in deleteCategory:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to delete category',
                details: err.message,
            });
        }
    },

    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { category_name } = req.body;
    
        // Validate input
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Category ID is required',
            });
        }
    
        if (!category_name) {
            return res.status(400).json({
                success: false,
                error: 'Category name is required',
            });
        }
    
        try {
            // Check if category exists
            const [existingCategory] = await connection.query(
                'SELECT * FROM categories WHERE id = ?',
                [id]
            );
    
            if (existingCategory.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found',
                });
            }
    
            // Update category - removed updated_at
            const [result] = await connection.query(
                'UPDATE categories SET category_name = ? WHERE id = ?',
                [category_name, id]
            );
    
            if (result.affectedRows === 0) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to update category',
                });
            }
    
            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                category: {
                    id: id,
                    category_name: category_name
                }
            });
        } catch (err) {
            console.error('Error in updateCategory:', err);
            res.status(500).json({
                success: false,
                error: 'Failed to update category',
                details: err.message,
            });
        }
    },
    

};

module.exports = categoryController;
