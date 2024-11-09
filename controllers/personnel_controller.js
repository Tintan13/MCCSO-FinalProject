//personnel_controller.js

const connection = require('../config/database');

// Utility function to validate personnel ID format
const validatePersonnelId = (personnel_id) => {
    // Check if ID matches pattern: idintNo
    const idPattern = /^id\d+No$/;
    return idPattern.test(personnel_id);
};

// Get all Personnel with pagination
exports.getPersonnel = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM personnel';
    
    connection.query(countQuery, (err, countResult) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const query = `
            SELECT p.*, d.department_name 
            FROM personnel p 
            LEFT JOIN department d ON p.department_id = d.department_id
            LIMIT ? OFFSET ?
        `;
        
        connection.query(query, [limit, offset], (err, personnel) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            connection.query('SELECT * FROM department', (err, departments) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.render('personnel', { 
                    personnel: personnel || [],
                    departments: departments || [],
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
    });
};

// Add Personnel
exports.addPersonnel = (req, res) => {
    const { personnel_id, personnel_name, department_id, position } = req.body;

    // Debug log
    console.log('Received data:', {
        personnel_id,
        personnel_name,
        department_id,
        position
    });

    // Basic validation
    if (!personnel_id || !personnel_name) {
        return res.status(400).json({
            success: false,
            error: 'Personnel ID and name are required'
        });
    }

    // First, check if the department exists (if department_id is provided)
    if (department_id) {
        const checkDepartmentQuery = 'SELECT department_id FROM department WHERE department_id = ?';
        connection.query(checkDepartmentQuery, [department_id], (err, deptResults) => {
            if (err) {
                console.error('Error checking department:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Database error while checking department'
                });
            }

            if (deptResults.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid department ID'
                });
            }

            // If department exists or no department_id provided, proceed with insertion
            proceedWithInsertion();
        });
    } else {
        proceedWithInsertion();
    }

    function proceedWithInsertion() {
        // Check for existing personnel_id
        const checkQuery = 'SELECT personnel_id FROM personnel WHERE personnel_id = ?';
        connection.query(checkQuery, [personnel_id], (err, results) => {
            if (err) {
                console.error('Error checking existing personnel:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Database error while checking existing personnel'
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Personnel ID already exists'
                });
            }

            // Prepare the insert query
            const insertQuery = `
                INSERT INTO personnel 
                (personnel_id, personnel_name, department_id, position) 
                VALUES (?, ?, ?, ?)
            `;

            const values = [
                personnel_id,
                personnel_name,
                department_id || null,
                position || null
            ];

            // Debug log
            console.log('Executing insert query:', {
                query: insertQuery,
                values: values
            });

            // Execute the insert
            connection.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error inserting personnel:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Database error during insert',
                        details: err.message
                    });
                }

                console.log('Insert successful:', result);
                return res.status(200).json({
                    success: true,
                    message: 'Personnel added successfully',
                    personnel: {
                        id: result.insertId,
                        personnel_id,
                        personnel_name,
                        department_id,
                        position
                    }
                });
            });
        });
    }
};

// Update Personnel
exports.updatePersonnel = (req, res) => {
    const { id } = req.params;
    const { personnel_name, department_id, position } = req.body;

    // Validate required fields
    if (!personnel_name) {
        return res.status(400).json({
            success: false,
            error: 'Personnel name is required'
        });
    }

    // First check if personnel exists
    const checkQuery = 'SELECT * FROM personnel WHERE personnel_id = ?';
    connection.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                error: 'Database error while checking personnel'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Personnel not found'
            });
        }

        // Proceed with update if personnel exists
        const updateQuery = `
            UPDATE personnel 
            SET personnel_name = ?, 
                department_id = ?, 
                position = ? 
            WHERE personnel_id = ?
        `;

        connection.query(
            updateQuery, 
            [personnel_name, department_id || null, position || null, id], 
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Database error during update'
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'No personnel found with this ID'
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Personnel updated successfully',
                    personnel: {
                        personnel_id: id,
                        personnel_name,
                        department_id,
                        position
                    }
                });
            }
        );
    });
};

// Delete Personnel
exports.deletePersonnel = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            error: 'Personnel ID is required'
        });
    }

    // First check if personnel exists
    const checkQuery = 'SELECT * FROM personnel WHERE personnel_id = ?';
    connection.query(checkQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                success: false,
                error: 'Database error while checking personnel'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Personnel not found'
            });
        }

        // Proceed with deletion if personnel exists
        const deleteQuery = 'DELETE FROM personnel WHERE personnel_id = ?';
        connection.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Database error during deletion'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'No personnel found with this ID'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Personnel deleted successfully'
            });
        });
    });
};


module.exports = exports;