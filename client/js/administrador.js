'use strict';

let produc = "tp-forhome.herokuapp.com";

let tbody_detalle_tabla = document.querySelector("#detalle-tabla");
let btn_dropdown = document.querySelector("#dropdownMenuButton");
let btn_agregar_modificar = document.querySelector('.btn-agregar-modificar');
let posicion = document.querySelector('#posicion');

// Arreglo global de articulos.
let listaArticulos = [];

let secureUrlImg = [];

/* //////////////
   Cargar tabla
//////////////*/

document.querySelectorAll('.nav-item .dropdown-item').forEach(categoria => {
    categoria.addEventListener('click', function () {
        cargarDatos(categoria.id);
    });
});

document.querySelectorAll('.form-carga-articulo .categotias-cargar-articulo .dropdown-item').forEach(categoria => {
    categoria.addEventListener('click', function () {
        btn_dropdown.textContent = categoria.textContent;
        btn_dropdown.dataset.categoria = categoria.dataset.categoria;
    });
});

// Traigo los articulos del Back End y los inserto en arreglo global.
async function cargarDatos(categoria) {
    let mensaje = document.querySelector('#mensaje');
    const URL = `/articulo/${categoria}`;
    try {
        let response = await fetch(URL);
        if (response.ok) {
            let articulos = await response.json();
            cargarArregloConArticulos(articulos, categoria);
        } else {
            tbody_detalle_tabla.innerHTML = '';
            mensaje.innerHTML = "No hay registros cargados para esa categoría."
        }
    } catch (response) {
        console.log("Error en la conexión", response);
    }
}

function cargarArregloConArticulos(articulos, categoria) {
    listaArticulos = [];
    for (let i = 0; i < articulos.length; i++) {
        listaArticulos.push(articulos[i]);
    }
    cargarHTML(categoria);
}

//Cargo la tabla con los articulos.
function cargarHTML(categoria) {
    let html = "";
    for (let i = 0; i < listaArticulos.length; i++) {
        html += `
        <tr>
        <th><input class="text-center" type="text" value="${listaArticulos[i].stock}" id="stock${i}"></th>
        <td><input type="text" value="${listaArticulos[i].nombre}" id="nombre${i}"></td>
        <td><input class="text-center" type="text" value="${listaArticulos[i].precio}" id="precio${i}"></td>
        <td><input class="text-center" type="text" value="${listaArticulos[i].financiacion}" id="financiacion${i}"></td>
        <td><input type="text" value="${listaArticulos[i].detalle}" id="detalle${i}"></input></td>
        <td><input type="text" value="${listaArticulos[i].tipo}" id="tipo${i}"></td>
        <td class="img${i}" style="display: flex;align-items: center; justify-content: center;"><img src="${listaArticulos[i].imagen_articulo[0].imagen}" alt=""></td>
        <td><button class="btn-delete-articulo" pos="${i}" id=${listaArticulos[i].idArticulo} data-categoria="${categoria}"><ion-icon name="close-circle-outline"></ion-icon></button></td>
        <td><button class="btn-update-articulo" pos="${i}" id=${listaArticulos[i].idArticulo} data-categoria="${categoria}"><ion-icon name="sync-circle-outline"></ion-icon></button></td>
        </tr>
        `
    }
    mensaje.innerHTML = '';
    tbody_detalle_tabla.innerHTML = html;
    comportamientoBtn(".btn-delete-articulo", btnBorrarClick);
    comportamientoBtn(".btn-update-articulo", traerArticuloPorId);
}

function arregloImg() {
    let arrImagenes = [];
    let listaNodosImg = document.querySelectorAll('.preview img');
    for (let i = 0; i < listaNodosImg.length; i++) {
        if (listaNodosImg[i].src != "") {
            // if (listaNodosImg[i].src != '') {
            //     if (/blob/.test(listaNodosImg[i].src)) {
            //         arrImagenes.push(secureUrlImg);
            //     } else {
            //         arrImagenes.push(listaNodosImg[i].src);
            //     }
            // }
            arrImagenes.push(listaNodosImg[i].src);
        }
    }

    return arrImagenes;
}

/* //////////////
  Botones 
//////////////*/

function comportamientoBtn(btnClass, fn) {
    let botones = document.querySelectorAll(btnClass);
    botones.forEach(boton => {
        boton.addEventListener("click", fn);
    });
}

async function btnBorrarClick() {
    let response = await fetch(`/articulo/${this.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        cargarDatos(this.dataset.categoria);
    } else {
        console.log("No se pudo borrar");
    }
 }

function pasarImgPopUp(arrImagenes) {
    let listaNodosImg = document.querySelectorAll('.preview img');
    for (let i = 0; i < arrImagenes.length; i++) {
        if (arrImagenes[i].imagen != "http://localhost:3000/html/null") {
            listaNodosImg[i].src = arrImagenes[i].imagen;
        }
    }
}

async function traerArticuloPorId() {
    let categoria = this.dataset.categoria;
    let idArticulo = Number(this.id);
    try {
        let response = await fetch(`/articulo/${categoria}/${idArticulo}`);
        if (response.ok) {
            let articulo = await response.json();
            cargarPopUp(articulo, categoria, idArticulo);
        }
    } catch (response) {
        console.log("Error en la conexión", response);
    }
}

function cargarPopUp(articulo, categoria, idArticulo) {
    //posicion.value = this.getAttribute("pos");
    //let pos = Number(posicion.value);
    btn_dropdown.textContent = categoria;
    btn_agregar_modificar.id = idArticulo;
    document.querySelector('.contenedor-cargar-articulo').classList.toggle('activo');
    btn_agregar_modificar.classList.toggle('disabled');
    btn_agregar_articulo.classList.add('disabled');
    
    document.querySelector(`.form-group #nombre`).value = articulo.nombre;
    document.querySelector(`.form-group #precio`).value = articulo.precio;
    document.querySelector(`.form-group #financiacion`).value = articulo.financiacion;
    document.querySelector(`.form-group #detalle`).value = articulo.detalle;
    document.querySelector(`.form-group #tipo`).value = articulo.tipo;
    document.querySelector(`.form-group #stock`).value = articulo.stock;
    pasarImgPopUp(articulo.imagen_articulo);
}

btn_agregar_modificar.addEventListener('click', async function btnActualizarClick() {
    let id = btn_agregar_modificar.id;
    let renglon = {
        "nombre": document.querySelector(`.form-group #nombre`).value,
        "precio": Number(document.querySelector(`.form-group #precio`).value),
        "financiacion": document.querySelector(`.form-group #financiacion`).value,
        "detalle": document.querySelector(`.form-group #detalle`).value,
        "tipo": document.querySelector(`.form-group #tipo`).value,
        "stock": Number(document.querySelector(`.form-group #stock`).value),
        "imagenes": arregloImg()
    }
    let response = await fetch(`/articulo/${btn_dropdown.textContent}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(renglon)
    });
    if (response.ok) {
        console.log("Actualizado");
        window.location.href = `http://${produc}/html/administrador.html`;
    } else {
        console.log("Error");
    }
});

let btn_agregar_articulo = document.querySelector('#btn-agregar-articulo');

document.querySelector('#btn-salir').addEventListener('click', function () {
    document.querySelector('.contenedor-cargar-articulo').classList.toggle('activo');
    btn_agregar_articulo.classList.toggle('disabled');
    window.location.href = `http://${produc}/html/administrador.html`
});

document.querySelector('#btn_cargar_articulo').addEventListener('click', function () {
    document.querySelector('.contenedor-cargar-articulo').classList.toggle('activo');
    btn_agregar_articulo.classList.toggle('disabled');
});

/* //////////////
   Pop up cargar articulo
//////////////*/

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dpqkhmplb/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = `FedAram37785`;

async function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        const archivo = event.target.files[0];
        const formData = new FormData();
        formData.append('file', archivo);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(CLOUDINARY_URL, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress(e) {
                    let progress = Math.round((e.loaded * 100) / e.total);
                    document.getElementById(`${event.target.id}-bar`).setAttribute('value', progress);
                }
            });
        var preview = document.getElementById(`${event.target.id}-preview`);
        preview.src = res.data.secure_url;
        preview.style.display = "block";
        secureUrlImg.push(res.data.secure_url);
    }
}

document.querySelector('.btn-agregar-articulo').addEventListener('click', async function () {
    let categoria = document.querySelector("#dropdownMenuButton").dataset.categoria;
    let mensajeError = document.getElementById('mensaje-error');
    let nombre = document.getElementById(`nombre`).value;
    let precio = document.getElementById(`precio`).value;
    let financiacion = document.getElementById(`financiacion`).value;
    let detalle = document.getElementById(`detalle`).value;
    let tipo = document.getElementById(`tipo`).value;
    let stock = document.getElementById(`stock`).value;

    if (categoria.length > 0 && nombre.length > 0 && precio.length > 0 && financiacion.length > 0 && detalle.length > 0
        && tipo.length > 0 && stock.length > 0) {
        //le saco los acentos
        categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        let articulo = {
            "nombre": nombre,
            "precio": precio,
            "financiacion": financiacion,
            "detalle": detalle,
            "tipo": tipo,
            "stock": stock,
            "imagen_articulo": secureUrlImg
        }

        let respuesta = await fetch(`/articulo/${categoria}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articulo)
        });

        if (respuesta.ok) {
            listaArticulos.push(articulo);
            window.location.href = `http://${produc}/html/administrador.html`
            
            secureUrlImg = [];
        } else {
            console.log('Hubo un error');
        }

    } else {
        mensajeError.innerHTML = "Todos los campos deben estar completos";
    }
});
