const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');

var db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_db'
  });
  
  db.connect(function(err) {
    if (err) { throw err; }
    initialPrompt();
  });

const departments = [];
const roles = [];
const employees = [];

const initialPrompt = () => {
    return inquirer
        .prompt ({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
              'View departments',
              'View roles',
              'View employees',
              'Add department',
              'Add role',
              'Add employee',
              'Update employee roles'
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
            case 'View departments':
              viewDepartments();
              break;
      
            case 'View roles':
              viewRoles();
              break;
      
            case 'View employees':
              viewEmployees();
              break;
      
            case 'Add department':
              addDepartment();
              break;
      
            case 'Add role':
              addRole();
              break;

            case 'Add employee':
              addEmployee();
              break;

            case 'Update employee roles':
              updateEmployeeRoles();
              break;
            }
        });
}

const viewDepartments = () => {
    db.query(
        'SELECT name FROM departments', (err, res) => {
            if (err) { throw err; }
        }
    )
}

const viewRoles = () => {
    db.query(
        'SELECT title AS \'role\', name AS \'department\', salary FROM roles JOIN departments ON roles.department_id = departments.id', (err, res) => {
            if (err) { throw err; }
        }
    );
}

const viewEmployees = () => {
    db.query(
        'WITH dept_roles AS ( SELECT roles.id, name AS \'department\', title, salary FROM departments JOIN roles ON departments.id = roles.department_id ) SELECT employees.id, first_name, last_name, department, title, salary, manager_id FROM employees JOIN dept_roles ON employees.role_id = dept_roles.id', (err, res) => {
            if (err) { throw err; }
        }
    );
}

const addDepartment = () => {
    inquirer.prompt(
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department you\'d like to add?'
          }
    )
    .then((answer) => {
        new Department(answer.name);
        db.query(
            'INSERT INTO departments SET ?',
            { name:  answer.name }, 
            (err, res) => {
                if (err) { throw err; }
            }
        )
    })
    
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the role you\'d like to add?'
        },
        {
            name: 'salary',
            type: 'input',
            message: 'How much is the salary for this role?'
        },
        {
            name: 'department',
            type: 'list',
            message: 'In which department is the role?',
            choices: []
        }
    ])
    .then((answer) => {
        new Role(answer.title, answer.salary);
        // let department_id = answer.department.getId();
        db.query(
            'INSERT INTO roles SET ?',
            {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department.getDeptId()
            },
            (err, res) => {
                if (err) { throw err; }
            }
        )
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the employee\'s first name?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the employee\'s last name?'
        },
        {
            name: 'role',
            type: 'list',
            message: 'What is the employee\'s role?',
            choices: []
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Who is the employee\'s manager?',
            choices: []
        }
    ])
    .then((answer) => {
        new Employee(answer.first_name, answer.last_name, answer.role, answer.manager);

        db.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role.getRoleId(),
                manager_id: answer.manager.getEmployeeId()
            },
            (err, res) => {
                if (err) { throw err; }
            }
        )
    })
}

const updateEmployeeRoles = () => {
    inquirer.prompt([
       {
            name: 'name',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: []
       },
       {
           name: 'role',
           type: 'list',
           message: 'What is their new role?',
           choices: []
       }
    ])
    .then((answer) => {
        db.query(
            'UPDATE employees SET ? WHERE ?',
            { role_id: answer.role.getRoleId() },
            { id: answer.name.getEmployeeId()},
            (err, res) => {
                if (err) { throw err; }
            }
        )
    })
}