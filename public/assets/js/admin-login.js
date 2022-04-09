const loginBtn = document.getElementById("loginBtn");
const adminName = document.getElementById("adminName");
const adminNameValidation = document.getElementById("adminNameValidation");
const adminPassword = document.getElementById("adminPassword");
const adminPasswordValidation = document.getElementById("adminPasswordValidation");


adminNameValidation.innerHTML = " "
adminPasswordValidation.innerHTML = " "

const removeDisabledBtn = ()=> {
    if(adminNameValidation.innerHTML != "" ||
        adminPasswordValidation.innerHTML != ""     
    ) {
        loginBtn.setAttribute("disabled", true);
    }else {
        loginBtn.removeAttribute("disabled");
    }
}

removeDisabledBtn()



adminName.addEventListener('keyup', (e) => {
    adminNameValidation.innerHTML = validateStringOnChange(e.target.value, "Admin Name", 3, 100);
    removeDisabledBtn()
})

adminPassword.addEventListener('keyup', (e) => {
    adminPasswordValidation.innerHTML = validatePasswordOnChange(e.target.value, "Admin Password", 6, 15);
    removeDisabledBtn()
})

