const gatos = [
    {
        nombre: "Sisi",
        descripcion: "Sisi es una gata naranja muy cariñosa y tranquila. Fue la fundadora de nuestro cat café y por eso lleva su nombre: Sisi's Cat Cafe. Le encanta que la acaricien y siempre ronronea cuando alguien lo hace. También disfruta subirse en las personas y acostarse en sus piernas.",
        imagen: "imagenes_gatos/sisi.JPG"
    },
    {
        nombre: "Manchitas",
        descripcion: "Manchitas es una gata muy tranquila y pacífica. Le gusta disfrutar de su propio espacio y dormir una siesta o simplemente relajarse, pero de vez en cuando también disfruta un poco de compañía. No te extrañes si decide acercarse a ti y empieza a frotar su cara contra tu mano. Es su forma de pedir cariño!",
        imagen: "imagenes_gatos/manchitas.JPG"
    },
    {
        nombre: "Luna",
        descripcion: "Luna es una gata muy juguetona... y algo loca. A Luna le cuesta un poco de trabajo encariñarse, pero no dudes que lo hará. Por lo general no le gusta ser acariciada, pero no tiene problemas con ser cargada. Si tienes la oportunidad, no lo dudes! Es una gata muy activa y tiene un fuerte espíritu cazador.",
        imagen: "imagenes_gatos/luna.JPG"
    },
    {
        nombre: "Nube",
        descripcion: "Nube es nuestra gata más jóven. También es la más juguetona y sociable. Nube no dudará en acercarse a ti y subirse a tu regazo, así que, si lo hace, acaríciala y abrázala. Es muy activa y juguetona, disfruta mucho de jugar con sus juguetes y correr por todas partes.",
        imagen: "imagenes_gatos/nube.JPG"
    }
];

let gatoActual = 0;
function mostrarGato(indice){
    document.getElementById("nombre").innerHTML = gatos[indice].nombre;
    document.getElementById("descripcion").innerHTML = gatos[indice].descripcion;
    document.getElementById("imagen-gato").src = gatos[indice].imagen;
}

function cambiarGato(){
    if (gatoActual < 3){
        gatoActual ++;
        mostrarGato(gatoActual);
    }
    else{
        gatoActual = 0;
        mostrarGato(gatoActual);
    }
}

function masInfoAdolfo(){
    document.getElementById("infoAdolfo").innerHTML = "Adolfo Hernández es el dueño de Sisi's Cat Cafe, es el dueño y cuidador de todos los gatos del café y también es el cocinero detrás de todos nuestros deliciosos platillos y exquisitas bebidas. Es un estudiante de Ingeniería en Tecnologías Computacionales en el TEC pero también es un gran apasionado de los gatos y el café.";
}

function masInfoSisi(){
    document.getElementById("infoSisi").innerHTML = "Sisi fue la primera gata de este café, y por esa razón es la fundadora. Es la mayor de todos los gatos de Sisi's Cat Cafe y también la más inteligente. Es una gata naranja, muy amigable y cariñosa, querida por todos los que visitan su cafe."
}