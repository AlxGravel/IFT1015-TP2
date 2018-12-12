
var colorToHexa = function(color){
    color = Math.floor(color * 255);
    color = color.toString(16);
    if(color.length == 1)
	color = "0" + color;

    return color;

};

// Génère la `i`ème couleur parmi un nombre total `total` au format
// hexadécimal HTML
//
// Notez que pour un grand nombre de couleurs (ex.: 250), générer
// toutes les couleurs et les afficher devrait donner un joli dégradé qui
// commence en rouge, qui passe par toutes les autres couleurs et qui
// revient à rouge.
var genColor = function(i, nbTotal) {
    // TODO
    
    var teinte = (i/nbTotal) * 360;
    var h = teinte/60;
    var c = 0.7;
    var x = c*(1-Math.abs(h%2-1));

    var hexaC = colorToHexa(c);
    var hexaX = colorToHexa(x);

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
