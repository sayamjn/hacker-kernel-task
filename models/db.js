const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
      .connect(
        "mongodb+srv://admin_sayam:Sayamrommy1@cluster0.malzxoq.mongodb.net/hackerkernel?retryWrites=true&w=majority",{ useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("connected!"))
    .catch((err) => console.log(err.message));
