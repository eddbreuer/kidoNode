const nodemailer = require('nodemailer');
const config = require('../config');

module.exports = {

  sendconf: function(user, jwtToken){

     const confLink = config.ks_url+'confirm/'+jwtToken;

   // create reusable transporter object using the default SMTP transport
       let transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
               user: "eddbreuer@gmail.com",
               pass: "Alokin1970!"
           }
       });

       // setup email data with unicode symbols
        let mailOptions = {
            from: '"Kido Sitter" <fkiddositter@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Email confirmation', // Subject line
            text: 'Go to '+config.ks_url+jwtToken+' to confirm your email!', // plain text body
            html:'<h3>Welcome to Kidositters</h3>'+
            '<b>Go to <a href='+confLink+'>'+confLink+'</a> to confirm your email!</b>' // html body
        };

        // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

}
