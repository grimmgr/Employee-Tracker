const mysql = require('mysql');

class Department {
    constructor(name) {
        this.name = name;
    }

    getDeptId() {
        return db.query(
            'SELECT id FROM departments WHERE ?', { name: this.name }, (err, res) => {
                if (err) { throw err; }
            }
        );
    }
}

module.exports = Department