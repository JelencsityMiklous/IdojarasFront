let idojaras =  []
let editMode = false;

/*--Dátum--*/
function setDate() {
    let today = new Date().toISOString().split('T')[0];
    let dateField = document.getElementById("dateField");
    dateField.setAttribute('max', today);
}
0
/*--Hozzáadás--*/
async function add(){
    let date = document.querySelector('#dateField').value;
    let idojarasAdat = document.querySelector('#idojarasField').value;

    if (date == '' || idojarasAdat == ''){
        showMessage('danger', 'Hiba', 'Nem adtál meg minden adatot!'); 
        return;
    }
    
    let idx = idojaras.findIndex(idojaras => idojaras.date == date && idojaras.userId == loggedUser.id);
    if (idx == -1){
        
        try{
            let res = await fetch(`${ServerURL}/idojaras` , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({  
                    userId: loggedUser.id, 
                    date: date, 
                    idojarasAdat: idojarasAdat 
                })
            });
            let data = await res.json();
            if (res.status == 200){
                showMessage('success', 'Ok', data.msg); 
                await getIdojaras();
                await renderIdojaras();
                cancel();
            }else{
                showMessage('danger', 'Hiba', data.msg); 
            }
        }catch(err){
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok küldése során!1'); 
        }
    }else{
        
        try{
            let res = await fetch(`${ServerURL}/idojaras/${idojaras[idx].id}` , {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({  
                    userId: loggedUser.id, 
                    date: date, 
                    idojarasAdat: Number(idojaras[idx].idojarasAdat) + Number(idojarasAdat) 
                })
            });
            let data = await res.json();
            if (res.status == 200){
                showMessage('success', 'Ok', data.msg); 
                await getIdojaras();
                await renderIdojaras();
                cancel();
            }else{
                showMessage('danger', 'Hiba', data.msg); 
            }
        }catch(err){
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok küldése során!2'); 
        }
    }
}

/*--Adatok lekérdezése--*/

async function getIdojaras() {
    try{
        let res = await fetch(`${ServerURL}/idojaras/users/${loggedUser.id}`);
        idojaras = await res.json();
        idojaras = idojaras.sort((a,b) => new Date(b.date) - new Date(a.date));
    }catch(err){
        console.log(err);
        showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során!'); 
    }
}

/*--Adatok betöltése--*/
function renderIdojaras() {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    idojaras.forEach((idojaras, index) => {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let editBtn = document.createElement('button');
        let deleteBtn = document.createElement('button');

        editBtn.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm');

        editBtn.setAttribute('onclick', `editIdojaras(${index})`);
        deleteBtn.setAttribute('onclick', `deleteIdojaras(${index})`);

        editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>'
        deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>'

        td1.innerHTML = (index + 1) + '.';
        td2.innerHTML = idojaras.date;
        td3.innerHTML = idojaras.idojarasAdat;
        td4.appendChild(editBtn);
        td4.appendChild(deleteBtn);

        td1.classList.add('text-center');
        td3.classList.add('text-end');
        td4.classList.add('text-end');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tbody.appendChild(tr);

    });

}

async function update() {

    let date = document.getElementById("dateField");
    let idojarasAdat = document.getElementById("idojarasField");

    if (selectedIdojaras.date == date.value) {
        try {
            let res = await fetch(`${ServerURL}/idojaras/${selectedIdojaras.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newDate: date.value,
                    newCount: Number(idojarasAdat.value)
                })
            });
            let data = await res.json();
            if (res.status == 200) {
                showMessage('success', 'Ok', data.msg);
                await getIdojaras();
                renderIdojaras();
            } else {
                showMessage('danger', 'Hiba', data.msg);
            }
        } catch (err) {
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során');
        }
    } else {
        try {
            let res = await fetch(`${ServerURL}/idojaras/${selectedIdojaras.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            if (res.status == 200) {
                showMessage('success', 'Ok', data.msg);
                await getIdojaras();
                cancel();
                renderIdojaras();
            } else {
                showMessage('danger', 'Hiba', data.msg);
            }
        } catch (err) {
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok törlése során');
        }

        let idx = idojaras.findIndex(idojaras => idojaras.date == date && idojaras.uid == loggedUser.id);
        if (idx == -1) {
            
            try {
                let res = await fetch(`${ServerURL}/idojaras/upload/${loggedUser.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        date: date.value,
                        count: Number(idojaras.value)
                    })
                });
                let data = await res.json();
                if (res.status == 200) {
                    showMessage('success', 'Ok', data.msg);
                    await getIdojaras();
                    cancel();
                    renderIdojaras();
                } else {
                    showMessage('danger', 'Hiba', data.msg);
                }
            } catch (err) {
                console.log(err);
                showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során');
            }
        } else {
            
            try {
                let res = await fetch(`${ServerURL}/idojaras/${idojaras[idx].id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        newDate: date.value,
                        newCount: Number(idojaras.value)
                    })
                });
                let data = await res.json();
                if (res.status == 200) {
                    showMessage('success', 'Ok', data.msg);
                    await getIdojaras();
                    renderIdojaras();
                } else {
                    showMessage('danger', 'Hiba', data.msg);
                }
            } catch (err) {
                console.log(err);
                showMessage('danger', 'Hiba', 'Hiba az adatok lekérdezése során');
            }
        }
    }
    
}


async function del() {
    let idx = idojaras.findIndex(idojaras => idojaras.id == selectedIdojaras.id)
    await deleteIdojaras(idx);
}

function editIdojaras(index) {
    let date = document.getElementById("dateField");
    let idojarasAdat = document.getElementById("idojarasField");


    toggleMode(true);
    date.value = idojaras[index].date;
    idojarasAdat.value = idojaras[index].idojarasAdat
    selectedIdojaras = idojaras[index];
}

async function deleteIdojaras(index) {
    console.log(index);
    if (confirm('Biztosan törlöd az időjárás adatot?')) {
        try {
            let res = await fetch(`${ServerURL}/idojaras/${idojaras[index].id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let data = await res.json();
            if (res.status == 200) {
                showMessage('success', 'Ok', data.msg);
                await getIdojaras();
                cancel();
                renderIdojaras();
            } else {
                showMessage('danger', 'Hiba', data.msg);
            }
        } catch (err) {
            console.log(err);
            showMessage('danger', 'Hiba', 'Hiba az adatok törlése során');
        }
    }
}

function cancel() {
    toggleMode(false);
    let date = document.querySelector("#dateField");
    let idojarasAdat = document.querySelector("#idojarasField");
    date.value = null;
    idojarasAdat.value = null;
    selectedIdojaras= null;
}

function toggleMode(mode) {
    let addBtn = document.getElementById('addBtn');
    let editBtn = document.getElementById('updateBtn');
    let delBtn = document.getElementById('delBtn');
    let cancelBtn = document.getElementById('cancelBtn');
    
    if (mode) {
        addBtn.classList.add('hide');
        editBtn.classList.remove('hide');
        delBtn.classList.remove('hide');
        cancelBtn.classList.remove('hide');
    } else {
        addBtn.classList.remove('hide');
        editBtn.classList.add('hide');
        delBtn.classList.add('hide');
        cancelBtn.classList.add('hide');
    }
}