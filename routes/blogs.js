const express = require("express");
const Blog = require("../model/blog");
const router = express.Router();

// Get all blogs route
router.get("/", async (req, res) => {
    let searchOptions = {};

    if (req.query.title !== "") {
        searchOptions.title = new RegExp(req.query.title, "i");
    }

    try {
        const blogs = await Blog.find(searchOptions);

        res.render("blogs/index", {
            blogs: blogs,
            searchOptions: req.query,
            title: "All Blogs",
        });
    } catch {
        res.redirect("/blogs");
    }
});

// Get create blogs route
router.get("/create", (req, res) => {
    res.render("blogs/create", {
        blog: new Blog(),
        title: "Create New Blog",
    });
});

// Create new blog
router.post("/", async (req, res) => {
    const blog = new Blog({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body,
    });

    try {
        const newBlog = await blog.save();
        res.redirect("/blogs");
    } catch {
        res.render("blogs/create", {
            blog: blog,
            errorMessage: "Error creating new blog",
            title: "Create New Blog",
        });
    }
});

// Get a particular blog
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        res.render("blogs/details", { blog: blog, title: blog.title });
    } catch {
        res.redirect("/blogs");
    }
});

// Get edit page for a particular blog
router.get("/:id/edit", async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    res.render("blogs/edit", {
        blog: blog,
        title: "Update Blog",
    });
});

// Update a particular blog
router.put("/:id", async (req, res) => {
    let blog;

    try {
        blog = await Blog.findById(req.params.id);

        (blog.title = req.body.title),
            (blog.snippet = req.body.snippet),
            (blog.body = req.body.body);

        await blog.save();
        res.redirect(`/blogs/${blog.id}`);
    } catch {
        res.render("/:id/edit", {
            blog: blog,
            errorMessage: "Error updating blog",
            title: "Update blog",
        });
    }
});

// Delete a particular blog
router.delete("/:id", async (req, res) => {
    let blog;

    try {
        blog = await Blog.findById(req.params.id);
        await blog.remove();
        res.redirect("/blogs");
    } catch {
        if (!blog) {
            res.redirect("/blogs");
        } else {
            res.render(`blogs/${blog.id}`, { blog: blog, title: blog.title });
        }
    }
});

module.exports = router;
