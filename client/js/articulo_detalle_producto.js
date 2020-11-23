"use strict";

// NodeList con imágenes secundarias.
let listadoImagenes = document.querySelectorAll(".img-detalle-articulo .img-secundarias .img");
// Imagen principal de detalle producto
let imagenPrincipal = document.querySelector("#img-principal");

/**
 * 
 * Carga de detalle del producto.
 * 
 **/
// Traigo el artículo según la url.
let articulo
async function load() {
    try {
        let params = processParams();
        const URL = `/stock/${params["categoria"]}/${params["index"]}`;
        let response = await fetch(URL);
        if (response.ok) {
            articulo = await response.json();
            imagenPrincipal.src = articulo.imagenes[0];

            for (let i = 0; i < articulo.imagenes.length; i++) {
                cargarImagenes(i, articulo.imagenes[i]);
            }
            document.querySelector("#nombre-articulo").textContent = articulo.nombre;
            document.querySelector("#precio-articulo").textContent = `$${articulo.precio}`;
            document.querySelector("#financiacion-articulo").textContent = articulo.financiacion;
            document.querySelector("#descripcion-articulo").textContent = articulo.detalle;

        } else {
            console.log("Error - Failed URL!");
        }
    }
    catch (response) {
        console.log("Connection error", response);
    }
}

// Inserto el src a cada imagen segundaria.
function cargarImagenes(i, imagen) {
    if (imagen != null) {
        listadoImagenes[i].src = imagen;
    } else {
        listadoImagenes[i].src = '';
    }
}

/**
 * 
 * Carga de las secciones (Recomendados - Quienes vieron este producto también compraron).
 * 
 **/
// Traigo los artículos según la categoría.
async function cargarArticulos(categoria) {
    const URL = `/stock/${categoria}`;
    try {
        let response = await fetch(URL);
        if (response.ok) {
            let listadoArticulos = await response.json();
            cargarCategoria(listadoArticulos, categoria);
        }

    } catch (response) {
        console.log("Error en la conexión", response);
    }
}

/**
 * 
 * Carga según el click la imagen principal.
 * 
 **/
//comparo el src de la imagen con el href de la página si no es igual permito que cambie la imagen.
listadoImagenes.forEach(img => {
    img.addEventListener('click', function (e) {
        e.preventDefault();
        if (img.src != window.location.href) {
            imagenPrincipal.src = img.src
        }
    });
});

// agrego el login si el usuario decide comprar un articulo
let btnCompra = document.querySelector(".btn-comprar");
btnCompra.addEventListener("click",redireccionar);

//>>>>>>> para comprar controlo que ya este logueado
function redireccionar(){
    if (!window.sessionStorage.getItem("userLogged")) {
        window.location="http://localhost:3000/html/loginUser.html";
    } 
    else{
        agregarProductoCarrito();
        window.location="http://localhost:3000/html/carrito.html"
    }
}


  function agregarProducto () {
    console.log ("HolaAgregarProducto" + articulo.nombre)
  }
let btnAgregar = document.getElementById("btnCarrito");
btnAgregar.addEventListener("click", agregarProductoCarrito);

async function agregarProductoCarrito() {
    console.log("Funcion Agregar");
    if (!window.sessionStorage.getItem("userLogged")) {
        window.location="http://localhost:3000/html/loginUser.html";
    } else {

       /* let producto = {
        "producto_nombre": producto,
        "precio": precio
    } */
//---> aca aparece un error cuando el usuario ya esta logueado
    let respuesta = await fetch("http://localhost:3000/carrito", {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
    });

    if (respuesta.ok) {
        /* compras.push(renglon);
        mostrarTablaCompras(); */

    } else {
        console.log("error");
    }
}

}

cargarArticulos("deportes");
cargarArticulos("electrodomesticos");
load();