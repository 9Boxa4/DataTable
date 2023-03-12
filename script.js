import employeeData from './data/employeeData.json' assert{type : 'json'};
import task from './data/taskData.json' assert{type : 'json'};


//had problems with bundlers so I imported the function only
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  

const userDataTable= document.getElementById("tbodyUser");
const submitUserFormBtn= document.getElementById("submitUserFormBtn");

//Input fields
const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const dateOfBirthInput = document.getElementById("dateOfBirthInput");
const monthlySalaryInput = document.getElementById("monthlySalaryInput");

onInit();

//Attach events
submitUserFormBtn.addEventListener("click",function(){
    let newUserObj = {};
  
    if(isInputFilled(fullNameInput.value) 
    && isInputFilled(emailInput.value) 
    && isInputFilled(phoneNumberInput.value) 
    && isInputFilled(dateOfBirthInput.value) 
    && isInputFilled(monthlySalaryInput.value)){
        if(isValidFullName(fullNameInput.value)){
            newUserObj.fullName = fullNameInput.value;
            if(isValidEmail(emailInput.value)){
                newUserObj.email= emailInput.value;
                if(isValidPhoneNumber(phoneNumberInput.value)){
                    newUserObj.phoneNumber = phoneNumberInput.value;
                    if(isValidDateOfBirth(new Date(dateOfBirthInput.value))){
                        newUserObj.dateOfBirth = new Date(dateOfBirthInput.value);
                        if(isValidMonthlySalary(monthlySalaryInput.value)){
                            newUserObj.monthlySalary = monthlySalaryInput.value
                            newUserObj.id = uuidv4();
                            console.log(newUserObj);
                            createEmployee(newUserObj)
                            this.setAttribute("data-dismiss","modal");
                        }
                    }
                }
            } 
        }
        console.log(isInputFilled('fields are filled'));
    }
    else{
        alert("you must fill out all the fields to proceed")
    }

})


userDataTable.addEventListener("click",(event)=>{
    if(confirm("Are you sure you want to delete this user?")){
        if(event.target.classList.contains("fa-trash-can")){
            const idOfTheUserRow = event.target.parentElement.parentElement.id;
            employeeData.employee = employeeData.employee.filter(data => data.id !== idOfTheUserRow);
            createTableRows(employeeData.employee)
        }
    }
});

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



function isValidEmail(value){
    const atLocation = value.lastIndexOf("@");
    const dotLocation = value.lastIndexOf("."); 
    if( (atLocation > 0 )
    &&  (dotLocation > atLocation + 1 )
    &&   (dotLocation < value.length - 1)){
                return true
             }else{
                alert("email needs '@' and a '.'");
                return false
             }
}

function isValidPhoneNumber(value){
        if(value[0] === "+"){
            return true
        }else{
            alert("please add prefix '+' to your area code number");
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
    if(value >= 300){
        return true
    }else{
        alert("Monthly salary cannot be under 300");
        return false;
    }
}


function isInputFilled(inputValue){
    return(
        inputValue.trim().length > 0
    )
}

// function clearInputFields(){

// }


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
        createTableRows(employeeData.employee)
}


function createTableRows(dataCollection){
    userDataTable.innerHTML = "";
    dataCollection.forEach(data => {
    
        const fullNameColumn = document.createElement("td");
        const emailColumn = document.createElement("td");
        const phoneNumberColumn = document.createElement("td");
        const dateOfBirthColumn = document.createElement("td");
        const monthlySalaryColumn = document.createElement("td");
        const btnOptionsColumn = document.createElement("td");

        fullNameColumn.textContent = data.fullName;
        emailColumn.textContent= data.email;
        phoneNumberColumn.textContent = data.phoneNumber;
        dateOfBirthColumn.textContent = data.dateOfBirth;
        monthlySalaryColumn.textContent = data.monthlySalary;
        btnOptionsColumn.innerHTML= `<i class="fa-regular fa-trash-can btn btn-danger" title="delete user"></i> <i class="fa-regular fa-pen-to-square btn btn-primary" title="edit user"></i>`
        btnOptionsColumn.classList.add("d-md-flex","justify-content-around")

        let tableRow = document.createElement("tr");
        tableRow.setAttribute("id",data.id);
        tableRow.append(fullNameColumn,emailColumn,phoneNumberColumn,dateOfBirthColumn,monthlySalaryColumn,btnOptionsColumn)
        userDataTable.appendChild(tableRow);

});
}


function onInit(){
    createTableRows(employeeData.employee);
}



