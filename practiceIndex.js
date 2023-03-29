const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) console.log(err.massage);
  else console.log(`Server started on port ${PORT}`);
});
