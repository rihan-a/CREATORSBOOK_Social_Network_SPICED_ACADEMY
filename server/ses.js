require("dotenv").config();
const {
    SES
} = require("@aws-sdk/client-ses");

const { AWS_KEY, AWS_SECRET, AWS_REGION } = process.env;

const ses = new SES({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    region: AWS_REGION,
});

async function sendCodeEmail(name, code) {
    console.log("sending email with code");
    try {
        await ses.sendEmail({
            Source: 'creatorsbook <info@creatorsbook.com>',
            Destination: {
                ToAddresses: ['a.rihan@live.com']
            },
            Message: {
                Body: {
                    Text: {
                        Data: `
                    Hey ${name},

                    You requested a link to reset your password for CREATORSBOOK. Use the code below to login and set a new password.

                    Your one-time code is: ${code}.

                    Please verify you're really you by entering this 6-digit code when you sign in. Just a heads up, this code will expire in 10 minutes for security reasons.
                    
                    Your password won't change until you access the link above and create a new one.

                    If you didn't request this, please ignore this email.

                    — CREATORSBOOK Team`
                    }
                },
                Subject: {
                    Data: "CREATORSBOOK - PASSWORD RESET!"
                }
            }
        });
        console.log('it worked!');
        return "success";
    } catch (err) {
        console.log(err);
        return "failed";
    }

}


module.exports = { sendCodeEmail };