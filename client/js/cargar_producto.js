"use strict";


//Paso el listado de artículos dependiendo de cada categoría.
function pasarArreglo(listadoArticulos) {
    cargarCategoria(listadoArticulos.tecnologia, "tecnologia");
    cargarCategoria(listadoArticulos.electrodomesticos, "electrodomesticos");
    cargarCategoria(listadoArticulos.deportes, "deportes");
}

// Le paso los valores a la función "mostrarDatosHtml" para que los inserte en los elementos html.
function cargarCategoria(jsonConArticulos, categoria) {
    const LIMIT_ARTICULOS = 5;
    for (let i = 0; i < LIMIT_ARTICULOS; i++) {
        mostrarDatosHtml(i, jsonConArticulos[i].nombre, "nombre", categoria);
        mostrarDatosHtml(i, jsonConArticulos[i].imagen_articulo[0].imagen, "img", categoria, true);
        mostrarDatosHtml(i, `$${jsonConArticulos[i].precio}`, "precio", categoria);
        mostrarDatosHtml(i, jsonConArticulos[i].financiacion, "financiacion", categoria);
        cargarHref(categoria, i, jsonConArticulos[i].idArticulo);
    }
}

// Inserto los valores en cada elemento del html.
function mostrarDatosHtml(indice, valor, tipo, categoria, esImagen = undefined) {
    if (!esImagen) {
        let articulo = document.querySelectorAll(`.articulo .${tipo}-articulo-${categoria}`);
        articulo[indice].textContent = valor;
    } else {
        let articulo = document.querySelectorAll(`.articulo .${tipo}-articulo-${categoria}`);
        articulo[indice].src = valor;
        articulo[indice].alt = valor;
    }
}

// Le agrego el href a cada botón
function cargarHref(categoria, index, idArticulo) {
    let btn = document.querySelectorAll(`.articulo .button-articulo-${categoria}`);
    btn[index].href = `http://tp-forhome.herokuapp.com/html/detalle_producto.html?categoria=${categoria}&index=${idArticulo}`;
}

