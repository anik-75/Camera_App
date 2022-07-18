//create database
//create object store
// transactions
let db;
const openRequest = indexedDB.open('myDB');
openRequest.addEventListener('success',(e)=>{
  db = openRequest.result;
  console.log('success');
})

openRequest.addEventListener('error', (e)=>{
  console.log('error');
})

openRequest.addEventListener('upgradeneeded', (e)=>{
  console.log('upgraded');
  db = openRequest.result;

  db.createObjectStore('video', {keyPath: 'id'});
  db.createObjectStore('image', {keyPath: 'id'});
})

