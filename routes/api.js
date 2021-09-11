const express = require('express');
const apiRouter = express.Router();

apiRouter.post('/search', function (req, res) {
  res.status(200).send()
});
apiRouter.get('/databases/:databaseId', function (req, res) {
  res.status(200).send()
});
apiRouter.post('/databases/:databaseId/pages', function (req, res) {
  res.status(201).send()
});

module.exports = apiRouter;
