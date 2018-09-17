// The following code will send an MMS message (with image) to ONE number
// accountSid and authToken taken from account 'bbubble0920@gmail.com' and are stored in environment variables

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const sendNumber = process.env.TWILIO_SEND_NUMBER
const client = require('twilio')(accountSid, authToken)

// This is a placeholder for the designer's tel number
var phoneNumber = '4164003500'
var targetNumber = '+1' + phoneNumber

// Replace <http link> with login link
const messageBody = '*** WearItWell Update ***\n\nHello Designer Jane!\nSomeone just up-voted <designTitle>!\nYou have <numberLikes> likes for this design.\n\nPlease log-in here: <insert url> to manage your listings.\n';
const imageUrl = 'https://bbubble0920.github.io/project-2/public/images/wearitwell.png'
    
// Function to send a text message to designer
function sendMessage(phoneNumber) {
  client.messages
    .create({
      body: messageBody, 
      mediaUrl: imageUrl,
      from: sendNumber,
      to: targetNumber
    })
    .then(message => console.log(message.sid))
    .done();
    }

sendMessage(phoneNumber);

