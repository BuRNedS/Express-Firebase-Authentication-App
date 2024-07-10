const express = require("express");
const path = require("path");
const app = express();
const firebase = require("./firebase"); // Renamed and updated

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

// Route handlers
app.get('/', (req, res) => {
    res.render('signup');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        message: req.body.message
    };

    try {
        const checking = await firebase.findUserByName(req.body.name);
        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("User details already exist");
        } else {
            await firebase.createUser(data);
            res.status(201).render("signup", { success: true });
        }
    } catch (e) {
        res.send("Wrong inputs");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await firebase.findUserByName(req.body.name);
        if (check && check.password === req.body.password) {
            res.status(201).render("login", { success: { name: req.body.name } });
        } else {
            res.send("Incorrect password");
        }
    } catch (e) {
        res.send("Wrong details");
    }
});

app.listen(port, () => {
    console.log('port connected');
});
