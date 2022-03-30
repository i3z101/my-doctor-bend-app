const cardHolderNameInput = document.getElementById("cardHolderName");
const cardHolderValidation = document.getElementById("nameValidation");
const cardNumberInput = document.getElementById("cardNumber");
const cardNumberValidation = document.getElementById("numValidation");
const monthInput = document.getElementById("month");
const monthValidation = document.getElementById("monthValidation");
const yearInput = document.getElementById("year");
const yearValidation = document.getElementById("yearValidation");
const cvcInput = document.getElementById("cvc");
const cvcValidation = document.getElementById("cvcValidation");
const payButton = document.getElementById("pay_button");

cardHolderValidation.innerHTML = " ";
cardNumberValidation.innerHTML = " ";
monthValidation.innerHTML = " ";
yearValidation.innerHTML = " ";
cvcValidation.innerHTML = " ";

const removeDisabledBtn = ()=> {
    if(cardHolderValidation.innerHTML != "" ||
        cardNumberValidation.innerHTML != "" ||
        monthValidation.innerHTML != "" ||
        yearValidation.innerHTML != "" ||
        cvcValidation.innerHTML != ""      
    ) {
        payButton.setAttribute("disabled", true);
        payButton.style.backgroundColor = '#ccc';
    }else {
        payButton.removeAttribute("disabled");
        payButton.style.backgroundColor = 'white';
    }
}

removeDisabledBtn();



cardHolderNameInput.addEventListener('keyup', (e) => {
    cardHolderValidation.innerHTML = validateStringOnChange(e.target.value, "Cardhlder's Name", 2, 100);
    removeDisabledBtn()
})

cardNumberInput.addEventListener('keyup', (e) => {
    cardNumberValidation.innerHTML = validateNumericOnChange(e.target.value, "Card Number", 16);
    removeDisabledBtn()
})

monthInput.addEventListener('keyup', (e) => {
    monthValidation.innerHTML = validateNumericOnChange(e.target.value, "Expiration Month", 2);
    removeDisabledBtn()
})

yearInput.addEventListener('keyup', (e) => {
    yearValidation.innerHTML = validateNumericOnChange(e.target.value, "Expiration Year", 2);
    removeDisabledBtn()
})

cvcInput.addEventListener('keyup', (e) => {
    cvcValidation.innerHTML = validateNumericOnChange(e.target.value, "CVC", 3);
    removeDisabledBtn()
})




