function calculateAge(birthDate) {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) return null;

    if (birth > today) return null;

    const maxAge = 120;
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    if (age > maxAge) return null;
    return age;
}

module.exports = { calculateAge };
