const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

const Contact = require('../models/contact');

//function to return error
function returnError(res, error) {
  res.status(500).json({
    message: 'An error occurred',
    error: error
  });
}

//GET route for contacts
router.get('/', (req, res, next) => {
  //find all contacts, populate the group
  Contact.find()
    .populate('group')
    .then(contacts => {
      //send successful response
      res.status(200).json({
        message: 'Contacts fetched successfully',
        contacts: contacts
      });
    })
    .catch(error => {
      //return error response
      returnError(res, error);
    });
}
);

//GET route to get a single contact by id
router.get('/:id', (req, res, next) => {
  //find specific contact
  Contact.findOne({
    //retrieve id from params
    "id": req.params.id
  })
    //populate
    .populate('group')
    .then(contact => {
      res.status(200).json(
        contact
      );
    })
    .catch(error => {
      returnError(res, error);
    })
})

//POST route for adding contact
router.post('/', (req, res, next) => {
  //get unique id for adding new contact
  const maxContactId = sequenceGenerator.nextId("contacts");

  //create new contact with info from request
  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
    group: req.body.group
  });

  //MAP/REPLACE contacts in group contact with only their primary key value
  //if there is something in the group array...
  if (contact.group && contact.group.length > 0) {
    //loop through all the group
    for (let groupContact of contact.group) {
      //assign only the id to the group contact
      groupContact = groupContact._id;
    }
  }

  //save to database
  contact.save()
    .then(createdContact => {
      //send succesful response
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      //send error response
      returnError(res, error);
    });
});

//PUT route to update a single contact
router.put('/:id', (req, res, next) => {
  //find specific contact
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      //modify fields with what comes from req
      contact.name = req.body.name;
      contact.description = req.body.description;
      contact.url = req.body.url;

      //update specific one
      Contact.updateOne({ id: req.params.id }, contact)
        .then(result => {
          //send successful response
          res.status(204).json({
            message: 'Contact updated successfully'
          })
        })
        .catch(error => {
          //send error response
          returnError(res, error);
        });
    })
    .catch(error => {
      //send not found response
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' }
      });
    });
});

//DELETE route for contacts
router.delete("/:id", (req, res, next) => {
  //find specific contacct by id
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      //delete specific comtact by id
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          //send successful rsponse
          res.status(204).json({ message: "Contact deleted successfully" });
        })
        .catch(error => {
          //send error response
          returnError(res, error);
        })
    })
    .catch(error => {
      //send error response
      returnError(res, error);
    });
});

//export router
module.exports = router;
