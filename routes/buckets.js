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
    image_url: String,
    contacts: [contactsSchema]
});

BucketsModel = mongoose.model('Buckets', bucketsSchema);

// will pickup all requests for /buckets
router.get("/", async function (req, res) {
    let my_data = await BucketsModel.find({});

    var html = ""
    my_data.forEach(function(db_item) {
        console.log(db_item)
        html += "~~Bucket Name: " + db_item.bucket_name + "~~<br>"
        html += "Frequency: " + db_item.contact_frequency_in_days + "<br>"
        html += "<img style='width:100px' src='" + db_item.image_url + "'>"
        html += "<br>"
        html += "<a href='/buckets/" + db_item._id + "'>Details</a><br><br>"
    })
    res.send(html)
})

router.get("/view_form", function (req, res) {
    //res.send("sending you a form")
    res.render("form.ejs")
})

router.get("/:id", async function (req, res) {
    let stuff_from_database = await BucketsModel.findById(req.params.id)
    let html = "<center>Bucket: " + stuff_from_database.bucket_name + "</center><br>";
    html += "<center><img style='width:100px' src='" + stuff_from_database.image_url + "'></center>"
    html += "<br>Contact Frequency: Each " + stuff_from_database.contact_frequency_in_days  + " days<br><br>"
    //html += stuff_from_database.contacts + "<br><br>"
    html+= "<u>Contacts:</u><br>"
    stuff_from_database.contacts.forEach(function(element) {
        html+= "--Name: " + element.name + "<br>"
        html+= "--Email: " + element.email + "<br>"
        html+= "--Phone: " + element.phone + "<br><br>"
    })
    html += "<br><br>"
    html += "Add more contact below:<br><br>"
    html += "<form action='/buckets/add_contact_form' method='POST'>"
    html += "<input name='contact' placeholder='contact name'><br>"
    html += "<input name='email' placeholder='contact email'><br>"
    html += "<input name='phone' placeholder='contact phone'><br>"
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
            email: req.body.email,
            phone: req.body.phone,
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
        contact_frequency_in_days: req.body.freq,
        image_url: req.body.image_url,
    }
    BucketsModel.create(incoming_data_object)
    res.send("thank you for adding stuff")
})

module.exports = router;