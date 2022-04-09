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

for(let i=1; i<=12; i++) {
    if(i < 10) {
        monthInput.innerHTML += `<option value=0${i}>0${i}</option>`
    }else {
        monthInput.innerHTML += `<option value=${i}>${i}</option>`
    }
}

for(let i= new Date().getFullYear(); i<= 2033; i++) {
    yearInput.innerHTML += `<option value=${i.toString().slice(2)}>${i}</option>`
}

cardHolderValidation.innerHTML = " ";
cardNumberValidation.innerHTML = " ";
cvcValidation.innerHTML = " ";

const removeDisabledBtn = ()=> {
    if(cardHolderValidation.innerHTML != "" ||
        cardNumberValidation.innerHTML != "" ||
        monthInput.value == "Choose Month" ||
        yearInput.value == "Choose Year" ||
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


cvcInput.addEventListener('keyup', (e) => {
    cvcValidation.innerHTML = validateNumericOnChange(e.target.value, "CVC", 3);
    removeDisabledBtn()
})




