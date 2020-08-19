const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/contacts_app_db',
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('connected', function () {
  console.log(`Connected to MongoDB at ${db.host}:${db.port}`);
});