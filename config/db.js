const Datastore = require("nedb");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(__dirname, "../database");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const adminsDB = new Datastore({
  filename: path.join(DB_DIR, "admins.db"),
  autoload: true
});

const contactsDB = new Datastore({
  filename: path.join(DB_DIR, "contacts.db"),
  autoload: true
});

const quotesDB = new Datastore({
  filename: path.join(DB_DIR, "quotes.db"),
  autoload: true
});

const chatbotDB = new Datastore({
  filename: path.join(DB_DIR, "chatbot.db"),
  autoload: true
});

const otpDB = new Datastore({
  filename: path.join(DB_DIR, "otp.db"),
  autoload: true
});

console.log("Database Folder:", DB_DIR);

module.exports = {
  adminsDB,
  contactsDB,
  quotesDB,
  chatbotDB,
  otpDB
};
