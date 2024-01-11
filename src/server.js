const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://saurabhkumar:rVKACHYbuzYy7VMs@cluster0.n4zogin.mongodb.net/Myshopapp?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open",  () => {
  console.log("Connected to MongoDB...");
});

app.get("/", (req,res) =>{
    res.send("server is running");
})

const authRoutes = require('./routes/auth');
const shopkeeperRoutes = require('./routes/shopkeeper');
// const listItemRoutes = require('./routes/listItem');


// const corsOptions = {
//   origin: 'http://127.0.0.1:5000/', 
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use('/api/auth', cors(corsOptions), authRoutes);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/shopkeepers', paymentRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/shopkeeper', shopkeeperRoutes);
// app.use('/api/listItem', listItemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
