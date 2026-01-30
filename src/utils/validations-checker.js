/**
 * @param {'text'|'email'|'phone'|'password'|'dob'} type
 * @param {string} typeValue
 * @returns {boolean}
 */
export default function validationChecker(type, typeValue) {
    const value = String(typeValue ?? '').trim();

    switch (type) {
        case 'text':
            return /^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/.test(value);

        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());

        case 'phone':
            return /^\d{10}$/.test(value);

        case 'password':
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

        case 'dob': {
            const dob = new Date(value);
            if (isNaN(dob.getTime())) return false;

            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();

            const monthDiff = today.getMonth() - dob.getMonth();
            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < dob.getDate())
            ) {
                age--;
            }

            return age >= 18;
        }

        default:
            return false;
    }
}
