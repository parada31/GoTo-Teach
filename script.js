const modalWrapper = document.querySelector('modal-wrapper')
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

//create element and render users
const renderUser = doc => {
  const tr = `
  <tr data-id='${doc.id}'>
    <td>${doc.data().firstName}</td>
    <td>${doc.data().lastName}</td>
    <td>${doc.data().phone}</td>
    <td>${doc.data().email}</td>
    <td>${doc.data().skills}</td>
    <td>${doc.data().location}</td>
    <td> 
      <button class="btn btn-edit">Edit</button>
      <button class="btn btn-delete">Delete</button>
    </td>
  </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  //Click Edit
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.firstName.value = doc.data().firstName;
    editModalForm.lastName.value = doc.data().lastName;
    editModalForm.phone.value = doc.data().phone;
    editModalForm.email.value = doc.data().email;
    editModalForm.skills.value = doc.data().skills;
    editModalForm.location.value = doc.data().location;
  });


  //Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('users').doc(`${doc.id}`).delete().then(() => {
      console.log('Document successfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
});


}

//click add user button
btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show')

  addModalForm.firstName.value = '';
  addModalForm.lastName.value = '';
  addModalForm.phone.value = '';
  addModalForm.email.value = '';
  addModalForm.skills.value = '';
  addModalForm.location.value = '';
});

//user click anwhere outside Modal
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target == editModal) {
    editModal.classList.remove('modal-show');
  }
});

//get all users
//db.collection('users').get().then(querySnapshot => {
  //querySnapshot.forEach(doc => {
    //renderUser(doc);
  //})
//});

//real time listener
db.collection('users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`)
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

//click submit
addModalForm.addEventListener('submit', e=> {
  e.preventDefault();
  db.collection('users').add({
    firstName: addModalForm.firstName.value,
    lastName: addModalForm.lastName.value,
    phone: addModalForm.phone.value,
    email: addModalForm.email.value,
    skills: addModalForm.skills.value,
    location: addModalForm.location.value,
 });
 modalWrapper.classList.remove('modal-show');
})

//Click submit in edit modal

editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('users').doc(id).update({
    firstName: editModalForm.firstName.value,
    lastName: editModalForm.lastName.value,
    phone: editModalForm.phone.value,
    email: editModalForm.email.value,
    skills: editModalForm.skills.value,
    location: editModalForm.location.value,
  });
  editModal.classList.remove('modal-show');

});
