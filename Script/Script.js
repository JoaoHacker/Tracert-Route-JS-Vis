var host;
var rutaCarpeta = '"C:\\Users\\Joao\\Dropbox\\Redes 2\\Proyecto final"';
var rutaBat = '"C:\\Users\\Joao\\Dropbox\\Redes 2\\Proyecto final\\Distr\\Tracer.bat "';
var rutaTxt = '" Traza.txt"';



$(document).ready(function () {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    


    $('#btnTrazar').on("click", function () {

        host = $('#txtHost').val();
        if (host != "") {
            ejecutarTracert(host);
           


        }
        else {
            console.log("No puso ninguna direccion");
        }



    }
    )
});







function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    var output = [];
    var s; //String con todo el archivo 
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate.toLocaleDateString(), '</li>');

        var reader = new FileReader();

        // Read file into memory as UTF-16       

        reader.onload = function (event) {

            s = event.target.result;
            graficar(limpiar(s));
            
        }




        reader.readAsText(f);
        //reader.readAsArrayBuffer(f);



    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

}
function limpiar(result) {

    var s = String(result);
    var lineas = s.split('\n');


    var long = lineas.length;
    /*for (var i = 0; i < long; i++) {
        console.log("Secuencia : " + i);
        console.log(lineas.pop());
    }*/



    //Si es exitosa la consulta
    if (lineas[lineas.length - 2].search("Traza completa") != -1) {



        var host = lineas[1];
        var saltos = lineas[2];
        // De la 4 a la lineas.length - 3 Son las rutas


        var r = limpiarTrazas(lineas);

    }

    return r;
}

function limpiarTrazas(arreglo) {

    var ObjetosArray = [];
    for (var i = 4; i < arreglo.length - 3; i++) {
        lineaTraza = arreglo[i].split(' ');
        var contadorSplit = 0; //Cuanta las veces que entra en el arreglo independiente de si es vacio o no
        var entradasArray = 0; //Cuenta las veces que entra en el arreglo cuando no es vacio
        var myObj = { id: null, ping1: null, ping2: null, ping3: null, direccion: null }; //Objeto que tiene todos los datos de la ruta (por linea)


        do {
            if (lineaTraza[contadorSplit].length > 0) {
                switch (entradasArray) {
                    case 0: {
                        myObj.id = lineaTraza[contadorSplit];
                        entradasArray++;
                        break;
                    }
                    case 1: {
                        myObj.ping1 = lineaTraza[contadorSplit];
                        entradasArray++;
                        break;
                    }
                    case 3: {
                        myObj.ping2 = lineaTraza[contadorSplit];
                        entradasArray++;
                        break;
                    }
                    case 5: {
                        myObj.ping3 = lineaTraza[contadorSplit];
                        entradasArray++;
                        break;

                    }
                    case 7: {
                        myObj.direccion = lineaTraza[contadorSplit];
                        entradasArray++;
                        break;

                    }
                    default: {
                        entradasArray++;
                        break;
                    }

                }


            }
            contadorSplit++;



        } while (contadorSplit < lineaTraza.length - 1);
        ObjetosArray.push(myObj);

    }
    console.log(ObjetosArray);
    return ObjetosArray;

}







function ejecutarTracert(host) {
    try {
        var wshShell = new ActiveXObject("WScript.Shell");
        var rutaEjecutable = rutaCarpeta + rutaBat;
        console.log(rutaBat + host + rutaTxt + rutaCarpeta);
        wshShell.Run(rutaBat + rutaCarpeta + ' "' + host + rutaTxt);



    } catch (e) {
        console.log(e);
    }

}

function graficar(objJson) {
    var container = document.getElementById('visualization');
    /*var label1 = {
        content: "Ping 192.168.0.1",
        xOffset: 20,
        yOffset: 20
    }
    var names = ['top', 'bottom', 'zero', 'none', 'group', 'none'];
    var groups = new vis.DataSet();
*/
    var items = [];
    
    for (var i = 0; i < objJson.length-1; i++) {
        var ruta = { x: null, y: null }
        ruta.x = parseInt(objJson[i].id);
        ruta.y = parseInt(objJson[i].ping1);
        ruta.label = objJson[i].direccion;
        items.push(ruta);
    }
    

    var dataset = new vis.DataSet(items);
    console.log(dataset);
    var options = {
  
        start :1,
        end: 10,
        sort: false,
        shaded: {
            orientation: 'bottom'
        },
        moveable: false,
        dataAxis: {
            showMinorLabels: false,
            left: {
                title: {
                    text: "Ping en ms"
                }
            }
        },
        legend: {left:{position:"bottom-left"}},
        


    };
    var graph2d = new vis.Graph2d(container, dataset,options);
}



