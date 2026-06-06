const Datastore = require("nedb");

const adminsDB = new Datastore({
  filename: "./server/database/admins.db",
  autoload: true
});

const contactsDB = new Datastore({
  filename: "./server/database/contacts.db",
  autoload: true
});

const quotesDB = new Datastore({
  filename: "./server/database/quotes.db",
  autoload: true
});

const chatbotDB = new Datastore({
  filename: "./server/database/chatbot.db",
  autoload: true
});

const otpDB = new Datastore({
  filename: "./server/database/otp.db",
  autoload: true
});

module.exports = {
  adminsDB,
  contactsDB,
  quotesDB,
  chatbotDB,
  otpDB
};