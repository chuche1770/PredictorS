const hrEstudio = document.getElementById('leerHorasEstudio');
const hrSleep = document.getElementById('leerHorasSleep');
const notaExamen = document.getElementById('leerNotaExamen');
const areatxt = document.getElementById('areatxt');
const btnEnviarData = document.getElementById('btn');
const btnEntrenar = document.getElementById('btnResult');


var dataTrain = [];
var dataViewUser = [];
btnEnviarData.addEventListener('click', almacenarEntrenamiento);
btnEntrenar.addEventListener('click', predecir);

function almacenarEntrenamiento() {
    var dEstudio = hrEstudio.value;
    var dSleep = hrSleep.value;
    var dNote = notaExamen.value;

    if (verificarNulos(dEstudio, dSleep, dNote)) {
        // alert("Debes llener todos los campos");
        swal("Atención!", "Debes llener todos los campos!", "warning");
        return undefined;
    }
    // conversion de variables a entero
    dEstudio = parseInt(hrEstudio.value);
    dSleep = parseInt(hrSleep.value);
    dNote = parseInt(notaExamen.value);

    dataViewUser.push({
        "Horas estudio": dEstudio,
        "Horas de sueño": dSleep,
        "Nota del examen": dNote
    });
    dataTrain.push(
        { input: { st: dEstudio, sl: dSleep }, output: { note: dNote / 100 } }
    );
    // console.log(dataTrain);
    prettyPrint(dataViewUser);
    hrEstudio.value = "";
    hrSleep.value = "";
    notaExamen.value = "";
    hrEstudio.focus();
}

function predecir() {
    if (dataTrain.length < 4) {
        swal("Atención!", "Debes tener al menos 4 datos previos para tener una mejor prediccion!", "error");
        // alert("");
        return undefined;
    }

    // console.log(usuarioInput1);
    var usuarioInput1 = prompt('Cantidad de horas que estudiaste: ');
    var usuarioInput2 = prompt('Cantidad de horas que dormiste: ');
    console.log(usuarioInput1);
    console.log(usuarioInput2);
    if (usuarioInput1 == "" || usuarioInput2 == "") {
        swal("Atención!", "Debes tener ingresar las horas de sueño y de estudio para realizar la predicción", "error");
        return undefined;
    }

    //Inicializar red neuronal
    var network = new brain.NeuralNetwork();
    network.train(dataTrain);
    var entrada = {
        st: parseInt(usuarioInput1),
        sl: parseInt(usuarioInput2)
    };
    var resultado = network.run(entrada);
    var calif = Math.round(resultado.note * 100);

    console.log(resultado);
    // console.log(calif);
    if (calif >= 70) {
        swal("Buen trabajo!", "En base a tus datos previos, aprobaras el examen con " + calif, "success");
    } else {
        swal("Fsota", "Si piensas estudiar " + usuarioInput1 + " horas, y dormir " + usuarioInput2 + " puede que repruebes el examen con " + calif, "error");
    }
    document.getElementById("cont1").focus();
    document.getElementById("cont1").innerHTML = 'La nota obtenida en el examen, con ' + usuarioInput1 + ' horas de estudio y ' + usuarioInput2 + ' horas de sueño es de :' + calif;

}
function prettyPrint(data) {
    // var ugly = {};
    // var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(data, undefined, 4);
    areatxt.value = pretty;
}


function verificarNulos(e, s, n) {
    if (e == 0 && s == 0 && n == 0) {
        return true;
    }
    return false;
}

