const readline = require('readline');
const fs = require('fs');

// Create readline interface
const interface = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

// Read existing tasks from database.json
const data = fs.readFileSync('database.json','utf8');

// Parse data into an array
const parsedData = JSON.parse(data||'[]');
const database = [...parsedData];


// Prompt user for command
interface.question('task-cli: ', (command)=> {

    // Extract id , description and method from command
    const id = command.match(/\b\d+\b/)?.[0];
    const description = command.match(/["']([^"']*)["']/)?.[1];
    const method = command.split(' ')[0];
    const statuses = ['todo', 'done', 'in-progress'];
   
    // Get current date
    const date = new Date().toLocaleTimeString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'});
    
    // Create task template
    const template = {id: database.length + 1, description: description, status: 'todo', createdAt: date, updatedAt: date};
    
   
   
    // Handle commands
    switch(method){
        case 'add':
            database.push(template);
            fs.writeFile('database.json', JSON.stringify(database, null, 2), (err) => {
                if (err) throw err;
            });
            console.log(`Task added successfully (ID: ${template.id}).`);
            break;
            
        case 'update':
            if(database.length === 0){
                console.log('No tasks found to update. Add a task using the "add" command.');
                break;
            }
            if (database.find(task => task.id == Number(id)) === undefined) {
                console.log(`No task found with ID: ${id}.`);
                break;
            }
            let updatedTask = database.map(task => {
                if(task.id == Number(id)){
                    return {...task, description: description, updatedAt: date};
                }
                return task;
            });
             fs.writeFile('database.json', JSON.stringify(updatedTask, null, 2), (err) => {
                if (err) throw err;
            });
            break;

        case 'delete':
            if(database.length === 0){
                console.log('No tasks found to delete. Add a task using the "add" command.');
                break;
            }
            if (database.find(task => task.id == Number(id)) === undefined) {
                console.log(`No task found with ID: ${id}.`);
                break;
            }
            let filteredTask = database.filter(task => (task.id != Number(id)));
             fs.writeFile('database.json', JSON.stringify(filteredTask, null, 2), (err) => {
                if (err) throw err;
            });
            break;

        case ('mark-todo'):
            if(database.length === 0){
                console.log('No tasks found to mark. Add a task using the "add" command.');
                break;
            }
            if (database.find(task => task.id == Number(id)) === undefined) {
                console.log(`No task found with ID: ${id}.`);
                break;
            }
            let todoStatusToUpdate = method.split('-').slice(-1).join('');
            let todoStatusUpdatedTask = database.map(task => {
                if(task.id == Number(id)){
                    return {...task, status: todoStatusToUpdate, updatedAt: date};
                }
                return task;
            });
             fs.writeFile('database.json', JSON.stringify(todoStatusUpdatedTask, null, 2), (err) => {
                if (err) throw err;
            });
            break;
        case ('mark-done' ):
            if(database.length === 0){
                console.log('No tasks found to mark. Add a task using the "add" command.');
                break;
            }
             if (database.find(task => task.id == Number(id)) === undefined) {
                console.log(`No task found with ID: ${id}.`);
                break;
            }
            let doneStatusToUpdate = method.split('-').slice(-1).join('');
            let doneStatusUpdatedTask = database.map(task => {
                if(task.id == Number(id)){
                    return {...task, status: doneStatusToUpdate, updatedAt: date};
                }
                return task;
            });
             fs.writeFile('database.json', JSON.stringify(doneStatusUpdatedTask, null, 2), (err) => {
                if (err) throw err;
            });
            break;
        case ('mark-in-progress'):
            if(database.length === 0){
                console.log('No tasks found to mark. Add a task using the "add" command.');
                break;
            }
             if (database.find(task => task.id == Number(id)) === undefined) {
                console.log(`No task found with ID: ${id}.`);
                break;
            }
            let inProgressStatusToUpdate = method.split('-');
            let inProgressStatusUpdatedTask = database.map(task => {
                if(task.id == Number(id)){
                    return {...task, status: `${inProgressStatusToUpdate[1]}-${inProgressStatusToUpdate[2]}`, updatedAt: date};
                }
                return task;
            });
             fs.writeFile('database.json', JSON.stringify(inProgressStatusUpdatedTask, null, 2), (err) => {
                if (err) throw err;
            });
            break;
        
        case 'list':
            const status = command.split(' ')[1];
            if(database.length === 0){
                console.log('No tasks found. Add a task using the "add" command.');
                break;
            }else if(status && statuses.includes(status)){
                const filteredTasks = database.filter(task => task.status === status);
                if(filteredTasks.length === 0){
                    console.log(`No tasks with status "${status}" found.`);
                    break;
                }
                filteredTasks.forEach(task => {
                    console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
                });
            }
            else{
                database.forEach(task => {
                    console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${task.status}, Created At: ${task.createdAt}, Updated At: ${task.updatedAt}`);
                });
            }
            break;
        
        default:
            console.log('Invalid command. Please read the readme file for valid commands.');
    }
    
    interface.close();
});

