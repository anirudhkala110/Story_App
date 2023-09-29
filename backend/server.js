import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2';
import multer from 'multer';
import UserModel from './Models/UserModel.js';
import StoryModel from './Models/StoryModel.js';
import LikesModel from './Models/LikesModel.js';
import path from 'path'
import { Op } from 'sequelize'


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000'], // Replace with your client's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
};

dotenv.config();
app.use(cors(corsOptions));


const db = mysql.createConnection({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS
})

const port = process.env.PORT || 8095




/* Loggedin or not Process */
const verifyUser = (req, res, next) => {
    const token = req.cookies.token
    // console.log("Token user login chk -> ", token,)
    if (!token) {
        return res.json({ msg: 'Please Login First . . .', msg_type: 'error' })
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json("Token Not Valid")
            }
            else {
                req.email = decoded.email;
                req.username = decoded.username
                req.userId = decoded.id
                req.file = decoded.file
                req.phone = decoded.phone
                req.file = decoded.file
                // console.log(req.email, " ", req.username, " ", req.userId," ",req.file)
                next()
            }
        })
    }
}
app.get('/logged-in', verifyUser, (req, res) => {
    return res.json({ email: req.email, username: req.username, userId: req.userId, file: req.file, phone: req.phone })
})
/* Loggedin or not Process */


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Files')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-_-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage
})

/* Login */
app.post('/login', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;

    // console.log("Email -> ", email, "\nPassword -> ", password);


    if (!email.match(emailRegex)) {
        return res.json({ msg: "Invalid email format", msg_type: 'error' });
    }
    else
        if (!password.match(passwordRegex)) {
            return res.json({ msg: "Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
        }
        else {
            try {
                const data = await UserModel.findOne({ where: { email: email } });
                // console.log("User Data is :-> ", data) //As the above method directly shows the final single person data hence we don't need the array method to access the data
                if (!data) {
                    return res.json({ msg: "Email Doesn't Exist. Please Register First.", msg_type: "error" });
                }

                const findout = bcrypt.compare(password, data.password);

                if (!findout) {
                    return res.json({ msg: "Password Didn't Match. Please try again!", msg_type: "error" });
                }
                else {
                    const token = jwt.sign({ id: data.id, username: data.name, email: data.email, file: data.file, phone: data.phone }, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
                    res.cookie('token', token);

                    // console.log("Token generated -> ", token, "\nWith email : ", data.email, data.id, data.file)
                    return res.json({ msg: "Login Successfully . . .", msg_type: "good" });
                }
            } catch (err) {
                console.error(err);
                return res.json(err);
            }
        }
});
/* End Login */

/* Registration Process */

app.post('/register/:name/:email/:phone/:password/:cpassword', upload.single('file'), async function (req, res) {
    // console.log("Registration Call");
    const { name, email, phone, password, cpassword } = req.params;
    // const formdata = req.formData
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;

    // console.log(name, email, password, cpassword, phone);

    if (!email.match(emailRegex)) {
        return res.json({ msg: "Invalid email format", msg_type: 'error' });
    }

    if (!password.match(passwordRegex)) {
        return res.json({ msg: "Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
    }

    if (!cpassword.match(passwordRegex)) {
        return res.json({ msg: "Confirm Password must have at least 1 capital letter, 1 small letter, 1 number, and 1 special character", msg_type: 'error' });
    }

    if (cpassword !== password) {
        return res.json({ msg: "Password and confirm password didn't Match", msg_type: 'error' });
    }
    // const totalCount = UserModel.count({});
    // console.log(`Total number of users: ${totalCount}`);
    // console.log("Checking Email")
    try {
        const existingUser = await UserModel.findOne({
            where: {
                // [Op.or]: [{ email: email }, { phone: phone }]
                [Op.or]: [{ email: email }]
            }
        });

        if (existingUser) {
            return res.json({ msg: "Information Already Exists. Please Register with another one.", msg_type: "error" });
        }

        const hash = await bcrypt.hash(password, 10);
        UserModel.create({ name: name, email: email, password: hash, phone: phone, file: req.file.filename })
            .then(result => {
                // console.log(result)
                return res.json({ msg: "Registered Successfuly . . .", msg_type: 'good' })
            })
            .catch(err => {
                return res.json({ msg: 'Uploading Error . . . ', msg_type: 'error' })
            })
    } catch (err) {
        console.error(err);
        return res.json(err);
    }
});
/* Registration Process */

/* Edit Account*/

app.put('/edit-user/:name/:phone/:file', verifyUser, upload.single('file'), async (req, res) => {
    const name = req.params.name
    const phone = req.params.phone
    const userId = req.userId
    const file1 = req.file.filename
    const file2 = req.params.file
    console.log(name, phone, userId, file1, " ", file2)
    const sqlquery = "UPDATE usermodels SET name=?, phone=?, file=? WHERE id=?"
    if (file1) {
        db.query(sqlquery, [name, phone, file1, userId], (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                // console.log(data)
                req.username = name
                req.file = file1
                req.phone = phone
                return res.json({ msg: "Data Updated Successfully . . ", msg_type: "good" })
            }
        })
    }
    else {
        db.query(sqlquery, [name, phone, file2, userId], (err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                req.username = name
                req.file = file2
                req.phone = phone
                // console.log(data)

                return res.json({ msg: "Data Updated Successfully . . ", msg_type: "good" })
            }
        })
    }
})

/* Edit Account */
/* Read user by email */
app.get('/user/info', verifyUser, (req, res) => {
    const email = req.email
    // console.log(email)
    const sqlquery = "SELECT * FROM usermodels WHERE email=?"
    db.query(sqlquery, [email], (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            // console.log(data)
            return res.json(data)
        }
    })
})
/* Read user by email */

/* Deleting Account */
app.delete('/delete-account/:id', (req, res) => {
    // console.log("Calling Delete")
    UserModel.destroy({ where: { id: req.params.id } })
        .then(result => {
            console.log(result)
            res.clearCookie('token')
            return res.json({ msg: "Deleted Successfuly . . . ", msg_type: "good" })
        })
        .catch(err => {
            console.log(err)
            return res.json({ msg: "Can not Delete the video ", msg_type: 'error' })
        })
})
/* Deleting Account */


/* Uploading Post */
app.post('/upload-post/:title/:file', verifyUser, upload.single('file'), (req, res) => {
    const title = req.params.title;
    const story = req.body.story;
    const userId = parseInt(req.userId);
    const phone = req.phone
    const username = req.username;
    const email = req.email;
    const file = req.params.file
    // console.log("Title -> ", title, "\nStory -> ", story, "\nUser ID -> ", userId, "\nUser Name -> ", username, "\n Email -> ", email, "\nFile -> ", file, "\nPhone -> ", phone);
    // StoryModel.create({ title: title, description: description, userId: userId, username: username, email: email, file: file, file: req.file.filename })
    StoryModel.create({ title: title, username: username, story: story, email: email, phone: phone, userID: userId, file: file })
        .then(result => {
            // console.log(result)
            return res.json({ msg: "Post Uploaded Successfuly . . .", msg_type: 'good' })
        })
        .catch(err => {
            console.log("error -> ", err)
            return res.json({ msg: 'Uploading Error . . . ', msg_type: 'error' })
        })
    // return res.json(story)
})
/* Uploading Post */

/* Deleting Post */
app.delete('/delete-post/:id', (req, res) => {
    StoryModel.destroy({ where: { vid: req.params.id } })
        .then(result => {
            return res.json({ msg: "Deleted Successfuly . . . ", msg_type: "good" })
        })
        .catch(err => {
            console.log(err)
            return res.json({ msg: "Can not Delete the video ", msg_type: 'error' })
        })
})
/* Deleting Post */

/* Get all Post */
app.get('/all-posts', function (req, res) {
    StoryModel.findAll({
        order: [['likesCount', 'DESC']]
    })
        .then(posts => {
            // console.log(posts)
            return res.json(posts)
        })
        .catch(err => console.log(err))
})
/* Reading Post */
app.get('/read-post/:id', (req, res) => {
    const id = req.params.id
    StoryModel.findByPk(id)
        .then(result => { return res.json(result) })
        .catch(err => console.log(err))
})
/* Get all Posts */

/* Logout System */
app.get('/logout', (req, res) => {
    res.clearCookie('token')
    // console.log("Called")
    return res.json({ msg: "Logout Successful . . .", msg_type: "good" })
})
/* Logout System */


/* Handling Like dislike */

app.post('/reaction', verifyUser, upload.single('file'), (req, res) => {
    const postId = req.body.id;
    const email = req.email;
    const liked = req.body.liked;

    console.log("Title -> ", postId, "\nLiked -> ", liked, "\n Email -> ", email);

    // Check if the user has already liked this post
    LikesModel.findOne({
        where: {
            postId: postId,
            email: email
        }
    })
        .then(existingLike => {
            if (existingLike) {
                // User has already liked the post, return an error response
                // console.log("Already Liked This Post . . .")
                return res.status(400).json({ msg: 'You have already liked this post.', msg_type: 'error' });

            } else {
                // Allow the user to submit the like
                LikesModel.create({ email: email, postId: postId, liked: liked })
                    .then(() => {
                        if (liked) {
                            // Increment the like count in the StoryModel
                            return StoryModel.increment('likesCount', { by: 1, where: { id: postId } });
                        }
                    })
                    .then(() => {
                        return res.status(200).json({ msg: 'Liked successfully.', msg_type: 'good' });
                    })
                    .catch(err => {
                        console.log("error -> ", err);
                        return res.status(500).json({ msg: 'Backend Error . . . ', msg_type: 'error' });
                    });
            }
        })
        .catch(err => {
            console.log("error -> ", err);
            return res.status(500).json({ msg: 'Backend Error . . . ', msg_type: 'error' });
        });
});

app.get('/a-res/:id', verifyUser, (req, res) => {
    const postId = req.params.id;
    const email = req.email;
    // console.log(email, "\npost ID", postId)
    LikesModel.findOne({
        where: {
            postId: postId,
            email: email
        }
    })
        .then(existingLike => {
            if (existingLike) {
                // User has already liked the post, return an error response
                // console.log("Already Liked This Post . . .")
                return res.json(true)

            } else {
                // console.log(existingLike)
                // Allow the user to submit the like
                // console.log("Not Liked This post . . .")
                return res.json(false)
            }
        })
        .catch(err => {
            console.log("error -> ", err);
            return res.status(500).json({ msg: 'Backend Error . . . ', msg_type: 'error' });
        });
})

/* Handling Like dislike */

/* Showing Likes */

app.get('/all-likes', function (req, res) {
    LikesModel.findAll({
        order: [['updatedAt', 'DESC']]
    })
        .then(posts => {
            // console.log(posts)
            return res.json(posts)
        })
        .catch(err => console.log(err))
})


/* Showing Likes */

/* AI generated story */

// Endpoint for generating stories
app.post('/generate-story', verifyUser, async (req, res) => {

    const openaiApiKey = process.env.MY_OPEN_AI_SECRET_KEY;

    // Create an instance of the OpenAI library
    const openaiClient = new openai({ apiKey: openaiApiKey });
    const context = req.body.storybase;
    // console.log(context)
    try {
        // Ensure the user is authenticated (you can implement authentication as shown in your previous code)
        // You can use the JWT token to authenticate the user
        // User is authenticated, proceed with story generation
        openaiClient.completions.create(
            {
                engine: 'text-davinci-003',
                prompt: context,
                max_tokens: 10, // Adjust the desired length of the story
                model: 'text-davinci-003',
            },
            (error, response) => {
                if (error) {
                    console.error('Error generating story:', error);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                const generatedStory = response.choices[0].text;
                // console.log(generatedStory)
                res.status(200).json({ story: generatedStory });
            }
        );

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

/* AI generated story Ends*/




app.listen(port, () => {
    console.log("Started")
})