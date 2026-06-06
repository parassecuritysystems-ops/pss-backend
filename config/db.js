const Datastore = require("nedb");

const adminsDB = new Datastore({
  filename: "./database/admins.db",
  autoload: true
});

const contactsDB = new Datastore({
  filename: "./database/contacts.db",
  autoload: true
});

const quotesDB = new Datastore({
  filename: "./database/quotes.db",
  autoload: true
});

const chatbotDB = new Datastore({
  filename: "./database/chatbot.db",
  autoload: true
});

const otpDB = new Datastore({
  filename: "./database/otp.db",
  autoload: true
});

module.exports = {
  adminsDB,
  contactsDB,
  quotesDB,
  chatbotDB,
  otpDB
};
