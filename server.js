/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Divyanshu Sharma Student ID: 172551210 Date: 12 November 2023
*
*  Published URL: https://frantic-ox-pants.cyclic.app
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.set('view engine', 'ejs');
app.use(express.static("public"));
legoData.initialize();

app.get("/", (req, res) => {
  res.render("home");
});app.get("/about", function (req, res) {
  res.render("about");
});app.get("/404", function (req, res) {
  res.render("404");
});

app.get("/lego/sets", async (req, res) => {
  const theme = req.query.theme;

  try {
    let data;

    if (theme) {
      data = await legoData.getSetsByTheme(theme);
    } else {
      data = await legoData.getAllSets();
    }

    if (data.length === 0) {
      res.render("404");
    } else {
      res.render("sets",{
        data: data
      })
    }
  } catch (error) {
    res.render("404");
  }
});
app.get("/lego/sets/:setNum", async (req, res) => {
  const setNum = req.params.setNum;

  try {
    const data = await legoData.getSetByNum(setNum);

    if (data) {
      res.render("set",{
        set: data
      });
    } else {
      res.render("404");
    }
  } catch (error) {
    res.render("404");
  }
});

app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));



