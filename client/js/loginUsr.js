let btnLogin = document.querySelector(".subbt");
btnLogin.addEventListener("click", ingresar);

async function ingresar() {
    console.log("Funcion ingresar");
    let correo = document.querySelector('.mail').value;
    let password = document.querySelector('.pwd').value;
    let user = {
        "email": correo,
        "password": password
    }

    // let container = document.querySelector(".form");
    // voy a buscar los valores cargados en los inputs
    //observo los valores con los q intenta ingresar
    // console.log(correo);
    // console.log(password);

    //VERSION PRUEBA FRONT
    // if (correo === usuario.email && password === usuario.password){
    //     container.innerHTML = `<h2>Bienvenido ${correo}</h2>`
    // }
    // else{
    // alert();}
    // fetch con csv de login 'http://localhost:3000/login/validate'

    let respuesta = await fetch('/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (respuesta.ok) {
        const logueado = await respuesta.json();
        console.log(logueado);
        // user = respuesta.json(); 
        console.log("Bienvenido/a ", logueado.email);
        window.sessionStorage.setItem("userLogged", true);
        window.sessionStorage.setItem("user", logueado.email);
        window.sessionStorage.setItem("idUser", logueado.idUsuario);
        window.sessionStorage.setItem("esAdmin", logueado.esAdmin);
        if (logueado.esAdmin) {
            window.location = `http://tp-forhome.herokuapp.com/html/administrador.html`;
        }
        else
            window.location = "http://tp-forhome.herokuapp.com";
    }
    else {
        alert("DATOS INGRESADOS NO VALIDOS!!");
    }
    ///////////////////////////// codigo mock //////////////////////////////
    // try {
    //     let response = await fetch("http://localhost:3000/mock/mockUsr.json");
    //     if (response.ok) {
    //         let t = await response.json();
    //         let users = t.usuarios;
    //         console.log();
    //         if (correo === users[0].email && password === users[0].password) {
    //             console.log("ingreso al sistema");
    //             console.log("Bienvenido/a ",users[0].email);
    //             setTimeout ("redireccionar()", 5000); //tiempo expresado en milisegundos
    //         }
    //         else {
    //             console.log("DATOS INCORRECTOS");
    //         }
    //     }
    //     else
    //         container.innerHTML = `<h2>Error al cargar la pagina</h2>`
    // }
    // catch (response) {
    //     container.innerHTML = `<h2>${response}</h2>`;
    // };
}

// ingresar();

function cerrarSesion() {
    window.sessionStorage.clear();
}