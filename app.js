/* 
Skapat av Amanda Hwatz Björkholm 
Proejktarbete - DT162G - blogg
https://whispering-everglades-05958.herokuapp.com/
*/

// MongoDb
// Lösen: nichof-6vewpo-sixbaW
// Anv: Admin

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/bloggDB', { useNewUrlParser: true });

// Koppla upp till databas på Mlab
mongoose.connect("mongodb+srv://admin:nichof-6vewpo-sixbaW@cluster0.1oheg.mongodb.net/bloggDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected!"));


// Sätter att inkommande data är json-objekt
app.use(express.json());
const port = process.env.PORT;
//const port = 3000;
app.use(express.static(__dirname + '/posts'));
app.listen(port, () => console.log(`Server started`));

// Sätt headers
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now}
});

// Model
const Post = mongoose.model('posts', postSchema);

// GET inlägg
app.get('/posts', async (req, res) => {
    try {
        // Hämta alla inlägg
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err){
        res.status(500).json({message: err.message});
    }
});

// GET med ID
app.get("/posts/:id", async (req, res) => {
    let id = req.params.id;
  
    try {
        // Hämta kurs med specifikt _id
        res.json(await Post.findById(id));
    } catch {
        res.json({message: "Couldn't find post"});
    }
});

// DELETE
app.delete("/posts/:id", async (req, res) => {
    let id = req.params.id;

    try {
        // Ta bort kurs med visst _id
        await Post.findByIdAndDelete(id);
        res.json({message: "Post deleted"});
    } catch {
        res.json({message: "Couldn't find post"});
    }
});

// POST
app.post("/posts", (req, res) => {
    try {
        // Sätt inskickad data till model och spara till databasen
        let newPost = new Post(req.body);
        newPost.save();
        res.json({message: "Post added"});
    } catch {
        res.json({message: "Couldn't add post"})
    }
});

// PUT
app.put("/posts/:id", async (req, res) => {
    // Sätt id till det inlägg som ska uppdateras
    // Sätt ny data
    let id = req.params.id;
    const filter = {_id: id};
    const updatePost = req.body;
    

    try {
        // Redigera kurs med visst _id
        await Post.findByIdAndUpdate(filter, updatePost);
        res.json({message: "Post updated"});
    } catch {
        res.json({message: "Couldn't find post"});
    }
});