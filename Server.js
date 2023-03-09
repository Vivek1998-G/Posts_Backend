const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors=require('cors')
dotenv.config();


const PORT = process.env.PORT || 4000
const app = express();
app.use(express.json());
app.use(cors())

const connection = mysql.createConnection({
    host: 'cloud_instance_private_ip',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10
})

connection.connect(function (err, result) {
    if (err) {
        return console.log(err)
    }
    console.log("connect to database")
    return console.log(result)
}
)

app.get('/getPosts', async (req, res) => {

    connection.query("select * from post", (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
})

app.get('/getonePosts/:id', function (req, res) {
    let id = req.params.id
    console.log(id)
    connection.query(`select *  from post where ID=${id}`, (err, result) => {
        if (err) {
            console.log(err)
        }

        res.send(result)
    })
})

app.post('/writePosts', function (req, res) {
    let title = req.body.title;
    let content = req.body.content;
   

        connection.query(`insert into Post(title,content,createdAt)values("${title}","${content}",NOW())`, (err, result) => {
            if (err) {
                return console.log(err)
            }
            console.log("succesfullystored data")
            return console.log(result)
        })

})

app.put('/editPosts/:id', function (req, res) {
    let title = req.body.title;
    let content = req.body.content;
    let id=req.params.id;

    connection.query(`UPDATE  post SET title="${title}",content="${content}",updatedAt=Now() where id=${id};`,  (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
})

app.delete('/deletePosts/:id', function (req, res) {
    let id = req.params.id
    connection.query(`DELETE FROM post where id=${id}`, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
})




app.listen(PORT,  () => console.log(`Server Start on localhost ${PORT}`))
