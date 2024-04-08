const fs = require("fs");

// membuat folder jika beluma ada
const dirPath = "./data"; // direktori data
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file jika belum ada
const dataPath = "./data/contacts.json"; // direktori data
if (!fs.existsSync(dataPath)) {
  // fs.writeFileSync(dataPath, "[]", "utf-8");
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

// Ambil semua data di contact.json
const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

// Cari contact berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.nama.toLowerCase() === nama.toLowerCase()
  );
  return contact;
};

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contact) => {
  fs.writeFileSync("./data/contacts.json", JSON.stringify(contact));
};

// menambahkan data contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// cek nama yang duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

module.exports = { loadContact, findContact, addContact, cekDuplikat };
