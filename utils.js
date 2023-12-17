function isPuaEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return false;
    }

    const domain = email.split('@')[1];
    return domain === 'pua.ac.th';
}

function isEmailValid(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(email);
  }

module.exports = {
    tools: {
        email: isEmailValid,
        puaEmail: isPuaEmail
    }
}