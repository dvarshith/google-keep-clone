import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import cors from "cors";

const app = express();
const port = 3000;
const saltRounds = 12;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.post('/add', async (req, res) => {
  const id = req.body.newNote.id;
  const title = req.body.newNote.title;
  const content = req.body.newNote.content;
  try {
      await db.query(
        "INSERT INTO notes (noteid, title, note, user_id) VALUES ($1, $2, $3, $4)",
        [id, title, content, req.user.id]
      );
      return res.status(200).send("Success");
  } catch(err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/delete', async (req, res) => {
  const id = req.body.id;
  try {
      await db.query(
        "DELETE FROM notes WHERE noteid = $1",
        [id]
      );
      return res.status(200).send("Success");
  } catch(err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get('/notesAll', async (req, res) => {
  let sessions = req.sessionStore.sessions;
  let userId = null;
  for (const [sessionId, sessionDataStr] of Object.entries(sessions)) {
    let sessionData;
    try {
      sessionData = JSON.parse(sessionDataStr);
    } catch (error) {
      console.error(`Failed to parse session data for session ID ${sessionId}:`, error);
      continue;
    }
  if (sessionData.passport && sessionData.passport.user) {
      userId = sessionData.passport.user.id;
      break;
    }
  }
  try {
    const result = await db.query(
      "SELECT noteid, title, note FROM notes WHERE user_id = $1",
      [userId]
    );
    const notes = result.rows.map(row => ({
      id: row.noteid,
      title: row.title,
      content: row.note
    }));
    return res.status(200).send(notes);
  } catch(err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Success");
  });
});

app.get("/auth/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (!user) {
      return res.status(401).send(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send("Success");
    });
  })(req, res, next);
});

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).send("Internal Server Error");
      }
      return res.status(200).send("Successful");
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkResult.rows.length > 0) {
      return res.status(400).send("User already exists");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).send("Internal Server Error");
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            return res.status(200).send("Success");
          });
        }
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.error(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
