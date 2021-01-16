if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const app = express();

// Routes variables
const indexRoutes = require("./routes/index");
const blogsRoutes = require("./routes/blogs");

// App config
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongodb setup
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", err => console.error(err));
db.once("open", () => console.log("connected to mongoose"));

// Routes
app.use("/", indexRoutes);
app.use("/blogs", blogsRoutes);

// Error 404 setup
app.use((req, res) => {
    res.status(404).render("404", { title: "Error 404" });
});

// Listen to a port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server running at port " + PORT));
