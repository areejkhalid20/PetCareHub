const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const path = require('path');

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));

//database connection
mongoose.connect('mongodb://localhost:27017/petCareHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', () => console.log('error occur'));
db.once('open', () => console.log('Connected to MongoDB'));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));  


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
