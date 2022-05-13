const usernameRegex = new RegExp("^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$")
const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
const nameRegex = new RegExp("([a-zA-Z]{3,30}\s*)+")

export function validateUsername(username) {
    return usernameRegex.test(username)
}

export function validatePassword(password) {
    return passwordRegex.test(password)
}

export function validateName(name) {
    return nameRegex.test(name)
}