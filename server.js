const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
