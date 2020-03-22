const express = require("express");
const app = express();
const PORT = 3000;
const dotenv = require("dotenv").config();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("pwa"));
app.use(methodOverride("_method"));

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", { title: "Qui prend quoi ?" });
});

app.get("/party/:id", (req, res) => {
  axios.get(`${process.env.API_URL}/party/${req.params.id}`).then(({ data }) =>
    res.render("party", {
      party: data,
      title: data.name,
      url: `${process.env.FRONT_URL}:${process.env.PORT}/party/${data._id}`
    })
  );
});

app.post("/party", (req, res) => {
  axios
    .post(`${process.env.API_URL}/party`, req.body)
    .then(({ data }) => res.redirect(`/party/${data._id}`))
    .catch(err => res.send(err));
});

app.post("/party/:id/items", (req, res) => {
  axios
    .post(`${process.env.API_URL}/party/${req.params.id}/items`, req.body)
    .then(({ data }) => res.redirect(`/party/${req.params.id}`))
    .catch(err => res.send(err));
});

app.delete("/party/:id/items/:itemsId", (req, res) => {
  axios
    .delete(
      `${process.env.API_URL}/party/${req.params.id}/items/${req.params.itemsId}`
    )
    .then(({ data }) => res.redirect(`/party/${req.params.id}`))
    .catch(err => res.send(err));
});

app.listen(process.env.PORT, () =>
  console.log(`Front app listening on port ${process.env.PORT}!`)
);
