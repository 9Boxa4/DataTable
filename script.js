import employeeData from './data/employeeData.json' assert{type : 'json'};
import task from './data/taskData.json' assert{type : 'json'};


//had problems with bundlers so I imported the function only
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  
//Initial variable declaration
    let editingEmployee = false;
    const employeecolumnNames = Object.keys(employeeData.employee[0]).filter(columnName=> columnName !== "id")
    let selectedEmployeeId;

// DOM element selectors
const userDataTable= document.getElementById("tbodyUser");
const submitUserFormBtn= document.getElementById("submitUserFormBtn");
const addEmployeeBtn = document.getElementById("addEmployeeBtn")

//Input fields
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const dateOfBirthInput = document.getElementById("dateOfBirthInput");
const monthlySalaryInput = document.getElementById("monthlySalaryInput");

onInit();

//Attach events
submitUserFormBtn.addEventListener("click",function(){
    if(editingEmployee){
        const employeeIndex = employeeData.employee.findIndex(element => element.id === selectedEmployeeId);
        updateEmployee(employeeIndex);
        this.setAttribute("data-dismiss","modal")
    }else{
        let newUserObj = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phoneNumber: phoneNumberInput.value,
            dateOfBirth: new Date(dateOfBirthInput.value),
            monthlySalary: monthlySalaryInput.value,
            id: uuidv4(),
        };
        this.removeAttribute("data-dismiss");
      
        if(isInputFilled(newUserObj.fullName,newUserObj.email,newUserObj.phoneNumber,newUserObj.dateOfBirth,newUserObj.monthlySalary))
        {
            if(
                isValidFullName(newUserObj.fullName) &&
                isValidEmail(newUserObj.email) &&
                isValidPhoneNumber(newUserObj.phoneNumber) &&
                isValidDateOfBirth(newUserObj.dateOfBirth) &&
                isValidMonthlySalary(newUserObj.monthlySalary)
            ){
                    createEmployee(newUserObj);
                    this.setAttribute("data-dismiss","modal");        
                } 
        } 
    }
    
})


addEmployeeBtn.addEventListener("click",function(){
    editingEmployee = false;
})

userDataTable.addEventListener("click",handleUsers);


// END OF EVENT LISTENERS //

function handleUsers(event){
    if(event.target.classList.contains("fa-trash-can")){
        if(confirm("Are you sure you want to delete this user?")){
        const employeeRowId = event.target.parentElement.parentElement.id;
        employeeData.employee = employeeData.employee.filter(data => data.id !== employeeRowId);
        createTableRows(employeeData.employee,employeecolumnNames)
    }}

    if(event.target.classList.contains("fa-pen-to-square")){
        const editBtn = event.target
        if(confirm("Are you sure you want to edit this user?")){
            editingEmployee = true;
            editBtn.setAttribute("data-toggle","modal")
            const employeeRowId = editBtn.parentElement.parentElement.id;
            selectedEmployeeId = employeeRowId;
            fillEmployeeForm(employeeRowId)
            // updateEmployee(employeeRowId)
        }else{
            editBtn.removeAttribute("data-toggle")
        }
    }
}
function isValidFullName(value){
    const string = value.trim();
    const spacesCount = string.split(' ').length - 1;
    if(spacesCount === 1){
        return true
    }else{
        alert("Full name must only containen first and last name with space between");
        return false;
    }
}



function isValidEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email)){
            return true
        }else{
                alert("email needs '@' and a '.'");
                return false
             }
}

function isValidPhoneNumber(phone){
        const regex = /^[\+\d]*\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})$/;
        if(regex.test(phone) && phone.length < 15){
            return true
        }else{
            alert("The phone number can contain sufix '+' and more than 9 numbers");
            return false;
        }      
}

function isValidDateOfBirth(value){
   const validYear = value.getFullYear();
   if(validYear > 1920 || validYear < 2008){
    return true
   }else{
    alert("date is not valid needs to be between 1920 and 2008");
    return false;
   }
}

function isValidMonthlySalary(value){
    if(value >= 300 && value.length < 5){
        return true
    }else{
        alert("Monthly salary cannot be under 300 and must be less than 5 digits");
        return false;
    }
}


function isInputFilled(...inputValues){
    if(inputValues.every(input=> input.toString().trim().length > 0)){
        return true
    }else{
        alert("you must fill out all the fields to proceed");
        return false
    }
 
}

function clearInputFields(...inputs) {
    inputs.forEach(input => input.value = "");
  }


function createEmployee(newUser){
    //due to the same name with arguments,and key values we can only set one of them
    if(newUser.fullName && newUser.email && newUser.phoneNumber && newUser.dateOfBirth && newUser.monthlySalary && newUser.id){

        //changing Formats of the Dates
        const userBirthYear = newUser.dateOfBirth.getFullYear()
        const userBirthMonth = (newUser.dateOfBirth.getMonth()+1).toString();
        const userBirthDay = newUser.dateOfBirth.getDate().toString();

        //formating fullDate to send and print
        const newDateOfBirthFormat = `${userBirthYear}/${userBirthMonth.padStart(2,"0")}/${userBirthDay.padStart(2,"0")}`
        const obj={
            id:newUser.id,
            fullName:newUser.fullName,
            email:newUser.email,
            phoneNumber:newUser.phoneNumber,
            dateOfBirth:newDateOfBirthFormat,
            monthlySalary:newUser.monthlySalary
         }
         employeeData.employee.push(obj);
        }
        createTableRows(employeeData.employee,employeecolumnNames);
        clearInputFields(fullNameInput, emailInput, phoneNumberInput, dateOfBirthInput, monthlySalaryInput);
}



function createTableRows(dataCollection,columnNames){
    userDataTable.innerHTML = "";
    console.log(employeeData.employee);
    dataCollection.forEach(data => {
    
        const tableRow = document.createElement("tr");
        tableRow.setAttribute("id",data.id);

        columnNames.forEach(columnName => {
            const column = document.createElement("td");
            column.textContent = data[columnName];
            tableRow.appendChild(column);
        });

        const btnOptionsColumn = document.createElement("td");
        btnOptionsColumn.innerHTML = `<i class="fa-regular fa-trash-can btn btn-danger" title="delete user"></i> <i class="fa-regular fa-pen-to-square btn btn-primary" title="edit user"  data-target="#employeeModifyModal" data-toggle="modal"></i>`;
        btnOptionsColumn.classList.add("d-md-flex","justify-content-around");

        tableRow.appendChild(btnOptionsColumn);
        userDataTable.appendChild(tableRow);

    });
}

function fillEmployeeForm(employeeId){
    const selectedEmployee = employeeData.employee.find(element=> element.id === employeeId);
    const employeeIndex = employeeData.employee.findIndex(element => element.id === employeeId);

    //Get formatedBirthDate
    const formatedBirthDate = new Date (selectedEmployee.dateOfBirth).toISOString().substring(0, 10)

    //filled input fields
    fullNameInput.value = selectedEmployee.fullName;
    emailInput.value = selectedEmployee.email;
    phoneNumberInput.value = selectedEmployee.phoneNumber;
    dateOfBirthInput.value = formatedBirthDate
    monthlySalaryInput.value = selectedEmployee.monthlySalary;
}


function updateEmployee(employeeIndex){
    if(isInputFilled(fullNameInput.value,emailInput.value,phoneNumberInput.value,dateOfBirthInput.value,monthlySalaryInput.value)){
        if(
            isValidFullName(fullNameInput.value) &&
            isValidEmail(emailInput.value) &&
            isValidPhoneNumber(phoneNumberInput.value) &&
            isValidDateOfBirth(new Date(dateOfBirthInput.value)) &&
            isValidMonthlySalary(monthlySalaryInput.value)
        )
        {
            const updatedEmployee = {
                fullName: fullNameInput.value,
                email: emailInput.value,
                phoneNumber: phoneNumberInput.value,
                dateOfBirth: dateOfBirthInput.value,
                monthlySalary: monthlySalaryInput.value,
                id: employeeData.employee[employeeIndex].id, // keep the same id
              };
                   employeeData.employee[employeeIndex] = updatedEmployee;
                createTableRows(employeeData.employee,employeecolumnNames)
                clearInputFields(fullNameInput, emailInput, phoneNumberInput, dateOfBirthInput, monthlySalaryInput);
            } 
    }
}

function onInit(){
    createTableRows(employeeData.employee,employeecolumnNames);
}
