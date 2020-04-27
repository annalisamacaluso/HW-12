INSERT INTO department (name)
VALUES ("HR"),("Sales"),("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("HR Worker", 50000.01, 1),("Sales Worker", 50000.01, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Smith", 1, null),("Jane", "Smith", 1, 1);