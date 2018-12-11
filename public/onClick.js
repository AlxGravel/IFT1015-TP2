
function onClick(event) {
    // TODO

    /* La variable t contient l'élément HTML sur lequel le clic a été
       fait. Notez qu'il ne s'agit pas forcément d'une case <td> du
       tableau */
    var t = event.target;

    //TODO: target not <td>

    // Attribut id de l'élément sur lequel le clic a été fait
    var id = t.id;

    if(id.innerHTML == "")
	id.innerHTML = "&#10004";
    else
	id.innerHTML = "";

    
}
