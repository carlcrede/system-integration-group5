export function validateEmail(value: string) {
    let error
    if (!value) {
      error = 'Email is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Email is invalid"
    }
    return error
}

export function validatePassword(value: string) {
    let error
    if (!value) {
        error = 'Password is required'
    } else if (value.length < 6) {
        error = 'Password must be at least 6 characters long'
    }
    return error
}

export function validateName(value: string) {
    let error
    if (!value) {
        error = 'Name is required'
    } else if (value.length < 3) {
        error = 'Each name must be at least 3 characters long'
    }
    return error
}