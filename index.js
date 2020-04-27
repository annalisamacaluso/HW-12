const inquirer = require("inquirer");
const mysql = require("mysql");
//require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // port: 8889,
    user: "root",
    password: "root",
    database: "employee_trackerDB"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    main();
});


function main(){
    inquirer.prompt(
        {
            type: "list",
            message: "What do you want to do?",
            name: "employee",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "Update Employee Roles",
                "I'm Done"
            ]
        }
    ).then(function(answer){
        console.log(answer.employee);
        switch (answer.employee) {
            case "Add Department":
                addDepartment();
                break;

            case "Add Role":
                addRole();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "View Departments":
                viewDepartments();
                break;

            case "View Roles":
                viewRoles();
                break;

            case "View Employees":
                viewEmployees();
                break;

            case "Update Employee Roles":
                updateEmployeeRoles();
                break;

            case "I'm Done":
                connection.end();
                break;

            default:
                break;
        }
    })
};

function viewDepartments(){
    console.log("Selecting all departments...\n");
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        console.table(res);
        main();
    });
}

function viewRoles(){
    console.log("Selecting all roles...\n");
    connection.query("SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id", function(err, res) {
        if (err) throw err;

        console.table(res);
        main();
    });
}

function viewEmployees(){
    console.log("Selecting all employees...\n");
    let queryString = "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, role.salary, concat(manager.first_name,' ', manager.last_name) AS manager_name "; 
    queryString += "FROM employee INNER JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id"
    connection.query(queryString, function(err, res) {
        if (err) throw err;

        console.table(res);
        main();
    });
}

function addDepartment(){
    inquirer.prompt(
        {
            type: "input",
            message: "What department do you want to add?",
            name:"addDepartment"
        }
    ).then(function(answer){
        console.log(answer)

        connection.query("INSERT INTO department SET ?",
        {
            name: answer.addDepartment
        },
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " departments inserted!\n");
            // Call updateProduct AFTER the INSERT completes
            main(0)
          }
        );
    })
}

function addRole(){

    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;

        console.table(res);

        inquirer.prompt([
            {
                type: "input",
                message: "What is your title",
                name:"title"
            },
            {
                type: "number",
                message: "What is your salary?",
                name:"salary"
            },
            {
                type: "number",
                message: "What is your department id?",
                name:"department_id"
            }
        ]).then(function(answers){
            console.log(answers)
    
            connection.query("INSERT INTO role SET ?",
            answers,
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " roles inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                main()
              }
            );
        })
    });

    
}

function addEmployee(){

    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;

        console.table(res);

        inquirer.prompt([
            {
                type: "input",
                message: "What is your first name",
                name:"first_name"
            },
            {
                type: "input",
                message: "What is your last name",
                name:"last_name"
            },
            {
                type: "number",
                message: "What is your role id?",
                name:"role_id"
            },
            {
                type: "number",
                message: "What is your manager id?",
                name:"manager_id"
            }
        ]).then(function(answers){
            console.log(answers)
    
            connection.query("INSERT INTO employee SET ?",
            answers,
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employees inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                main()
              }
            );
        })
    });
}

function updateEmployeeRoles(){
    connection.query("SELECT * FROM employee", function(err, res1){
        if (err) throw err;

            console.table(res1);

        connection.query("SELECT * FROM role", function(err, res) {
            if (err) throw err;

            console.table(res);

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is your employee id",
                    name:"employee_id"
                },
                {
                    type: "number",
                    message: "What is your new role id?",
                    name:"role_id"
                }
            ]).then(function(answers){
                console.log(answers)
        
                connection.query("UPDATE employee SET ? WHERE ?",
                [{
                    role_id: answers.role_id
                },
                {
                    id: answers.employee_id
                }],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employees inserted!\n");
                    // Call updateProduct AFTER the INSERT completes
                    main()
                }
                );
            })
        });
    })
}