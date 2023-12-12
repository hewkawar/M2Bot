function isValidPuaEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return false;
    }

    const domain = email.split('@')[1];
    return domain === 'pua.ac.th';
}

module.exports = {
    tools: {
        email: isValidPuaEmail
    }
}