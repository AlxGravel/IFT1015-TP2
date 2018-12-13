function onClick(event) {

    var t = event.target;


    // Attribut id de l'élément sur lequel le clic a été fait
    var id = t.id;

    var b = document.getElementById(id);

    //Si l'id de l'objet cliqué est celui d'une case
    //alors on procède. Sinon rien ne se produit
    if( /\d-\d/.test(id) ) {
            if(b.innerHTML == "") b.innerHTML = "&#10004";
        else b.innerHTML = "";
    }
}
