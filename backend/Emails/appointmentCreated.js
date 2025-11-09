module.exports.appointmentCreated = (username, email) => ({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: "Appointment Created - MediTrust",
  html: `<h1>Hello ${username},</h1>
          <img src="cid:MediTrustimg" alt="mediTrust Image"  style="width:100%; height:300px; object-fit:cover;"/>
            <p>Your appointment has been successfully created.</p>
            <p>Thank you for choosing MediTrust for your healthcare needs. We look forward to serving you!</p>
          <br/>
          <p><b>Note:</b> This is an automated email, please do not reply.</p>
          <p><b>Disclaimer: This is developed for Round One-Interview process.</b></p>`,
  attachments: [
    {
      filename: "MediTrust.png",
      path: __dirname + "/../Image/MediTrust.png",
      cid: "MediTrustimg",
    },
  ],
});
