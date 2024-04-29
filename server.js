const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static('public'));

// POST route for handling newsletter subscriptions
app.post('/subscribe', (req, res) => {
    const email = req.body.email;

    // Simple email validation
    if (!email || !email.includes('@')) {
        res.status(400).send('Invalid email address.');
        return;
    }

    // Here you would typically add the email to a database or an email list
    console.log(`Subscription request received for email: ${email}`);

    // Respond to the client
    res.send('Thank you for subscribing to our newsletter!');
});

// Other routes can go here

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
