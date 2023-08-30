export const isEmpty = value => {
    if(!value) return true
    return false
}

export const isEmail = email => {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export const isLength = password => {
    if(password.length < 8) return true
    return false
}

export const isUsernameLength = password => {
    if(password.length < 4 && password.length < 16) return true
    return false
}


export const isMatch = (password, cf_password) => {
    if(password === cf_password) return true
    return false
}

//get if string contain characters alphanumeric else underscore



export const isAlphaNumeric = value => {
    if(value.match(/^[a-zA-Z0-9]+$/)) return true
    return false
}

//Obtener si la string contiene caracter especiales excepto guión bajo
export const isSpecial = value => {
    if(value.match(/^[a-zA-Z0-9_]+$/)) return true
    return false
}

