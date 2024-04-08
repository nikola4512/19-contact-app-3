const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const {
  loadContact,
  findContact,
  addContact,
  cekDuplikat,
} = require("./utils/contacts.js");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// Gunakan ejs
app.set("view engine", "ejs"); // default view engine

// Third party middleware
app.use(expressLayouts); // mengompress pengkodean ejs
// Build-in middleware (express)
app.use(express.static("public"));
// Build-in middleware (express)
app.use(express.urlencoded());
// app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  // res.sendFile("./index.html", { root: __dirname });
  const mahasiswa = [
    {
      nama: "Nikola Arinanda",
      email: "nikolaarinanda@gmail.com",
    },
    {
      nama: "Rendro Elfino",
      email: "rendroelfino@gmail.com",
    },
    {
      nama: "Rangga Aditya",
      email: "ranggaaditya@gmail.com",
    },
  ];

  // index => halaman yg ingin disematkan (relative terhadap folder views)
  res.render("index", {
    layout: "layouts/main-layout",
    title: "Halaman Utama",
    mahasiswa, // => mahasiswa: mahasiswa,
  });
});

// parameter pertama adalah page yg ingin dibuka
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman Tentang",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  // template halaman
  res.render("contact", {
    title: "Halaman Kontak", // judul halaman
    layout: "layouts/main-layout", // halaman utama dimana template disematkan (relative terhadap folder views)
    contacts, // contacts: contacts (JSON),
    msg: req.flash("msg"),
  });
});

// Halaman form tambah data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

// proses data contact
app.post(
  "/contact",
  check("nama").custom((value) => {
    const duplikat = cekDuplikat(value);
    if (duplikat) {
      throw new Error("Nama sudah digunakan!");
    }
  }),
  check("email", "Email tidak valid!").isEmail(),
  check("nohp", "No HP tidak valid!").isMobilePhone("id-ID"),
  (req, res) => {
    const result = validationResult(req);
    const errors = result.array();
    console.log(errors);
    // if (!result.isEmpty()) {
    if (errors[0].msg !== "Invalid value") {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
        errors,
      });
    } else {
      addContact(req.body);
      // kirimkan flash message
      req.flash("msg", "Data contact berhasil ditambahkan!");
      res.redirect("/contact"); // /redirect() = GET
    }
    // }
  }
);

// Halaman detail contact
app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  res.render("detail", {
    title: "Halaman Detail Contact",
    layout: "layouts/main-layout",
    // contacts: contacts,
    contact,
  });
});

//  mengatur routing yg lain (misal 404 error)
app.use("/", (req, res) => {
  res.status(404); // menjadikan status request 404
  res.send("<h1>404 ERROR!</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
