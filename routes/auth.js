const express = require('express');
const router = express.Router();

//using dummy user since database isnt allowed 
const dummyUser = {
  email: "random@example.com",
  password: "ILoveProgramming" 
};

router.post('/sign_in', (req, res) => {
  const { email, password } = req.body;
  
  if (email === dummyUser.email && password === dummyUser.password)
   {
    res.json({ success: true, message: "Login successful!" }); //respond with sucees message to user
   }
   else 
   {
    res.status(401).json({ success: false, message: "Incorrect email or password." }); //else display an error message
   }
});

router.post('/sign_up', (req, res) => {
  
  const { email, password } = req.body;
  res.json({ success: true, message: "Sign-up successful!." }); //respond with sucees message to user

});

module.exports = router;
