USE employee_db;

INSERT INTO departments (name)
VALUES ("Sales"), ("Engineering"), ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1), ("Salesperson", 80000, 1), 
("Accountant", 125000, 3), ("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Tami", "Taylor", 4), ("Landry", "Clarke", 3), 
("Tyra", "Colletee", 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Tim", "Riggins", 2, 3), ("Julie", "Taylor", 5, 1),
("Coach", "Taylor", 2, 3), ("Smash", "Williams", 5, 1);

-- SELECT title
-- FROM roles;
-- UNION

-- SELECT * FROM employees;

-- SELECT * FROM roles;


-- UPDATE employees
-- SET role_id = 3
-- WHERE id = 9;

-- view departments --
-- SELECT name
-- FROM departments;

-- view roles --
-- SELECT title AS 'role', name AS 'department', salary
-- FROM roles
-- JOIN departments
-- ON roles.department_id = departments.id;

