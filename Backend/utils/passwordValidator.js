/**
 * Validates a password against strict security rules.
 * 
 * Rules:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - No personal info (first name, last name, phone number, email username)
 * - Not a common password
 * 
 * @param {string} password - The password to validate
 * @param {object} userDetails - Object containing firstName, lastName, email, phone (optional)
 * @returns {object} - { isValid: boolean, message: string }
 */
export function validatePassword(password, userDetails = {}) {
    // 1. Check length
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }

    // 2. Uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }

    // 3. Lowercase letter
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one lowercase letter." };
    }

    // 4. Number
    if (!/\d/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }

    // 5. Special character
    // Using a broad set of special characters
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one special character." };
    }

    // 6. No personal info
    const { firstName, lastName, email, phone } = userDetails;
    const lowerPassword = password.toLowerCase();

    if (firstName && lowerPassword.includes(firstName.toLowerCase())) {
        return { isValid: false, message: "Password cannot contain your first name." };
    }
    if (lastName && lowerPassword.includes(lastName.toLowerCase())) {
        return { isValid: false, message: "Password cannot contain your last name." };
    }
    if (email) {
        const emailUser = email.split('@')[0].toLowerCase();
        if (lowerPassword.includes(emailUser)) {
            return { isValid: false, message: "Password cannot contain your email username." };
        }
    }
    if (phone && lowerPassword.includes(phone)) {
        return { isValid: false, message: "Password cannot contain your phone number." };
    }

    // 7. Common passwords blacklist (simplified list)
    const commonPasswords = [
        "password", "12345678", "password123", "admin123", "secret", "qwertyuiop"
    ];
    if (commonPasswords.some(cp => lowerPassword === cp)) {
        return { isValid: false, message: "Password is too common. Please choose a more unique password." };
    }

    return { isValid: true, message: "Password is valid." };
}
