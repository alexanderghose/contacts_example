var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactsSchema = new Schema({ // comments
    name: String,
    email: String,
    phone: String,
});

const bucketsSchema = new Schema({ // posts
    bucket_name: String,
    contact_frequency_in_days: Number,
    contacts: [contactsSchema]
});

BucketsModel = mongoose.model('Buckets', bucketsSchema);

// will pickup all requests for /buckets
router.get("/", async function (req, res) {
    let my_data = await BucketsModel.find({});
    res.send("this is a list of all the buckets:<br><br>"
        + my_data)
})

router.get("/view_form", function (req, res) {
    //res.send("sending you a form")
    res.render("form.ejs")
})

router.get("/:id", async function (req, res) {
    let html = "hey you requested bucket#" + req.params.id
    html += "<br><br>Database for this model contains:<br><br>"
    let stuff_from_database = await BucketsModel.findById(req.params.id)
    html += stuff_from_database
    html += "<br><br>"
    html += "add a contact below:<br><br>"
    html += "<form action='/buckets/add_contact_form' method='POST'>"
    html += "<input name='contact' placeholder='contact name'>"
    html += "<input name='id' type='hidden' value=" + req.params.id + ">";
    html += "<button>Add contact</button>"
    html += "</form>"
    res.send(html)
})

router.post("/add_contact_form", async function (req, res) {
    console.log(req.body.contact)
    console.log(req.body.id)

    try {
        let row_in_buckets_table = await BucketsModel.findById(req.body.id)
        let contacts_obj = {
            name: req.body.contact,
            email: "",
            phone: "",
        }
        row_in_buckets_table.contacts.push(contacts_obj) // put "mama" in contacts[] array
        let save = await row_in_buckets_table.save()
    } catch (error) {
        console.log("error=" + error)
    }

    res.send("thank you for submitting a contact")
});

router.post("/add", function (req, res) {
    let incoming_data_object = {
        bucket_name: req.body.bucket_name,
        contact_frequency_in_days: req.body.freq
    }
    BucketsModel.create(incoming_data_object)
    res.send("thank you for adding stuff")
})

module.exports = router;