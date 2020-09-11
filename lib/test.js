const mysql = require('mysql');

const util = require('util');

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

const queryAsync = util.promisify(db.query).bind(db);




function renderList() {

    let deptList = [];

    db.query('SELECT name FROM departments', (err, res) => {
        
        if (err) {throw err};

        for (let i = 0; i < res.length; i++) {
            deptList.push(res[i].name);
        }

        // return deptList;
    })
    
    console.log(data);


}

db.query(
    'INSERT INTO employees SET ?',
    {
        first_name: 'Gretch',
        last_name: 'Grimm',
        role_id: 2,
        manager_id: null
    },
    (err, res) => {
        if (err) { throw err; }
    }
)

// renderList();

// console.log(renderList());