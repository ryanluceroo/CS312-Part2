const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // Add Axios
const app = express();

let posts = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Route to show all posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Route to show form to create a post
app.get('/create', (req, res) => {
    res.render('create');
});

// Route to handle post creation
app.post('/create', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        date: new Date().toLocaleString()
    };
    posts.push(newPost);
    res.redirect('/');
});

// Route to show form to edit a post
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    res.render('edit', { post });
});

// Route to handle post editing
app.post('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect('/');
});

// Route to handle post deletion
app.get('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect('/');
});

// Route to show the joke form
app.get('/joke', (req, res) => {
    res.render('jokeForm');
});

// Route to handle joke fetching
app.post('/joke', async (req, res) => {
    const name = req.body.name;
    // Fetch a random joke using safe mode and blacklist flags to filter inappropriate content
    const url = `https://v2.jokeapi.dev/joke/Any?safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`;

    try {
        const response = await axios.get(url);
        let joke;

        // Check if it's a single joke or a two-part joke
        if (response.data.type === 'single') {
            joke = `${response.data.joke} - Joke for you, ${name}!`; // For single jokes
        } else if (response.data.type === 'twopart') {
            joke = `${response.data.setup} - ${response.data.delivery} - Joke for you, ${name}!`; // For two-part jokes
        } else {
            joke = `Sorry, no jokes found! - But still, ${name}, you're awesome!`; // Fallback message
        }

        res.render('joke', { name, joke });
    } catch (error) {
        res.render('joke', { name, joke: 'Sorry, no jokes found!' });
    }
});

// Listening on port 4000
app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
