/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const async = require("async");
const fs = require('fs');
const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'images'); 
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const processFormBody = multer({ storage: storage });

// const navigate = useNavigate();


app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
// const { default: axios } = require("axios");
// const { isErrored } = require("stream");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.

app.use(express.json());
app.use(express.static(__dirname));
/*
function getSessionUserID(request){
  return request.session.user_id;
  //return session.user._id;
}

function hasNoUserSession(request, response){
  //return false;
  if (!getSessionUserID(request)){
    response.status(401).send();
    return true;
  }
  // if (session.user === undefined){
  //   response.status(401).send();
  //   return true;
  // }
  return false;
}
*/


app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * URL /admin/login - Returns user object on successful login
 */
app.post('/admin/login', function (request, response) {
  const { login_name, password } = request.body;

  User.findOne({ login_name: login_name, password: password }, function(err, user) {
      if (err) {
          console.error('Error during user login:', err);
          response.status(500).send(JSON.stringify(err));
          return;
      }
      if (!user) {
          response.status(400).send('Login failed. Please check your login details.');
          return;
      }
      request.session.user = { _id: user._id, login_name: user.login_name };
      response.send(user); 
  });
});

/**
 * URL /commentsOfPhoto/:photo_id - adds a new comment on photo for the current user
 */
app.post('/commentsOfPhoto/:photo_id', function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized');
    return;
  }
  if (!request.body.comment || request.body.comment.trim() === '') {
    response.status(400).send('Comment cannot be empty');
    return;
  }
  const photo_id = request.params.photo_id;
  const commentText = request.body.comment;
  const userId = request.session.user._id;
  Photo.findById(photo_id, function(err, photo) {
    if (err) {
      console.error('Error finding photo:', err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (!photo) {
      response.status(404).send('Photo not found');
      return;
    }
    const newComment = {
      comment: commentText,
      user_id: userId,
      date_time: Date.now() 
    };
    photo.comments.push(newComment);
    photo.save(function (commErr, updatedPhoto) {
      if (commErr) {
        console.error('Error saving comment:', commErr);
        response.status(500).send(JSON.stringify(commErr));
        return;
      }

      response.json(updatedPhoto);
    });
  });
});

app.delete("/photos/:photoId", function (request, response) {
  const photoId = request.params.photoId;

  Photo.findById(photoId, function (err, photo) {

    if (photo.user_id.toString() !== request.session.user._id.toString()) {
      response.status(403).send('You can only delete your own photos.');
      return;
    }
    Photo.findByIdAndRemove(photoId, function (deleteErr) {
      if (deleteErr) {
        console.error("Error deleting photo:", deleteErr);
        response.status(500).send('Internal Server Error');
        return;
      }
      const filePath = path.join(__dirname, 'images', photo.file_name);
      fs.unlink(filePath, function (unlinkErr) {
        if (unlinkErr) {
          console.error("Error deleting photo file:", unlinkErr);
        }
        response.status(200).send('Photo deleted successfully');
      });
    });
  });
});
app.delete("/photos/:photoId/comments/:commentId", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  const { photoId, commentId } = request.params;

  Photo.findById(photoId, function (err, photo) {
    if (err || !photo) {
      response.status(404).send('Photo not found');
      return;
    }

    // Check if the comment belongs to the logged-in user
    const comment = photo.comments.id(commentId);
    if (!comment) {
      response.status(404).send('Comment not found');
      return;
    }
    
    if (comment.user_id.toString() !== request.session.user._id.toString()) {
      response.status(403).send('Unauthorized to delete this comment');
      return;
    }

    comment.remove();

    photo.save(function (saveErr) {
      if (saveErr) {
        response.status(500).send('Error updating photo');
        return;
      }
      response.send('Comment deleted successfully');
    });
  });
});

app.delete("/photos/:photoId/comments/:commentId", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  const { photoId, commentId } = request.params;

  Photo.findById(photoId, function (err, photo) {
    if (err || !photo) {
      response.status(404).send('Photo not found');
      return;
    }

    // Check if the comment belongs to the logged-in user
    const comment = photo.comments.id(commentId);
    if (!comment) {
      response.status(404).send('Comment not found');
      return;
    }
    
    if (comment.user_id.toString() !== request.session.user._id.toString()) {
      response.status(403).send('Unauthorized to delete this comment');
      return;
    }

    comment.remove();

    photo.save(function (saveErr) {
      if (saveErr) {
        response.status(500).send('Error updating photo');
        return;
      }
      response.send('Comment deleted successfully');
    });
  });
});


/**
 * URL /admin/logout - clears user session
 */
app.post('/admin/logout', function (request, response) {
  if (request.session.user) {
    request.session.destroy(function(err) {
      if (err) {
        console.error('Logout error', err);
          response.status(500).send(JSON.stringify(err));
        } else {
          response.send('Logged out');
        }
    });
  } else {
    response.status(400).send('Not logged in');
  }
});

app.get('/check-login', function (request, response) {
  if (request.session.user) {
      response.send({ loggedIn: true, user: request.session.user });
  } else {
      response.send({ loggedIn: false });
  }
});

/**
 * URL /photos/new - adds a new photo for the current user
 */
app.post('/photos/new', processFormBody.single('uploadedphoto'), function (request, response) {
  
  if (!request.file) {
    response.status(400).send('No file uploaded.');
    return;
  }
  const newPhoto = new Photo({
    file_name: request.file.filename,  
    date_time: new Date(),            
    user_id: request.session.user._id 
  });

  newPhoto.save()
    .then(savedPhoto => {
      response.json(savedPhoto);  
    })
    .catch(err => {
      console.error("Error saving photo:", err);
      response.status(500).send(err);
    });
});

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

app.post("/user", function (request, response) {
  const first_name = request.body.first_name || "";
  const last_name = request.body.last_name || "";
  const location = request.body.location || "";
  const description = request.body.description || "";
  const occupation = request.body.occupation || "";
  const register_login_name = request.body.register_login_name || "";
  const register_password = request.body.register_password || "";
  const password_repeat = request.body.password_repeat || "";

  if (first_name === "") {
    console.error("Error in /user fn", first_name);
    response.status(400).send("first_name is required");
    return;
  }
  if (last_name === "") {
    console.error("Error in /user ln", last_name);
    response.status(400).send("last_name is required");
    return;
  }
  if (register_login_name === ""){
    console.error("Error in /user un", register_login_name);
    response.status(400).send("Reg Login_name is required");
    return;
  }
  if (register_password === ""){
    console.error("Error in /user p", register_password);
    response.status(400).send("Reg password is required");
    return;
  }
  if (password_repeat === ""){
    console.error("Error in /user pr", password_repeat);
    response.status(400).send("Verify password is required");
    return;
  }
  if (register_password !== password_repeat) {
    response.status(400).send("Passwords do not match");
    return;
  }

  User.exists({login_name: register_login_name}, function (err, returnValue){
    if (err){
      console.error("Error in /user", err);
      response.status(500).send();
    } else if (returnValue) {
        console.error("Error in /user", returnValue);
        response.status(400).send();
      } else {
        User.create(
            {
              _id: new mongoose.Types.ObjectId(),
              first_name: first_name,
              last_name: last_name,
              location: location,
              description: description,
              occupation: occupation,
              login_name: register_login_name,
              password: register_password
            })
            .then((user) => {
              request.session.user_id = user._id;
              session.user_id = user._id;
              response.end(JSON.stringify(user));
            })
            .catch(err1 => {
              console.error("Error in /user", err1);
              response.status(500).send();
            });
      }
  });      
});

app.delete("/users/:userId", function (request, response) {
  const userId = request.params.userId;
  if (userId.toString() !== request.session.user._id.toString()) {
    response.status(403).send('Unauthorized to delete this Account');
    return;
  }
  User.exists({ _id: userId }, function (err, result) {
    console.log(err, result);
    if (err) {
      console.error("Error in /user", err);
      response.status(500).send();
    } else if (result) {
      User.deleteOne(result, function (dErr, deleteRes) {
        console.log(dErr, deleteRes);
        if (err) {
          console.error("Error deleting user", err);
          response.status(500).send();
        }
        else if (deleteRes) {
          response.status(200).send("User successfully deleted");
        }
      });
    }
  });
});


app.post('/photos/:id/like', function(request, response) {
  if (!request.session.user) {
      response.status(401).send('Unauthorized - Please log in.');
      return;
  }

  const photoId = request.params.id;
  const userId = request.session.user._id;

  Photo.findById(photoId, function(err, photo) {
      if (err || !photo) {
          response.status(404).send('Photo not found');
          return;
      }

      if (photo.likes.includes(userId)) {
          response.status(400).send('You have already liked this photo');
          return;
      }

      photo.likes.push(userId);
      photo.save(function(saveErr, updatedPhoto) {
          if (saveErr) {
              response.status(500).send('Error liking photo');
              return;
          }
          response.json(updatedPhoto);
      });
  });
});

app.post('/photos/:id/unlike', function(request, response) {
  if (!request.session.user) {
      response.status(401).send('Unauthorized - Please log in.');
      return;
  }

  const photoId = request.params.id;
  const userId = request.session.user._id;

  Photo.findById(photoId, function(err, photo) {
      if (err || !photo) {
          response.status(404).send('Photo not found');
          return;
      }

      // Check if user has already liked the photo
      if (!photo.likes.includes(userId)) {
          response.status(400).send('You have not liked this photo');
          return;
      }

      // Remove user's ID from the likes array
      photo.likes = photo.likes.filter(id => !id.equals(userId));
      photo.save(function(saveErr, updatedPhoto) {
          if (saveErr) {
              response.status(500).send('Error unliking photo');
              return;
          }
          response.json(updatedPhoto);
      });
  });
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */


app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      // console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {

    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.

    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return; 
  }

  User.find({}, '_id first_name last_name', (err, users) => {
    if (err) {
      console.error("Error in /user/list:", err);
      response.status(500).send(JSON.stringify(err));
      return; 
    }

    async.each(
      users,
      async function(user){
        const userCommentedPhotos = await Photo.aggregate([
          { $unwind: "$comments" },
          { $match: { 'comments.user_id': user._id } }
      ]);
        // console.log('userCommentedPhotos',user._id,JSON.stringify(userCommentedPhotos));

        //Photos Count Bubble
        const photosCount = await Photo.countDocuments({ user_id: user._id });
        user.photosCount = photosCount;
        user.commentsCount = userCommentedPhotos.length;
        user.commentedPhotos = userCommentedPhotos;
      },

      function(errr){
        if(errr){
          console.error("Error fetching photos count:", errr);
          response.status(500).send(JSON.stringify(errr));
        } else {
          response.json(users);
        }
      }
    );
    /* response.json(users); */
  });
});

app.get("/user/:id/comments", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(400).send("Invalid user ID.");
    return;
  }

  Photo.find({ 'comments.user_id': request.params.id })
    .select('comments file_name')
    .exec((err, photos) => {
      if (err) {
        console.error("Error fetching comments:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (photos.length === 0) {
        response.status(404).send("No comments found for user with ID:" + request.params.id);
        return;
      }
      const comments = photos.reduce((acc, photo) => {
        const userComments = photo.comments.filter(comment => comment.user_id.toString() === request.params.id);
        userComments.forEach(comment => acc.push({
          photoId: photo._id,
          fileName: photo.file_name,
          commentText: comment.comment,
          dateTime: comment.date_time
        }));
        return acc;
      }, []);
      response.json(comments);
    });
});

/**
 * URL /user/:id - Returns the information for User (id).
 *
 */


app.get("/user/:id", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  User.findById(request.params.id, '_id first_name last_name location description occupation likes', (err, user) => {
    if (err || !user) {
      console.log("User with _id:" + request.params.id + " not found.");
      response.status(400).send("User not found");
      return;
    }
    response.json(user);
  });
});


/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
    response.status(400).send("Invalid user ID.");
    return;
  }

  Photo.find({ user_id: request.params.id })
    .select('_id file_name date_time user_id likes comments') 
    .exec((err, photos) => {
      if (err) {
        console.error("Error in /photosOfUser/:id:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (photos.length === 0) {
        response.json([]);  
      } else {
        response.json(photos);
      }
    });
});

app.get("/photo/:photoId", function (request, response) {
  if (!request.session.user) {
    response.status(401).send('Unauthorized - Please log in.');
    return;
  }

  Photo.findById(request.params.photoId, function(err, photo) {
    if (err) {
      console.error("Error finding photo:", err);
      response.status(500).send();
    } else if (!photo) {
      response.status(404).send('Photo not found');
    } else {
      response.json(photo);
    }
  });
});

app.get(/^(?!.*\.js$).*$/, function(req, res) {
  res.sendFile(path.join(__dirname, 'photo-share.html'));
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
