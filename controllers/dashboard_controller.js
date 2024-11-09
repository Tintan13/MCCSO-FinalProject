// controllers/dashboard_controller.js


const connection = require('../config/database');


// Function to get counts
const getCounts = (req, res) => {
    const counts = {};

    // Count personnel
    const personnelQuery = 'SELECT COUNT(*) AS personnelCount FROM personnel';
    const departmentQuery = 'SELECT COUNT(*) AS departmentCount FROM department';

    connection.query(personnelQuery, (err, personnelResults) => {
        if (err) throw err;

        counts.personnelCount = personnelResults[0].personnelCount;

        connection.query(departmentQuery, (err, departmentResults) => {
            if (err) throw err;

            counts.departmentCount = departmentResults[0].departmentCount;

            // Render index with counts
            res.render('index', { counts });
        });
    });
};

module.exports = {
    getCounts,
};
