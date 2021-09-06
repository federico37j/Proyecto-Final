
let idUsuario = Number(window.sessionStorage.getItem("idUser"));
let productos;
let suma = 0;

async function mostrarCarrito() {
    try {
        let response = await fetch(`/carrito/${idUsuario}`);
        productos = [];
        if (response.ok) {

            let productos = await response.json();
            mostrarProductos(productos);
        }
        else
            document.getElementsByClassName("container").innerHTML = `<h2>Error al cargar la pagina</h2>`
    }
    catch (response) {
        document.getElementsByClassName("container").innerHTML = `<h2>${response}</h2>`;
    };
}

function mostrarProductos(prod) {
    let html = "";
    let htmlRes = "";
    suma = 0;
    let botonEnviar = document.getElementById('btn-siguiente');
    if (prod.length == 0) {
        botonEnviar.disabled = true
        html = `
<div class= "carrito-vacio row border rounded border-info m-1 p-3 justify-content-around">No tienes ningún producto en tu carrito de compras.</div>
`
    } else {
        botonEnviar.disabled = false
        for (let i = 0; i < prod.length; i++) {
            r = prod[i];
            suma = suma + parseInt(r.A_precio * r.CARRITO_cantidad);
            html += `
    <div class= "row border rounded border-info m-1 p-3 justify-content-around">
    <div class="col-md-2 rounded-circle bg-white img-container"><img class="imgCarrito" src=${r.IMG_imagen}></div>
    <div class="col-md-5"><b>${r.A_nombre}</b></div>

    <div class= "col-md-3">
    <div class="row"><h4><b>${formatter.format(r.A_precio * r.CARRITO_cantidad)}</b></h4></div>
    <div class="row"><b>${r.CARRITO_cantidad}</b>     X ${formatter.format(r.A_precio)}</div>
    <div class="row"><button class="subirCantidad" id="aumentar" pos="${r.CARRITO_idCarrito}"></button><button class="bajarCantidad" id="disminuir" pos="${r.CARRITO_idCarrito}" cantidad="${r.CARRITO_cantidad}"></button><button class= "btnTachito" pos="${r.CARRITO_idCarrito}"></div>
    </div>
    </div>

    </div>
    `;
        }
    }
    document.querySelector("#productos").innerHTML = html;

    /* document.querySelector("#resumen").innerHTML = htmlRes; */

    document.querySelector("#suma").innerHTML = "Total " + formatter.format(suma);

    localStorage.setItem("suma", suma);




    let botonesDisminuir = document.querySelectorAll(".bajarCantidad");
    botonesDisminuir.forEach(boton => {
        boton.addEventListener("click", disminuirCantidad);
    });

    let botonesAumentar = document.querySelectorAll(".subirCantidad");
    botonesAumentar.forEach(boton => {
        boton.addEventListener("click", sumarCantidad);
    });

    let botonesBorrar = document.querySelectorAll(".btnTachito");
    botonesBorrar.forEach(boton => {
        boton.addEventListener("click", btnBorrarClick);
    });
}

if (document.getElementById('suma') != undefined) {

    document.getElementById('suma').innerHTML = suma;
}

let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

});

function mostrarDiv(x) {
    if (x === 0) {
        document.getElementById('divSuc').style.display = 'none';
        document.getElementById('btnsRetiroSuc').style.display = 'none';
        document.getElementById('divForm').style.display = 'contents';

    } else {
        document.getElementById('divForm').style.display = 'none';
        document.getElementById('btnsRetiroSuc').style.display = 'contents';
        document.getElementById('divSuc').style.display = 'contents';
    }
    return;
}

async function btnBorrarClick() {
    let pos = this.getAttribute("pos");
    let response = await fetch(`/carrito/${pos}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {
        mostrarCarrito();
    } else {
        console.log("No se pudo borrar");
    }
}

async function vaciarCarrito() {
    let response = await fetch(`/carrito/vaciar/${idUsuario}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (response.ok) {
        // console.log("Resultado ok")
    } else {
        console.log("No se pudo vaciar el carrito");
    }
}

function siguientePantalla() {
    window.location = `http://tp-forhome.herokuapp.com/html/carrito1.html`;
}

if (document.getElementById('btn-siguiente') != undefined) {
    let botonSiguiente = document.getElementById('btn-siguiente');
    botonSiguiente.addEventListener("click", siguientePantalla);
}

if (document.getElementById("compraExitosa") != undefined) {
    obtenerCarrito();
}

function disminuirCantidad() {
    let pos = this.getAttribute("pos");
    let cantidad = this.getAttribute("cantidad");
    if (cantidad > 1) {
        let valor = "restar";
        actualizarCantidad(valor, pos);
    }
}

function sumarCantidad() {
    let pos = this.getAttribute("pos");
    // console.log("ingresa actualizar cantidad")
    let valor = "sumar";
    actualizarCantidad(valor, pos);
}

async function actualizarCantidad(operacion, pos) {
    let valor = {
        "operacion": operacion
    };
    let response = await fetch(`/carrito/${pos}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(valor)
    })

    if (response.ok) {
        mostrarCarrito();
    }
    //   mostrarCarrito();
}

async function crearFactura(productos) {
    let date = new Date();
    let factura = {
        "productos": productos,
        "suma": localStorage.getItem("suma"),
        "fecha": date,
        "idUsuario": window.sessionStorage.getItem("idUser"),
        "idLocal": 1
    }
    let respuesta = await fetch("/factura", {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(factura)
    });
    if (respuesta.ok) {
        let factura = await respuesta.json();
        document.querySelector("#btn_factura").dataset.factura = Number(factura.idFactura);
        // loadFactura(Number(factura.idFactura));

    } else {
        console.log("error");
    }
}

async function actualizarStock(productos) {
    let url = "";
    let artVendidos = 0;
    for (let i = 0; i < productos.length; i++) {
        url = `/articulo/${productos[i].CARRITO_idArticulo}`;
        artVendidos = {
            cantidad: productos[i].CARRITO_cantidad
        }
        let respuesta = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artVendidos)
        });
        if (!respuesta.ok) {
            console.log("error");

        }
    }

}

async function obtenerCarrito() {
    try {
        let response = await fetch(`/carrito/${idUsuario}`);
        productos = [];
        if (response != "") {
            let productos = await response.json();
            crearFactura(productos);
            vaciarCarrito();
            actualizarStock(productos);
        }
        else
            document.getElementsByClassName("container").innerHTML = `<h2>Error al cargar la pagina</h2>`
    }
    catch (response) {
        document.getElementsByClassName("container").innerHTML = `<h2>${response}</h2>`;
    };
}

if (document.querySelector('#btn_factura') != undefined) {
    document.querySelector('#btn_factura').addEventListener('click', function () {
        document.querySelector('.contenedor-resultado-compra').classList.toggle('ocultar');
        document.querySelector('.factura').classList.toggle('ocultar');
        document.querySelector('.contenedor-btn-imprimir').classList.toggle('ocultar');
    })
}

if (document.querySelector('#btn_imprimir') != undefined) {
    document.querySelector('#btn_imprimir').addEventListener('click', function () {
        window.print();
    })
}

mostrarCarrito();
