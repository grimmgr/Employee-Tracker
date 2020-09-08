const mysql = require('mysql');

class Role {
    constructor(title, salary) {
        this.title = title;
        this.salary = salary;
    }

    getRoleId() {
        return db.query(
            'SELECT id FROM roles WHERE ?', { title: this.title }, (err, res) => {
                if (err) { throw err; }
            }
        );
    }
}

module.exports = Role;