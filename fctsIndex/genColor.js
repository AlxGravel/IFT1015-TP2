//converti une couleur du format 0à1 vers hexadécimal HTML
var colorToHexa = function(color){
    color = Math.floor(color * 255);//conversion decimale
    color = color.toString(16);//conversion hexadecimale

    if(color.length == 1)//ajout d'un 0 si nécessaire
        color = "0" + color;

    return color;
};

// Génère la `i`ème couleur parmi un nombre total `total` au format
// hexadécimal HTML
var genColor = function(i, nbTotal) {

    //application de la formule de l'énoncé
    var teinte = (i/nbTotal) * 360;
    var h = teinte/60;
    var c = 0.7;
    var x = c*(1-Math.abs(h%2-1));

    //conversion au format hexadécimal HTML
    var hexaC = colorToHexa(c);
    var hexaX = colorToHexa(x);

    //retour dans l'ordre fourni dans l'énoncé
    switch(Math.floor(h)){
        case 0:return "#" + hexaC + hexaX + "00";
        case 1:return "#" + hexaX + hexaC + "00";
        case 2:return "#" + "00" + hexaC + hexaX;
        case 3:return "#" + "00" + hexaX + hexaC;
        case 4:return "#" + hexaX + "00" + hexaC;
        case 5:return "#" + hexaC + "00" + hexaX;
        default:return "#000000";
    }
};
