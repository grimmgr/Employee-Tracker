const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const db = mysql.createConnection({
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

const mainOrExit = () => {
    return inquirer
        .prompt({
            name: 'choice',
            type: 'list',
            message: 'Would you like to go back to the main menu or exit?',
            choices: [
                'Main Menu',
                'Exit'
            ]
        })
        .then(answer => {
            if (answer.choice === 'Main Menu') {
                initialPrompt();
            } else {
                db.end();
            }
        })
}

const initialPrompt = () => {
    return inquirer
        .prompt ({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'View all employees by department',
              'View all employees by manager',
              'Add department',
              'Add role',
              'Add employee',
              'Update employee roles',
              'Update employee\'s manager',
              'Delete a department',
              'Delete a role',
              'Delete an employee',
              'Exit'
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
            case 'View all departments':
              viewDepartments();
              break;
      
            case 'View all roles':
              viewRoles();
              break;
      
            case 'View all employees':
              viewEmployees();
              break;

            case 'View all employees by department':
              viewEmployeesByDepartment();
              break;

            case 'View all employees by manager':
              viewEmployeesByManager();
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

            case 'Update employee\'s manager':
              updateEmployeeManager();
              break;

            case 'Delete a department':
              deleteDepartment();
              break;

            case 'Delete a role':
              deleteRole();
              break;

            case 'Delete an employee':
              deleteEmployee();
              break;

            case 'Exit':
              db.end();
            }
        });
}

const viewDepartments = () => {
    db.query( 'SELECT name AS \'departments\' FROM departments', (err, res) => {
        if (err) { throw err };

        console.log('');
        console.table(res);
        mainOrExit();
    })
}

const viewRoles = () => {
    db.query( 'SELECT title AS \'role\', name AS \'department\', salary FROM roles JOIN departments ON roles.department_id = departments.id', (err, res) => {
        if (err) { throw err };
        
        console.log('');
        console.table(res);
        mainOrExit();
    })
}

const viewEmployees = () => {
    db.query('SELECT e.id, e.first_name, e.last_name, departments.name AS \'department\', roles.title, roles.salary, CONCAT(m.first_name, \' \', m.last_name) AS \'manager\' FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id', (err, res) => {
        if (err) { throw err };
        
        console.log('');
        console.table(res);
        mainOrExit();
    });
}

const viewEmployeesByDepartment = () => {
    db.query( 'SELECT departments.name AS \'department\', e.id, e.first_name, e.last_name, roles.title, roles.salary, CONCAT(m.first_name, \' \', m.last_name) AS \'manager\' FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY department', (err, res) => {
        if (err) { throw err };
        
        console.log('');
        console.table(res);
        mainOrExit();
    });
}

const viewEmployeesByManager = () => {
    db.query( 'SELECT CONCAT(m.first_name, \' \', m.last_name) AS \'manager\', e.id, e.first_name, e.last_name, departments.name AS \'department\', roles.title, roles.salary FROM employees e LEFT JOIN employees m ON e.manager_id = m.id JOIN roles ON e.role_id = roles.id JOIN departments ON roles.department_id = departments.id ORDER BY manager', (err, res) => {
        if (err) { throw err };
        
        console.log('');
        console.table(res);
        mainOrExit();
    });
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
        // const newDept = new Department(answer.name);
        db.query(
            'INSERT INTO departments SET ?', { name:  answer.name }, (err, res) => {
                if (err) { throw err };

                console.log('');
                console.log(`${answer.name} has been added to Departments.`);
                console.log('');
                mainOrExit();
        });
    })
}

const addRole = () => {

    db.query('SELECT name FROM departments', (err, res) => {

        if (err) {throw err};

        let deptList = [];

        for (let i = 0; i < res.length; i++) {
            deptList.push(res[i].name);
        }

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
                type: 'rawlist',
                message: 'In which department is the role?',
                choices: deptList
            }
        ])
        .then((answer) => {
            // store role title and salary from inquirer prompts
            const newRoleTitle = answer.title;
            const newRoleSalary = answer.salary;
            // find the department id
            db.query('SELECT id FROM departments WHERE ?', { name: answer.department }, (err, res) => {
                //handle error
                if (err) {throw err};
                // store department_id in variable
                const newRoleDeptId = res[0].id;
                // insert new role into database
                db.query(
                    'INSERT INTO roles SET ?',
                    {
                        title: newRoleTitle,
                        salary: newRoleSalary,
                        department_id: newRoleDeptId
                    },
                    (err, res) => {
                        if (err) { throw err };

                        console.log('');
                        console.log(`${newRoleTitle} has been added to Roles.`);
                        console.log('');
                        mainOrExit();
                    }
                );
            })
        })
    })
}

const addEmployee = () => {
    // get roles
    db.query('SELECT title FROM roles', (err, res) => {
        
        if (err) {throw err};
        
        let rolesList = [];

        for (let i = 0; i < res.length; i++) {
            rolesList.push(res[i].title);
        }

        db.query('SELECT first_name, last_name FROM employees', (err, res) => {

            if (err) {throw err};

            let employeesList = ['No manager'];

            for (let i = 0; i < res.length; i++) {
                employeesList.push(`${res[i].first_name} ${res[i].last_name}`);
            }

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
                    choices: rolesList
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is the employee\'s manager?',
                    choices: employeesList
                }
            ])
            .then((answer) => {
                const empFirstName = answer.first_name;
                const empLastName = answer.last_name;
                const empRole = answer.role;
                const empManagerFirst = answer.manager.split(' ')[0];
                const empManagerLast = answer.manager.split(' ')[1];
                
                db.query('SELECT id FROM roles WHERE ?', { title: empRole }, (err, res) => {

                    if (err) { throw err };

                    const empRoleId = res[0].id;

                    if (answer.manager !== 'No manager') {

                        db.query('SELECT id FROM employees WHERE ? AND ?', [{first_name: empManagerFirst}, {last_name: empManagerLast}], (err, res) => {
                            if (err) {throw err};

                            const empManagerId = res[0].id;

                            db.query(
                                'INSERT INTO employees SET ?',
                                {
                                    first_name: empFirstName,
                                    last_name: empLastName,
                                    role_id: empRoleId,
                                    manager_id: empManagerId
                                },
                                (err, res) => {
                                    if (err) throw err;

                                    console.log('');
                                    console.log(`${empFirstName} ${empLastName} has been added`);
                                    console.log('');

                                    mainOrExit();
                                }
                            )
                        });
                    } else {
                        db.query(
                            'INSERT INTO employees SET ?',
                            {
                                first_name: empFirstName,
                                last_name: empLastName,
                                role_id: empRoleId,
                                manager_id: null
                            },
                            (err, res) => {
                                if (err) { throw err };

                                console.log('');
                                console.log(`${empFirstName} ${empLastName} has been added.`);
                                console.log('');

                                mainOrExit();
                            }
                        );
                    }
                })
            })
        });
    });
}

const updateEmployeeRoles = () => {
    db.query('SELECT first_name, last_name FROM employees', (err, res) => {

        if (err) {throw err};

        let employeesList = [];

        for (let i = 0; i < res.length; i++) {
            employeesList.push(`${res[i].first_name} ${res[i].last_name}`);
        }

        db.query('SELECT title FROM roles', (err, res) => {
        
            if (err) {throw err};
            
            let rolesList = [];
    
            for (let i = 0; i < res.length; i++) {
                rolesList.push(res[i].title);
            }

            inquirer.prompt([
            {
                name: 'name',
                type: 'list',
                message: 'Which employee would you like to update?',
                choices: employeesList
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is their new role?',
                choices: rolesList
            }
            ])
            .then((answer) => {

                const firstName = answer.name.split(' ')[0];
                const lastName = answer.name.split(' ')[1];

                db.query('SELECT id FROM roles WHERE ?', { title: answer.role }, (err, res) => {

                    if (err) { throw err };

                    const roleId = res[0].id;

                    db.query('SELECT id FROM employees WHERE ? AND ?', [{ first_name: firstName }, { last_name: lastName }], (err, res) => {

                        if (err) {throw err};

                        const empId = res[0].id;

                        db.query(
                            'UPDATE employees SET ? WHERE ?',
                            [ { role_id: roleId }, { id: empId } ],
                            (err, res) => {
                                if (err) throw err;

                                console.log(`${firstName} ${lastName}'s role has been changed.`);

                                mainOrExit();
                            }
                        )
                    })
                })
            })
        })
    })
}

const updateEmployeeManager = () => {

    db.query('SELECT first_name, last_name FROM employees', (err, res) => {

        if (err) {throw err};
    
        let employeesList = [];
    
        for (let i = 0; i < res.length; i++) {
                employeesList.push(`${res[i].first_name} ${res[i].last_name}`);
        }

        inquirer.prompt([
            {
                name: 'name',
                type: 'list',
                message: 'Which employee would you like to assign a new manager?',
                choices: employeesList
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is their new manager?',
                choices: employeesList
            }
        ])
        .then((answer) => {

            const empFirstName = answer.name.split(' ')[0];
            const empLastName = answer.name.split(' ')[1];

            const managerFirstName = answer.manager.split(' ')[0];
            const managerLastName = answer.manager.split(' ')[1];

            db.query('SELECT id FROM employees WHERE ? AND ?', [{ first_name: empFirstName },{last_name: empLastName }], (err, res) => {

                if (err) throw err;

                const employeeId = res[0].id;

                db.query('SELECT id FROM employees WHERE ? AND ?', [{ first_name: managerFirstName}, {last_name: managerLastName }], (err, res) => {

                    if (err) throw err;
    
                    const managerId = res[0].id;

                    db.query(
                        'UPDATE employees SET ? WHERE ?',
                        [ { manager_id: managerId }, { id: employeeId } ],
                        (err, res) => {

                            if (err) throw err;

                            console.log('');
                            console.log(`${empFirstName} ${empLastName}'s manager has been changed to ${managerFirstName} ${managerLastName}.`);
                            console.log('');
                            mainOrExit();
                        }
                    )
                })
            })
                
        })
    });
}

const deleteDepartment = () => {
    db.query('SELECT name FROM departments', (err, res) => {

        if (err) {throw err};

        let deptList = [];

        for (let i = 0; i < res.length; i++) {
            deptList.push(res[i].name);
        }

        inquirer.prompt([
            {
                name: 'department',
                type: 'rawlist',
                message: 'Which department would you like to delete?',
                choices: deptList
            }
        ])
        .then(answer => {
            db.query('DELETE FROM departments WHERE ?', { name: answer.department }, (err, res) => {
                if (err) throw err;

                console.log('');
                console.log(`${answer.department} deleted from departments.`)
                console.log('');

                mainOrExit();
            })
        })
    })
}

const deleteRole = () => {
    db.query('SELECT title FROM roles', (err, res) => {

        if (err) {throw err};

        let rolesList = [];

        for (let i = 0; i < res.length; i++) {
            rolesList.push(res[i].title);
        }

        inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                message: 'Which role would you like to delete?',
                choices: rolesList
            }
        ])
        .then(answer => {
            db.query('DELETE FROM roles WHERE ?', { title: answer.role }, (err, res) => {
                if (err) throw err;

                console.log('');
                console.log(`${answer.role} deleted from departments.`)
                console.log('');

                mainOrExit();
            })
        })
    })
}

const deleteEmployee = () => {
    db.query('SELECT first_name, last_name FROM employees', (err, res) => {

        if (err) {throw err};
    
        let employeesList = [];
    
        for (let i = 0; i < res.length; i++) {
                employeesList.push(`${res[i].first_name} ${res[i].last_name}`);
        }

        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to delete?',
                choices: employeesList
            }
        ])
        .then(answer => {

            const empFirstName = answer.employee.split(' ')[0];
            const empLastName = answer.employee.split(' ')[1];

            db.query('SELECT id FROM employees WHERE ? AND ?', [{ first_name: empFirstName}, {last_name: empLastName }], (err, res) => {

                if (err) throw err;

                const employeeId = res[0].id;

                db.query('DELETE FROM employees WHERE ?', { id: employeeId }, (err, res) => {
                    if (err) throw err;

                    console.log('');
                    console.log(`${empFirstName} ${empLastName} deleted from employees.`)
                    console.log('');

                    mainOrExit();
                })
            });
        })
    })
}