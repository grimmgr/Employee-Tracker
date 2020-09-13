USE employee_db;

INSERT INTO departments (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100, 1), ("Salesperson", 80, 1), 
("Accountant", 125, 3), ("Lead Engineer", 150, 2),
("Software Engineer", 120, 2), ("Legal Team Lead", 250, 4),
("Lawyer", 190, 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Ashley", "Rodriguez", 4), ("Malia", "Brown", 3), 
("Sarah", "Lourd", 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 1), ("Mike", "Chan", 2, 4),
("Kevin", "Tupik", 5, 1), ("Tom", "Allen", 7, 3), 
("Chris", "Ecken", 4, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Nero", "Bedero", 1, NULL);

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

SELECT * FROM employees;

SELECT * FROM roles;

SELECT * FROM departments;

-- view employees --
WITH dept_roles AS (
SELECT roles.id, name AS 'department', title, salary
FROM departments
JOIN roles
ON departments.id = roles.department_id
)
SELECT employees.id, first_name, last_name, department, title, salary, manager_id
FROM employees
JOIN dept_roles
ON employees.role_id = dept_roles.id
ORDER BY department;


SELECT employees.id, employees.first_name, employees.last_name, departments.name AS 'department', roles.title, roles.salary, employees.manager_id
FROM departments
JOIN roles
ON departments.id = roles.department_id
JOIN employees
ON employees.role_id = roles.id;

SELECT e.first_name, m.first_name
FROM employees e
JOIN employees m on e.id = m.manager_id;