const validateStringOnChange = (value, name, min, max) => {
    let message = "";
    if(value.trim() == ""){
        message = `${name} required`;
    }else if(!value.trim().match(/^[A-Za-z\s]+$/)){
        message = `${name} should contain english characters(s)`;
    }else if(value.length < min || value.length > max) {
        message = `${name} must be between ${min} and ${max}`;
    }else {
        message = ""
    }
    return message;
}

const validateNumericOnChange = (value, name, min, max) => {
    let message;
    if(value.trim() == "") {
        message = `${name} required`;
    }else if(!value.trim().match(/^[0-9]+$/)) {
        message = `${name} must be numeric value only`;
    }else if(value.length < min) {
        message = `${name} must be ${min} number(s)`
    }else if(value.length > min) {
        message = `${name} must not exceed ${min} number(s)`
    }else {
        message = ""
    }
    return message;
}