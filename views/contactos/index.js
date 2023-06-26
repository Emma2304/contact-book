const nameInput = document.querySelector('#name-input');
const numberInput = document.querySelector('#number-input');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const botonAgg = document.querySelector('.btn-agregar-tareas');
const botonEdit = document.querySelector('.check-btn');


//Regex
const NAME_REGEX = /^[A-Za-z ]*$/;
const TLF_REGEX = /^([0]{1})([2,4]{1})([1,2]{1})([2,4,6]{1})([0-9]{7})$/;

//gender
let gender = '';

// Validations
let nameValidation = false;
let numberValidation = false;

const validation = (regexValidation, input) => {
    botonAgg.disabled = nameValidation && numberValidation ? false : true;

    if (input.value === '') {
        input.classList.remove('wrong');
        input.classList.remove('correct');
        input.parentElement.children[2].classList.remove('display-text');
        botonAgg.disabled = true
    } else if (regexValidation) {
        input.classList.remove('wrong');
        input.classList.add('correct');
        input.parentElement.children[2].classList.remove('display-text');
        botonAgg.disabled = false
    } else if (!regexValidation) {
        input.classList.add('wrong');
        input.classList.remove('correct');
        input.parentElement.children[2].classList.add('display-text');
        botonAgg.disabled = true
    }
};

// Events
nameInput.addEventListener('input', e => {
    const nameValidation = NAME_REGEX.test(e.target.value);
    validation(nameValidation, nameInput);
});

numberInput.addEventListener('input', e => {
    const numberValidation = TLF_REGEX.test(e.target.value);
    validation(numberValidation, numberInput);
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    const newPerson = {
        name: nameInput.value,
        number: numberInput.value,
    }
    // Create list item
    const { data } = await axios.post('/api/contactos', {
        nombre: newPerson.name, numero: newPerson.number
    });

    const listItem = document.createElement('li');
    listItem.id = data.id;
    listItem.innerHTML = `
    <li class= "li">
        <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        </button>
        <span>${data.nombre}</span>
        <input id="input-contact" type="text" value="${data.numero}"readonly autocomplete="off">
        <button class="check-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edittt">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        </button>
    </li>
    `;

    list.append(listItem);

    nameInput.value = ''
    numberInput.value = ''
    nameInput.classList.remove('correct');
    numberInput.classList.remove('correct');
    botonAgg.disabled = true
});

list.addEventListener('click', async e => {
    // Select delete-btn
    if (e.target.closest('.delete-btn')) {
        const li = e.target.closest('.delete-btn').parentElement.parentElement;
        await axios.delete(`/api/contactos/${li.id}`);
        li.remove();
    }

    // Select check-btn
    try {
        if (e.target.classList.contains('check-btn')) {
            const editBtn = e.target.closest('.li').children[2];
            if (editBtn.hasAttribute('readonly')) {
                editBtn.removeAttribute('readonly');
            } else {
                const listItem = e.target.closest('li').parentElement;
                const numero = editBtn.value;
                await axios.patch(`/api/contactos/${listItem.id}`, { numero });
                editBtn.setAttribute('readonly', true);
            }
        }
    } catch (error) {
        console.log(error);
    }
});

(async () => {
    try {
        const { data } = await axios.get('/api/contactos', {
            withCredentials: true
        });
        data.forEach(contact => {
            const listItem = document.createElement('li');
            listItem.id = contact.id;
            listItem.innerHTML = `
            <li class= "li">
                <button class="delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </button>
                <span>${contact.nombre}</span>
                <input id="input-contact" type="text" value="${contact.numero}"readonly autocomplete="off">
                    <button class="check-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edittt">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
            </li>
            `;
            list.append(listItem);

            nameInput.value = ''
            numberInput.value = ''
        });
    } catch (error) {
        window.location.pathname = '/login'
    }
})();