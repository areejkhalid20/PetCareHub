const express = require('express');
const app = express();
const path = require('path');
const PORT =  3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/index'));

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
