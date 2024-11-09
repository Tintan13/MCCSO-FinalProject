// controllers/department_controller.js

const connection = require('../config/database');

// Get all Department Function with pagination
exports.getDepartments = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Items per page
    const offset = (page - 1) * limit;

    // Get total count of departments
    connection.query('SELECT COUNT(*) as total FROM department', (countErr, countResults) => {
        if (countErr) {
            console.error('Database error:', countErr);
            return res.status(500).json({ error: 'Database error' });
        }

        const totalRecords = countResults[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        // Get paginated departments
        connection.query(
            'SELECT * FROM department LIMIT ? OFFSET ?',
            [limit, offset],
            (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.render('department', {
                    departments: results,
                    pagination: {
                        page: page,
                        totalPages: totalPages,
                        totalRecords: totalRecords,
                        hasPrev: page > 1,
                        hasNext: page < totalPages
                    }
                });
            }
        );
    });
};



// Add Department Function
exports.addDepartment = (req, res) => {
    const { department_name } = req.body;
    
    if (!department_name || department_name.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            error: 'Department name is required' 
        });
    }

    connection.query(
        'INSERT INTO department (department_name) VALUES (?)', 
        [department_name.trim()], 
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database error' 
                });
            }
            
            return res.status(200).json({ 
                success: true, 
                department: { 
                    department_id: results.insertId, 
                    department_name: department_name.trim() 
                }
            });
        }
    );
};

//Update Department Function
exports.updateDepartment = (req, res) => {
    const { department_id } = req.params;
    const { department_name } = req.body;
    
    if (!department_id || !department_name || department_name.trim() === '') {
        return res.status(400).json({ 
            success: false, 
            error: 'Department ID and name are required' 
        });
    }

    connection.query(
        'UPDATE department SET department_name = ? WHERE department_id = ?',
        [department_name.trim(), department_id],
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database error' 
                });
            }
            return res.status(200).json({ 
                success: true,
                department: {
                    department_id,
                    department_name: department_name.trim()
                }
            });
        }
    );
};

// Delete department function
exports.deleteDepartment = (req, res) => {
    const { department_id } = req.params;
    
    if (!department_id) {
        return res.status(400).json({ 
            success: false, 
            error: 'Department ID is required' 
        });
    }

    connection.query(
        'DELETE FROM department WHERE department_id = ?',
        [department_id],
        (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database error' 
                });
            }
            return res.status(200).json({ success: true });
        }
    );
};

module.exports = exports;