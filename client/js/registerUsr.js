'use strict';

let btnRegister = document.querySelector(".btnRegUsr");
btnRegister.addEventListener("click", registrarUsuario);

// let nro_user = 4;
// let usuarios = [];

async function registrarUsuario() {
    console.log("funcion registrar usuario");
        let u_dire = document.querySelector("#inputAddress").value;
        let u_city = document.querySelector("#inputCity").value;
        let u_mail = document.querySelector("#inputEmail").value;
        let u_pass = document.querySelector("#inputPassword").value;
        let datosUsuario = {
            "email": u_mail,
            "password": u_pass,
            "direccion": u_dire,
            "ciudad": u_city,
            "esAdmin": false,
        }
        
        console.log("user (js): ",datosUsuario);
        // usuarios.push(datosUsuario);
        let response = //await fetch("http://localhost:3000/cliente/addCliente",{
            await fetch("/usuario/nuevo_usuario",{ // cambio por el endpoint a la BD
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            })
            // let contenido = await response.json();
            // console.log(contenido);
        if (response.ok){
            const contenido = await response.json();
            // nro_user++;
            console.log("los datos de ", contenido.email," fueron cargados correctamente");
            window.location =`http://tp-forhome.herokuapp.com/html/loginUser.html`;
        }
        else{
            alert("no se pudo enviar el json");
        }
   
}
