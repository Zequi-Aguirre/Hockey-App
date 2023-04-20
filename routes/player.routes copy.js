const express = require("express");
const router = express.Router();

const [modelName] = require("../models/[modelName].model");

/* GET ALL [modelNamePlural] */
router.[get or post]("/", (req, res, next) => {

  [modelName]
    .find()
    .populate([if any])
    .then(([modelName]FromDB) => {
      
      res.render("[modelName]/all-[modelNamePlural]", {[modelName]FromDB});
    })
    .catch((err) => {
      console.log(err);
    res.render('error')
    });
});


module.exports = router;
