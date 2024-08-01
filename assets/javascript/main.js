let main = document.querySelector("section main "),
    slider = document.querySelector("section main .slider"),
    sliderButton = document.querySelector("section main .slider span img"),
    sliderDeleteHistoryButton = document.querySelector("section main .slider .bottom .delete-history"),
    date = document.querySelector("section header .max-width .date"),
    section = document.querySelector("section"),
    deletedTaskMain = document.querySelector("section main .deleted-task-main"),
    deletedTaskContainer = document.querySelector("section main .deleted-task-main .deleted-tasks-container"),
    deletedTaskExitButton = document.querySelector("section main .deleted-task-main .exit"),
    addTaskButton = document.querySelector("section .add-task"),
    tasksContainer = document.querySelector("section main .tasks-container"),
    doneTask = document.querySelector("section .overlay .done-task"),
    deleteTaskButton = document.querySelector("section main .slider .clear-tasks"),
    noButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .noButton"),
    confirmButton = document.querySelector("section .overlay .alertBox .mainBox .buttonsBox .confirmButton"),
    settingButton = null,
    deleteButton = null,
    editButton =null;
    

function time() {
    setInterval(() => {
        let now = new Date();
        date.innerHTML = now.toLocaleString()
    }, 1000);
}
time()

function sliderMain() {
    function sliderHandle() {
        slider.addEventListener('mouseover', function (){
            slider.classList.add('open');
        })
        
        slider.addEventListener('mouseout', function (){
            slider.classList.remove('open');
        })

        if(window.innerWidth <= 600){
            sliderButton.addEventListener("click", function() {
                slider.classList.toggle("open")
            })
        }

    }
    sliderHandle()

}
sliderMain()

function checkIfAllTasksAreDone(test){

    for (const el of test) {
        if (el.getAttribute("data-status") == 'false') {
            // Set opacity to 1 and exit the loop
            el.parentElement.parentElement.setAttribute("data-status", "false")
            el.parentElement.parentElement.setAttribute("complete-date", 'not-completed-yet')
            let taskId = el.parentElement.parentElement.getAttribute("data-id"),
            TaskData = JSON.parse(localStorage.getItem(`${taskId}`));
            TaskData.completeDate = 'not-completed-yet'
            localStorage.setItem(`${taskId}` , JSON.stringify(TaskData)) 
            break;
        } else {
            // Set opacity to 0.7
            el.parentElement.parentElement.setAttribute("data-status", "complete")
            let now = new Date(),
            deleteTime = now.toLocaleString(),
            taskId = el.parentElement.parentElement.getAttribute("data-id"),
            TaskData = JSON.parse(localStorage.getItem(`${taskId}`));
            el.parentElement.parentElement.setAttribute("complete-date", `${deleteTime}`)
            TaskData.completeDate = `${deleteTime}`
            localStorage.setItem(`${taskId}` , JSON.stringify(TaskData)) 
        }
    }
} 

function addTasksFromLocal() {
    tasksContainer.innerHTML = ''
    if (localStorage.length != 0) {
        let allLocalStorageData = {};
        for (let i = 0; i < localStorage.length; i++) {
            // Get the key for the current index
            let key = localStorage.key(i);
            
            // Get the value for the current key
            let value = localStorage.getItem(key);
            
            // Store the key-value pair in the object
            allLocalStorageData[key] = value;
        }

        for (let key in allLocalStorageData) {
            if (allLocalStorageData.hasOwnProperty(key)) {
                // Get the JSON string for the current property
                let jsonString = allLocalStorageData[key];
                
                // Parse the JSON string to get the inner object
                try {
                    let innerObject = JSON.parse(jsonString);

                    function createTaskCard() {
                        // Create the main task card div
                        const taskCardDiv = document.createElement('div');
                        taskCardDiv.className = 'task-card';
                        taskCardDiv.setAttribute('data-id', `${key}`);
                        taskCardDiv.setAttribute("complete-date", `${JSON.parse(jsonString).completeDate}`)

                        // Create the title input
                        const title = document.createElement('div');
                        title.className = 'title';
                        title.innerText = innerObject['title'];

                        // Create the container div
                        const containerDiv = document.createElement('div');
                        containerDiv.className = 'container';

                        for (let i = 0; i < innerObject['data'][0].length; i++) {
                            const taskDiv = document.createElement('div');
                            taskDiv.className = 'task';
                            taskDiv.setAttribute('data-status', `${innerObject['data'][0][i]["status"]}`);

                            // Create the cont div
                            const contDiv = document.createElement('div');
                            contDiv.className = 'cont';

                            // Create the num div
                            const TaskNum = document.createElement('div');
                            TaskNum.className = 'num';
                            TaskNum.innerText = `${innerObject['data'][0][i]["num"]} `;

                            // Create the TaskData div
                            const TaskData = document.createElement('div');
                            TaskData.className = 'TaskData';
                            TaskData.innerText = ` ${innerObject['data'][0][i]["content"]}`;

                            // Create the task-content input
                            const taskContentCheckBox = document.createElement('input');
                            taskContentCheckBox.type = 'checkbox';
                            innerObject['data'][0][i]["status"] == 'complete' ? taskContentCheckBox.checked = true : taskContentCheckBox.checked = false;

                            // Create the task-content input
                            const DoneMessage = document.createElement('h2');
                            DoneMessage.classList.add("DoneAlarm");
                            DoneMessage.innerText = "Done";

                            // Append numDiv and taskContentInput to contDiv
                            containerDiv.appendChild(taskDiv);
                            taskDiv.appendChild(contDiv);
                            contDiv.appendChild(TaskNum);
                            contDiv.appendChild(TaskData);
                            taskDiv.appendChild(taskContentCheckBox);
                            taskCardDiv.appendChild(DoneMessage)
                        }

                        const date = document.createElement('div');
                        date.className = 'date';
                        date.innerText = innerObject["date"];

                        tasksContainer.appendChild(taskCardDiv);
                        taskCardDiv.appendChild(title);
                        taskCardDiv.appendChild(containerDiv);
                        taskCardDiv.appendChild(date);

                        checkIfAllTasksAreDone(taskCardDiv.querySelectorAll(".task"));
                    }
                    createTaskCard();

                } catch (error) {
                    // console.error(`Error parsing JSON for key "${key}":`, error);
                }
            }
        }
    }
}
addTasksFromLocal();

function tasksMain(){

    let completeTasksInput = document.querySelectorAll(".task-card .container .task  input");
    let DeleteTaskButton  = null;

    function createTask() {

        addTaskButton.addEventListener("click", function() {

            if(window.innerWidth <= 600){
                    slider.classList.remove("open")
            }

            let overlay = document.createElement("div")
            overlay.className = 'overlay';
            section.appendChild(overlay)

            // Create the main task card div
            const taskCardDiv = document.createElement('div');
            taskCardDiv.className = 'task-card';

            // Create the title input
            const titleInput = document.createElement('input');
            titleInput.className = 'title';
            titleInput.placeholder = '...';

            // Create the container div
            const containerDiv = document.createElement('div');
            containerDiv.className = 'container';

            // Function to create a task element
            function createTask(num) {
                // Create the task div
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';

                // Create the cont div
                const contDiv = document.createElement('div');
                contDiv.className = 'cont';

                // Create the num div
                const numDiv = document.createElement('div');
                numDiv.className = 'num';
                numDiv.textContent = num + ' - ';

                const deleteTaskImg = document.createElement('img');
                deleteTaskImg.className = 'deleteImg';
                deleteTaskImg.src = 'assets/imgs/close.png'
                DeleteTaskButton = deleteTaskImg

                // Create the task-content input
                const taskContentInput = document.createElement('input');
                taskContentInput.className = 'TaskData';
                taskContentInput.placeholder = '...';

                // Append numDiv and taskContentInput to contDiv
                contDiv.appendChild(numDiv);
                contDiv.appendChild(taskContentInput);
                contDiv.appendChild(deleteTaskImg);

                // Append contDiv to taskDiv
                taskDiv.appendChild(contDiv);

                return taskDiv;
            }

            // Create and append the first task element to the container div
            containerDiv.appendChild(createTask(1));

            // Create the add-task button
            const addTaskButton = document.createElement('button');
            addTaskButton.className = 'add-task';
            addTaskButton.textContent = 'add task';

            // Add event listener to the add-task button to add new tasks
            addTaskButton.addEventListener('click', () => {
                const taskCount = containerDiv.getElementsByClassName('task').length + 1;
                containerDiv.insertBefore(createTask(taskCount), addTaskButton);
                // DeleteTaskButton = overlay.querySelectorAll(".deleteImg");
                getAllDeleteTaskButton()
            });

            // Append titleInput, containerDiv, and addTaskButton to taskCardDiv
            taskCardDiv.appendChild(titleInput);
            taskCardDiv.appendChild(containerDiv);
            containerDiv.appendChild(addTaskButton);

            let doneTask = document.createElement("button");
            doneTask.className = 'done-task';
            doneTask.innerHTML = 'Create Task';

            let cancelButton = document.createElement("button");
            cancelButton.className = 'cancel-button';
            cancelButton.innerHTML = 'Cancel';

            overlay.appendChild(taskCardDiv);
            overlay.appendChild(doneTask);
            overlay.appendChild(cancelButton);

            getAllDeleteTaskButton()

            function getAllDeleteTaskButton() {
                DeleteTaskButton = overlay.querySelectorAll(".deleteImg");

                DeleteTaskButton.forEach(element => {
                        element.addEventListener("click", function() {
                            element.parentElement.parentElement.remove();

                            addTaskButton.parentElement.querySelectorAll(".task").forEach((element ,index)=> {
                                element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -` 
                            });
                        })
                });
            }

// ####################################################

            // when press create task button 
            doneTask.addEventListener("click", function() {
                
                taskTitle = overlay.querySelector(".title")
                tasksContent = overlay.querySelectorAll(".task")

                let now = new Date();
                let allTasksData = [];
                tasksContent.forEach(element => { 
                    let num = element.querySelector(".num").textContent
                    let taskContent = element.querySelector(".TaskData").value
                    let tasksData = {num: num , content: taskContent, "status": "false"}
                    allTasksData.push(tasksData);
                });

                let NewTask = {
                    title: `${taskTitle.value}`,
                    date: `${now.toLocaleString()}`,
                    data: [allTasksData]
                }

                function addDataToLocal() {

                    function getRandomThreeDigitNumber() {

                        if  (localStorage.length == 0 ){
                            let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                            return idNum;
                        } else {
                            for (let i = 0; i < localStorage.length; i++) {
                                let idNum = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
                                if(localStorage.key(i) != idNum){
                                    return idNum;
                                } 
                            } 
                        }
                    }

                    let randomNumber = getRandomThreeDigitNumber();
                    console.log("main" , randomNumber)
                    localStorage.setItem(`${randomNumber}`, JSON.stringify(NewTask));

                }
                addDataToLocal()

                overlay.remove()
                window.location.reload();

            })

            // when press cancel button 
            cancelButton.addEventListener("click", function() {
                overlay.remove()
            })

        })
    }
    createTask()

    function completeTasks() {

        completeTasksInput.forEach(element => {

            element.addEventListener("click", function() {

                // add complete of false Attribute for .task
                element.parentElement.setAttribute("data-status" , `${element.checked ? 'complete' : 'false'}`)

                id = element.parentElement.parentElement.parentElement.getAttribute("data-id")
                
                let EditedTaskTitle = JSON.parse(localStorage.getItem(id))['title']
                let EditedTaskDate = JSON.parse(localStorage.getItem(id))['date']
                let allTasksData = []
                let tasksData = 0; 

                element.parentElement.parentElement.querySelectorAll(".task").forEach(element => {
                    let num = element.querySelector(".cont").firstChild.innerText;
                    let taskContent = element.querySelector(".cont").lastChild.innerText
                    let status = element.getAttribute("data-status")
                    let tasksData = {num: num , content: taskContent, "status": `${status}`}
                    allTasksData.push(tasksData);
                });

                let editedTask = {
                    title: `${EditedTaskTitle}`,
                    date: `${EditedTaskDate}`,
                    data: [allTasksData]
                }

                localStorage.setItem(`${id}`, JSON.stringify(editedTask));

                const elements = element.parentElement.parentElement.querySelectorAll(".task");

                checkIfAllTasksAreDone(elements)

            })

        });

    }
    completeTasks()

}
tasksMain()

function addSettingToTasksBox() {

    tasksCard = document.querySelectorAll("section main .tasks-container .task-card"),

    tasksCard.forEach(element => {

            // Create the container div with class 'trash'
        const trashDiv = document.createElement('div');
        trashDiv.className = 'trash';

        // Create the img element
        const imgElement = document.createElement('img');
        imgElement.src = 'assets/imgs/settings.png';
        imgElement.alt = 'settings';
        trashDiv.appendChild(imgElement);

        // Create the settingBox div
        const settingBoxDiv = document.createElement('div');
        settingBoxDiv.className = 'settingBox';

        // Create the first delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete All Task';

        // Create the deleteBox div
        const deleteBoxDiv = document.createElement('div');
        deleteBoxDiv.className = 'deleteBox';

        // Create the h4 element
        const h4Element = document.createElement('h4');
        h4Element.textContent = 'Are you sure?';
        deleteBoxDiv.appendChild(h4Element);

        // Create the boxesCont div
        const boxesContDiv = document.createElement('div');
        boxesContDiv.className = 'boxesCont';

        // Create the second delete button inside deleteBox
        const confirmDeleteButton = document.createElement('button');
        confirmDeleteButton.className = 'delete';
        confirmDeleteButton.textContent = 'Delete';

        // Create the no button
        const noButton = document.createElement('button');
        noButton.className = 'no';
        noButton.textContent = 'No';

        // Append buttons to boxesCont div
        boxesContDiv.appendChild(confirmDeleteButton);
        boxesContDiv.appendChild(noButton);

        // Append boxesCont div to deleteBox div
        deleteBoxDiv.appendChild(boxesContDiv);

        // Create the edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit';
        editButton.textContent = 'Edit';

        // Append elements to settingBox div
        settingBoxDiv.appendChild(deleteButton);
        settingBoxDiv.appendChild(deleteBoxDiv);
        settingBoxDiv.appendChild(editButton);

        // Append settingBox div to trash div
        trashDiv.appendChild(settingBoxDiv);

        // Append trash div to the body or any other container
        element.appendChild(trashDiv);
    });


    settingButton = document.querySelectorAll(".task-card .trash  img"),
    settingBox = document.querySelectorAll(".task-card .trash  .settingBox"),
    deleteButton = document.querySelectorAll(".task-card .trash  .settingBox .delete");

}
addSettingToTasksBox()

function tasksSetting(){
    settingButton.forEach(settingButton => {

        let didntDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .no"),
        confirmDelete = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .boxesCont .delete"),
        DeleteButton = settingButton.parentElement.querySelector(".task-card .trash  .settingBox .delete"),
        taskContainer = settingButton.parentElement.parentElement.querySelector(".container"),
        editButton = settingButton.parentElement.parentElement.querySelector(".trash  .settingBox .edit"),
        TaskCard = settingButton.parentElement.parentElement,
        TitleDiv = settingButton.parentElement.parentElement.querySelector(".title"),
        containerDiv = settingButton.parentElement.parentElement.querySelectorAll(".container .task"),
        dateDiv = settingButton.parentElement.parentElement.querySelector(".date "),
        deleteImg = settingButton.parentElement.parentElement.querySelector(".deleteImg");
        EditedTaskDate = null;
        
        settingButton.addEventListener("click", function(){
            settingButton.parentElement.classList.toggle('open');

            function deleteTask() {
                DeleteButton.addEventListener("click", function(){
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.toggle('open');
                })
    
                didntDelete.addEventListener("click", function(){
                    settingButton.parentElement.querySelector(".task-card .trash  .settingBox ").querySelector('.deleteBox').classList.remove('open')
                })
    
                confirmDelete.addEventListener("click", function(){
                    let elementId = settingButton.parentElement.parentElement.getAttribute('data-id')
                    setDeletedTaskToLocalStorage(elementId)
                    localStorage.removeItem(`${elementId}`)
                    settingButton.parentElement.parentElement.remove()
                    // console.log(settingButton.parentElement.parentElement)
                    // restoreDeletedTasks()
                    handleViewDeletedTask()
                })
            }
            deleteTask()

            // ######################## Edit Task ########################
            function editTask() {
                let elementId = settingButton.parentElement.parentElement.getAttribute('data-id');
                let editedTasks = settingButton.parentElement.parentElement;
                let cancelButton = null;

                editButton.addEventListener("click", function() {

                    if(settingButton.parentElement.parentElement.getAttribute("data-status") == 'complete'){
                        settingButton.parentElement.parentElement.classList.add("on-edit")
                    }

                    function editTaskHandle() {

                        settingButton.parentElement.classList.toggle('open');
                        editedTasks.style.opacity = "1"

                        let titleClass = TitleDiv.className;
                        let titleValue = TitleDiv.innerText;

                        let titleInput = document.createElement("input");
                        titleInput.classList.add(`${titleClass}`);
                        titleInput.value = titleValue;

                        let DoneButton = document.createElement("button");
                        DoneButton.classList.add('DoneButton');
                        DoneButton.innerText = "Save Edit";

                        cancelButton = document.createElement("button");
                        cancelButton.classList.add('cancel-button');
                        cancelButton.innerText = "Cancel";

                        let addTaskButton = document.createElement("button");
                        addTaskButton.classList.add('addTaskButton');
                        addTaskButton.innerText = "Add Task Button";

                        let buttonsDiv = document.createElement("div");
                        buttonsDiv.classList.add('buttons-div');

                        buttonsDiv.appendChild(cancelButton);
                        buttonsDiv.appendChild(DoneButton);

                        TaskCard.appendChild(buttonsDiv);
                        
                        TitleDiv.replaceWith(titleInput);
                        dateDiv.replaceWith(buttonsDiv);
                        TaskCard.insertBefore(addTaskButton , buttonsDiv)

                        function HandleTasksArrangeWhenDeleteOne() {
                            taskContainer.querySelectorAll(".task").forEach((element ,index)=> {
                                // let everyMessageValue =  element.querySelector(".cont").querySelector(".TaskData").value.slice(4)
                                element.querySelector(".cont").querySelector(".num").innerHTML = `${index + 1} -` 
                            });
                        }

                        let tasksNum = containerDiv.length;
                        addTaskButton.addEventListener("click", function() {
                            tasksNum ++ 

                            // Create the task div
                            const taskDiv = document.createElement('div');
                            taskDiv.className = 'task';
                            taskDiv.setAttribute("data-status" , 'false')

                            // Create the cont div
                            const contDiv = document.createElement('div');
                            contDiv.className = 'cont';

                            const TaskNum = document.createElement('div');
                            TaskNum.className = 'num';
                            TaskNum.innerText = `${tasksNum} - `

                            const TaskData = document.createElement('input');
                            TaskData.className = 'TaskData';
                            TaskData.placeholder = '...'

                            const deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png'
                            deleteImg = deleteTaskImg;

                            taskDiv.appendChild(contDiv)
                            taskDiv.appendChild(deleteTaskImg)
                            contDiv.appendChild(TaskNum)
                            contDiv.appendChild(TaskData)
                            
                            taskContainer.appendChild(taskDiv)

                            // ################## delete new added tasks ################
                            deleteTaskImg.addEventListener("click", function() {
                                deleteTaskImg.parentElement.remove();
                                tasksNum--
                                HandleTasksArrangeWhenDeleteOne()
                            })


                        })

                        containerDiv.forEach(element => {
                            let taskClass = element.querySelector(".cont").children[1].className;
                            let taskValue = element.querySelector(".cont").children[1].innerText;
                            let taskInput = document.createElement("input");
                            taskInput.classList.add(`${taskClass}`);
                            taskInput.value = taskValue;
                            element.querySelector(".cont").children[1].replaceWith(taskInput);

                            let deleteTaskImg = document.createElement('img');
                            deleteTaskImg.className = 'deleteImg';
                            deleteTaskImg.src = 'assets/imgs/close.png'
                            deleteImg = deleteTaskImg;

                            element.querySelector(".cont").parentElement.lastChild.replaceWith(deleteTaskImg)

                            // ################## delete current task ################
                            deleteTaskImg.addEventListener("click", function() {
                                element.querySelector(".cont").parentElement.remove();
                                tasksNum--
                                HandleTasksArrangeWhenDeleteOne()
                            })

                        });

                    }
                    editTaskHandle()

                    function SaveAddEditedTask() {
                        let DoneButtonB = settingButton.parentElement.parentElement.querySelector(".DoneButton");

                        DoneButtonB.addEventListener("click", function() {
                            let num = null;
                            let taskContent = null;
                            let status = null;
                            let tasksData = {}
                            let allTasksData = []
    
                            settingButton.parentElement.parentElement.querySelectorAll(".task").forEach((element , index) => {
                                num = `${index + 1} -`;
                                taskContent = element.querySelector(".cont").querySelector("input").value
                                status = element.getAttribute("data-status")
                                tasksData = {num: num , content: taskContent, "status": `${status}`}
                                allTasksData.push(tasksData);
                            });

                            let editedTask = {
                                title: `${editedTasks.querySelector(".title").value}`,
                                date: `${JSON.parse(localStorage.getItem(`${elementId}`))['date']}`,
                                data: [allTasksData]
                            }
                            localStorage.setItem(`${elementId}` , JSON.stringify(editedTask))
                            window.location.reload();
                        })
                    }
                    SaveAddEditedTask()

                    function cancelEdit() {
                        cancelButton.addEventListener("click", function() {
                            window.location.reload();
                        })
                    }
                    cancelEdit()

                })
            }
            editTask()
        })
    });
}
tasksSetting()

function setDeletedTaskToLocalStorage(id) {

        let now = new Date();
        let deleteTime = now.toLocaleString();
        let deletedTask = localStorage.getItem(id)
        let jsonData = JSON.parse(deletedTask)
        // let completeTime = JSON.parse(deletedTask)
        console.log(jsonData)
    
        const tasksList = {
            tasks: []
        };
    
        let deletedTaskData = {
            id: id,
            task: {jsonData},
            deleteTime: `${deleteTime}`
            // completeTime: `${deleteTime}`
        }
    
            if(localStorage.getItem('deletedTasks') != null) {
                // must use when third or above task delete
                for (let index = 0; index < JSON.parse(localStorage.getItem("deletedTasks")).tasks.length; index++) {
                    tasksList.tasks.push(JSON.parse(localStorage.getItem("deletedTasks")).tasks[index])
                }
                tasksList.tasks.push(deletedTaskData)
                localStorage.setItem("deletedTasks", JSON.stringify(tasksList))
            } else {
                tasksList.tasks.push(deletedTaskData)
                localStorage.setItem("deletedTasks", JSON.stringify(tasksList))
            }
} 

let isFunctionRunning = false;
function handleViewDeletedTask() {

    if (isFunctionRunning) {
        return
    };
    isFunctionRunning = true;

    if(localStorage.getItem("deletedTasks") != null){

        sliderDeleteHistoryButton.addEventListener("click", function() {

            if(window.innerWidth <= 600){
                    slider.classList.toggle("open")
            }

            let deletedTaskLength = JSON.parse(localStorage.getItem("deletedTasks")).tasks.length;
            deletedTaskMain.classList.toggle("open")

            if(deletedTaskMain.classList.contains('open')  && JSON.parse(localStorage.getItem("deletedTasks")).tasks != 0) {
                deletedTaskMain.querySelector(".deleted-tasks-container").innerHTML = ""
                for (let i = 0; i < deletedTaskLength; i++) {

                    let deleteTime = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].deleteTime,
                    taskModifiedDate = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.date,
                    taskCompleteDate = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.completeDate,
                    taskTitle = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.title,
                    taskId = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].id;
        
                    // Create the main task card div
                    const taskCardDiv = document.createElement('div');
                    taskCardDiv.className = 'task-card';
                    taskCardDiv.setAttribute('data-id', `${taskId}`);
        
                    // Create the title input
                    const title = document.createElement('div');
                    title.className = 'title';
                    title.innerText = taskTitle;
        
                    // Create the container div
                    const containerDiv = document.createElement('div');
                    containerDiv.className = 'container';
        
                    const modifiedDate = document.createElement('div');
                    modifiedDate.className = 'modified-date';
                    modifiedDate.innerText = `Modified date: ${taskModifiedDate}`;

                    const completeDate = document.createElement('div');
                    completeDate.className = 'complete-date';
                    completeDate.innerText = `complete date: ${taskCompleteDate}`;
        
                    const deletedDate = document.createElement('div');
                    deletedDate.className = 'deleted-date';
                    deletedDate.innerText = `Deleted date: ${deleteTime}`;
    
                    const restoreTaskButton = document.createElement('button');
                    restoreTaskButton.className = 'restore';
                    restoreTaskButton.innerText = 'Restore';
        
                    tasksDataLength = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.data[0].length;
                    for (let k = 0; k < tasksDataLength; k++) {
        
                        let taskNum = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.data[0][k].num,
                        taskContent = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.data[0][k].content,
                        taskStatus = JSON.parse(localStorage.getItem("deletedTasks")).tasks[i].task.jsonData.data[0][k].status;
        
                        const taskDiv = document.createElement('div');
                        taskDiv.className = 'task';
                        taskDiv.setAttribute('data-status', `${taskStatus}`);
        
                        // Create the cont div
                        const contDiv = document.createElement('div');
                        contDiv.className = 'cont';
        
                        // Create the num div
                        const TaskNum = document.createElement('div');
                        TaskNum.className = 'num';
                        TaskNum.innerText = `${taskNum} `;
        
                        // Create the TaskData div
                        const TaskData = document.createElement('div');
                        TaskData.className = 'TaskData';
                        TaskData.innerText = ` ${taskContent}`;
        
                        // Create the task-content input
                        const DoneMessage = document.createElement('h2');
                        DoneMessage.classList.add("DoneAlarm");
                        DoneMessage.innerText = "Done";
        
                        // Append numDiv and taskContentInput to contDiv
                        containerDiv.appendChild(taskDiv);
                        taskDiv.appendChild(contDiv);
                        contDiv.appendChild(TaskNum);
                        contDiv.appendChild(TaskData);
                        taskCardDiv.appendChild(DoneMessage)
                    }
        
                    taskCardDiv.appendChild(title);
                    taskCardDiv.appendChild(containerDiv);
                    taskCardDiv.appendChild(modifiedDate);
                    taskCardDiv.appendChild(completeDate);
                    taskCardDiv.appendChild(deletedDate);
                    taskCardDiv.appendChild(restoreTaskButton);
                    deletedTaskContainer.appendChild(taskCardDiv);

                }
            }
            // console.log("******************************************************************************")
            restoreDeletedTasks()
        })

    }

    deletedTaskExitButton.addEventListener("click", function() {
        deletedTaskMain.classList.toggle("open")
    })

}
handleViewDeletedTask()

function restoreDeletedTasks() {
    let deletedTasks = document.querySelectorAll("section main .deleted-task-main .restore");

    deletedTasks.forEach(element => {
        element.addEventListener("click", function() {

            taskToRemove = element.parentElement.getAttribute("data-id")
            
            let originDeletedTasks = JSON.parse(localStorage.getItem("deletedTasks")),
            allDeletedTasks = JSON.parse(localStorage.getItem("deletedTasks")).tasks;
            
            let filteredData = allDeletedTasks.filter(task => task.id != taskToRemove);
            
            let restoredTask = allDeletedTasks.find(item => item.id === taskToRemove).task.jsonData

            localStorage.setItem(`${taskToRemove}`, JSON.stringify(restoredTask))
            
            originDeletedTasks.tasks = filteredData
            localStorage.setItem("deletedTasks", JSON.stringify(originDeletedTasks))
            element.parentElement.remove();
            addTasksFromLocal()
            addSettingToTasksBox()
            tasksSetting()
            // handleViewDeletedTask()
        })
    });

}
restoreDeletedTasks()

function clearTasks() {

    deleteTaskButton.addEventListener("click", function(){

        let overlay = document.createElement("div")
        overlay.className = "overlay"
        
        let alertBox = document.createElement("div")
        alertBox.className = "alertBox"

        let mainBox = document.createElement("div")
        mainBox.className = "mainBox"

        let h1 = document.createElement("h1")
        h1.className = "text"
        h1.innerHTML = "Are you sure?"

        let buttonsBox = document.createElement("div")
        buttonsBox.className = "buttonsBox"

        let confirmButton = document.createElement("button")
        confirmButton.className = "confirmButton"
        confirmButton.innerHTML = "Yes"

        let noButton = document.createElement("button")
        noButton.className = "noButton"
        noButton.innerHTML = "no"

        section.appendChild(overlay)
        overlay.appendChild(alertBox)
        alertBox.appendChild(mainBox)
        mainBox.appendChild(h1)
        mainBox.appendChild(buttonsBox)
        buttonsBox.appendChild(noButton)
        buttonsBox.appendChild(confirmButton)

        noButton.addEventListener("click", function() {
            overlay.remove()
        })
    
        confirmButton.addEventListener("click", function() {
            let allTasks = section.querySelector(".tasks-container").querySelectorAll(".task-card")
            allTasks.forEach(element => {
                let everyTaskId =  element.getAttribute("data-id");
                setDeletedTaskToLocalStorage(everyTaskId)
                localStorage.removeItem(`${everyTaskId}`)
            });

            section.querySelector(".tasks-container").innerHTML = ""
            overlay.remove()
        })
    })

}
clearTasks()
