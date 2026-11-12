const express = require("express");
const path = require("path");
const fs = require("fs");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PUBLIC_DIR = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(__dirname, "project testing 3", "public");

app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));
const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "26csel23";
const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
let db;

app.get("/", (req, res) => {
  res.redirect("/login.html");
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "register.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "dashboard.html"));
});
app.get("/wifi", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "wifi.html"));
});
app.get("/checklist", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "checklist.html"));
});
app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.send("<script>alert('All fields are required!'); window.location.href='/register.html';</script>");
    }

    if (password.length < 3 || password.length > 12) {
      return res.send("<script>alert('Password must be between 3 and 12 characters long!'); window.location.href='/register.html';</script>");
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await db.collection("users").findOne({ email: cleanEmail });
    if (existingUser) {
      return res.send("<script>alert('An account with this email already exists! Please log in.'); window.location.href='/login.html';</script>");
    }
    const newUser = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: cleanEmail,
      password: password,
      createdAt: new Date()
    };

    await db.collection("users").insertOne(newUser);
    return res.send("<script>alert('Account created successfully! Please log in.'); window.location.href='/login.html';</script>");
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).send("<script>alert('Server error creating account. Please try again.'); window.location.href='/register.html';</script>");
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.send("<script>alert('Please enter both email and password!'); window.location.href='/login.html';</script>");
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.collection("users").findOne({ email: cleanEmail, password: password });

    if (user) {
  
      const studentName = user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.email.split("@")[0];
      const sessionData = JSON.stringify({
        email: user.email,
        name: studentName,
        first_name: user.first_name
      });
      return res.send(`
        <script>
          localStorage.setItem('campusUser', JSON.stringify(${sessionData}));
          window.location.href = '/dashboard.html';
        </script>
      `);
    } else {
      return res.send("<script>localStorage.removeItem('campusUser'); alert('Invalid email or password!'); window.location.href='/login.html';</script>");
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("<script>alert('Server error during login. Please try again.'); window.location.href='/login.html';</script>");
  }
});
async function startServer() {
  try {
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected successfully to MongoDB database: ${DB_NAME}`);

    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log("Tip: Please verify that MongoDB service is running locally on port 27017.");
    process.exit(1);
  }
}
startServer();