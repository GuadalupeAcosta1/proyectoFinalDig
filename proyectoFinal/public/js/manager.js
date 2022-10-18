

//var myModal = new bootstrap.Modal(document.getElementById('myModal'))
/*
function showModal() {
    myModal.show()
}
*/



function showModal(id) {
    var myModal = new bootstrap.Modal(document.getElementById(id))
    myModal.show();
}
function hideModal(id) {
    var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
    myModal.hide();
}