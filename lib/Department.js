const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_db'
  });
  
  db.connect(function(err) {
    if (err) { throw err; }
  });

class Department {
    constructor(name) {
        this.name = name;
    }

    async getDeptId() {
        const id = await db.query( 'SELECT id FROM departments WHERE ?', { name: this.name });
        
        
    }
}



const Sales = new Department('Sales');

// Sales.getDeptId();

console.log(Sales);

Sales.getDeptId();

// console.log(Sales.getDeptId());

//let id;

// db.query( 'SELECT id FROM departments WHERE ?', { name: 'Sales' }, (err, res) => {
//    if (err) { throw err };
//    return console.log(res[0].id);
// })

module.exports = Department