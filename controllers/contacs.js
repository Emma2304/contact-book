const contacsRouter = require('express').Router();
const User = require('../models/user');
const Contacs = require('../models/contac');

contacsRouter.get('/', async (request, response) => {
    const user = request.user;
    const contact = await Contacs.find({ user: user.id });
    return response.status(200).json(contact);
});

contacsRouter.post('/', async (request, response) => {
    const user = request.user;
    const { nombre } = request.body;
    const { numero } = request.body;
    const newContacs = new Contacs({
        nombre,
        numero,
        user: user._id
    });
    const savedContact = await newContacs.save();
    user.contactos = user.contactos.concat(savedContact._id);
    await user.save();

    return response.status(201).json(savedContact);
});

contacsRouter.delete('/:id', async (request, response) => {
    const user = request.user;

    await Contacs.findByIdAndDelete(request.params.id);

    user.contactos = user.contactos.filter(id => id.toString() !== request.params.id);

    await user.save();
    return response.sendStatus(204);
});

contacsRouter.patch('/:id', async (request, response) => {
    const user = request.user;

    const numero = request.body;

    await Contacs.findByIdAndUpdate(request.params.id, numero);

    return response.sendStatus(200);
});

module.exports = contacsRouter;
