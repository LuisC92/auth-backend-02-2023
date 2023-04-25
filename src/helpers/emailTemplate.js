
const passwordReset = (email, newPassword)=>{
    return`
        Hello ${email}
    
        A new password has been requested by this email:
        ${email}

        This is your temporary password: ${newPassword}

        For security reasons, please change your temporary password after logging in.

        Thanks!
        Test APP TEAM
    `
}

module.exports = {
    passwordReset
}