const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    nombre: String,
    numero: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Contacs = mongoose.model('Contacs', contactSchema);

module.exports = Contacs;