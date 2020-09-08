const mysql = require('mysql');

class Employee {
    constructor(first_name, last_name, role, manager) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;
        this.manager = manager;
    }

    getEmployeeId() {
        return db.query(
            'SELECT id FROM employees WHERE ?', { first_name: this.first_name }, (err, res) => {
                if (err) { throw err; }
            }
        );
    }
}

module.exports = Employee;