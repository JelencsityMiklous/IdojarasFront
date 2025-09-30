/*RegExp*/ 
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Regisztráció */
async function registration() {

    let nameField = document.getElementById('nameField');
    let emailField = document.getElementById('emailField');
    let passwordField = document.getElementById('passwordField');
    let confirmField = document.getElementById('confirmPasswordField');


    if (nameField.value == '' || passwordField.value == '' || emailField.value == '' || confirmField.value == '') {
        showMessage('danger','Hiba','Nem adtál meg minden adatot!');
        return;
    }

    if (passwordField.value != confirmField.value) {
        showMessage('danger','Hiba','A két jelszó nem egyezik!');
        return;
    }

    if (!passwdRegExp.test(passwordField.value)) {
        showMessage('danger','Hiba','A megadott jelszó nem elég biztonságos!');
        return;
    }

    if (!emailRegExp.test(emailField.value)) {
        showMessage('danger','Hiba','Nem megfelelő e-mail cím!');
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameField.value,
                email: emailField.value,
                password: passwordField.value
            })
        });

        const data = await res.json();
        showMessage('info','Siker', data.msg);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
            passwordField.value = "";
            confirmField.value = "";
        }
    } catch (err) {
        showMessage('danger','Hiba', err);
    }
}

/* Bejelentkezés */

async function login() {
    let emailField = document.getElementById('emailField');
    let passwordField = document.getElementById('passwordField');
    if (passwordField.value == '' || emailField.value == '') {
        showMessage('danger','Hiba','Nem adtál meg minden adatot!');
        return;
    }

    let user = {};

    try {
        const res = await fetch(`${ServerURL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value
            })
        });

        user = await res.json();

        if (user.id) {
            loggedUser = user;
        }

        if (!loggedUser) {
            showMessage('danger', 'Hiba', 'Hibás belépési adatok!');
            return;
        }

        sessionStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        getLoggedUser();
        showMessage('success', 'Ok', 'Sikeres bejelentkezés');
    } catch (err) {
        showMessage('danger','Hiba', err);
    }

}

/* Kilépés */

function logout() {
    sessionStorage.removeItem('loggedUser');
    getLoggedUser();
}

/* Profil lekérdezése */

async function getProfile() {
    const nameField = document.getElementById('nameField');
    const emailField = document.getElementById('emailField');

    try {
        const res = await fetch(`${ServerURL}/users/${loggedUser.id}`);
        const user = await res.json();
        console.log(user)
        nameField.value = user.name;
        emailField.value = user.email;
    } catch (error) {
        showMessage('danger','Hiba', err);
    }

}

/* Profil módosítása */

async function updateProfile() {
    let nameField = document.getElementById('nameField');
    let emailField = document.getElementById('emailField');

    if (nameField.value == '' || emailField.value == '') {
        showMessage('danger', 'Hiba', 'Nem adtál meg minden adatot!');
        return;
    }

    if (!emailRegExp.test(emailField.value)) {
        showMessage('danger', 'Hiba', 'Nem megfelelő e-mail cím!');
        return;
    }

    try {
        const res = await fetch(`${ServerURL}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loggedUser.id,
                email: emailField.value,
                name: nameField.value
            })
        });

        const data = await res.json();
        showMessage('info', 'Siker', data.msg);
        if (res.status == 200) {
            nameField.value = "";
            emailField.value = "";
        }
    } catch (err) {
        showMessage('danger', 'Hiba', err);
    }
    alert('Sikeresen megváltoztattad')
    getLoggedUser();
}

/* Jelszó módosítása */

async function updatePassword() {
    const currentPasswordField = document.querySelector('#currentPasswordField');
    const newPasswordField = document.querySelector('#newPasswordField');
    const confirmPasswordField = document.querySelector('#newPasswordConfirmField');

    if (!currentPasswordField || !newPasswordField || !confirmPasswordField) {
        showMessage('danger', 'Hiba', 'Nem találhatóak a mezők!');
        return;
    }

    if (
        currentPasswordField.value.trim() === '' ||
        newPasswordField.value.trim() === '' ||
        confirmPasswordField.value.trim() === ''
    ) {
        showMessage('danger', 'Hiba', 'Nem adtál meg minden adatot!');
        return;
    }

    if (newPasswordField.value !== confirmPasswordField.value) {
        showMessage('danger', 'Hiba', 'A két jelszó nem egyezik!');
        return;
    }

    if (!passwdRegExp.test(newPasswordField.value)) {
        showMessage('danger', 'Hiba', 'A megadott jelszó nem elég biztonságos!');
        return;
    }

    try {
        const response = await fetch(`${ServerURL}/users/passmod`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: loggedUser.id,
                oldPass: currentPasswordField.value,
                newPass: newPasswordField.value
            })            
        });

        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Backend válasz:", data);

        if (response.status === 200) {
            showMessage('success', 'Siker', data.msg || 'Jelszó sikeresen megváltoztatva');
        } else {
            showMessage('danger', 'Hiba', data.msg || 'Sikertelen jelszó módosítás');
        }

    } catch (err) {
        console.error("Hiba:", err);
        showMessage('danger', 'Hiba', err.message || 'Ismeretlen hiba történt!');
    }
}


