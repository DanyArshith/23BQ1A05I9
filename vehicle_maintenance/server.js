const express = require("express");
const { PORT } = require("./config");
const { router } = require("./routes");

const app = express();

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`vehicle maintenance scheduler running on port ${PORT}`);
});
