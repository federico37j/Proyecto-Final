"use strict";


let btnCategorias = document.querySelector('#btn-categorias');
let divGrid = document.querySelector('#grid');

let listaCategorias = document.querySelectorAll('#menu .categorias a');
let listaSubcategorias = document.querySelectorAll('#menu .contenedor-subcategorias .subcategoria');

let btnMenu = document.querySelector('#btn-menu-barras');
let menu = document.querySelector('#menu .contenedor-enlaces-nav');

let btnRegresar = document.querySelector('.btn-regresar');
let body = document.querySelector('body');

function esPantallaMovil() {
    return window.innerWidth <= 800 ? true : false;
}

//Con mouseover se activa cuando paso el cursor por arriba
btnCategorias.addEventListener('mouseover', function () {
    if (false == esPantallaMovil()) {
        //Agrego la clase activo a la lista de clases del div
        divGrid.classList.add('activo');
    }
});

//Con mouseleave se ejecuta cuando saco el cursor por arriba
divGrid.addEventListener('mouseleave', function () {
    if (false == esPantallaMovil()) {
        divGrid.classList.remove('activo');
    }
});

let btn_inicia_sesion = document.querySelector('.btn-iniciar-sesion');
let perfilMenu = document.querySelector('.dd_menu');

function perfilUsuario() {
    if (window.sessionStorage.getItem('userLogged')) {
        btn_inicia_sesion.addEventListener('mouseover', function () {
            if (false == esPantallaMovil()) {
                document.querySelector('#email-perfil').innerHTML = window.sessionStorage.getItem('user');
                perfilMenu.classList.add('activo');
            }
        });

        perfilMenu.addEventListener('mouseleave', function () {
            if (false == esPantallaMovil()) {
                perfilMenu.classList.remove('activo');
            }
        });
    }
}

let btn_cerrar_sesion = document.querySelector('#btn_cerrar_sesion');
btn_cerrar_sesion.addEventListener('click', cerrarSesion);
function cerrarSesion() {
    window.sessionStorage.setItem("userLogged", false);
    window.sessionStorage.setItem("user", null);
    window.location = "http://tp-forhome.herokuapp.com/";
    window.sessionStorage.clear();
    perfilMenu.classList.remove('activo');
}

//Recorro la lista de categorias
listaCategorias.forEach(categoria => {
    // se dispara cuando el ratón pasa por encima
    categoria.addEventListener('mouseenter', function (e) {
        if (!esPantallaMovil()) {
            // Recorro la lista de las Subcategorias
            listaSubcategorias.forEach(subcategoria => {
                subcategoria.classList.remove('activo');
                //Por cada subcategoria compara si coincide el id
                if (e.target.classList == subcategoria.id) {
                    subcategoria.classList.add('activo');
                }
            });
        }
    });
});

btnMenu.addEventListener('click', function () {
    menu.classList.toggle('activo');
    // //Si esta activo saco el scroll del body
    if (menu.classList.contains('activo')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = 'visible';
    }
});

btnCategorias.addEventListener('click', function (e) {
    e.preventDefault();
    divGrid.classList.toggle('activo');
});

btnRegresar.addEventListener('click', function (e) {
    e.preventDefault();
    divGrid.classList.remove('activo');
});

perfilUsuario();