$(document).ready(function () {
  $('#divResultado').hide();

  $('input[type=number][max]:not([max=""])').on('input', function (ev) {
    var $this = $(this);
    var maxlength = $this.attr('max').length;
    var value = $this.val();
    if (value && value.length >= maxlength) {
      $this.val(value.substr(0, maxlength));
    }
  });

  document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();
    submitForm(event);
  });
});

function submitForm() {
    $('#divResultado').hide();
    let numero = $('#txtNumeroHeroe').val();
    let regex = /^[0-9]/;
    let nombre = "";
    if (!regex.test(numero)) {
      $('#divResultado').hide();
        alert("Solo ingrese numeros");
    } else {
        $.ajax({
          url: "https://superheroapi.com/api.php/4905856019427443/" + numero + "/powerstats",
          type: "GET",
          dataType: "json",
          success: function (res) {
            InfoCompletaHero(res);
          },
          error: function (error) {
            jsonValue = jQuery.parseJSON(error.responseText);
            alert("error" + error.responseText);
          },
        });
    }
};

function InfoCompletaHero(hero) {
    $.ajax({
      url: "https://superheroapi.com/api.php/4905856019427443/search/" + hero.name,
      type: "GET",
      dataType: "json",
      success: function (res) {
        if (res.response !== "error") {
          $('#divResultado').show();
          let _super = res.results.filter((persona) => persona.id == hero.id);
          Limpiar();
          PintarHero(_super);
          PintarTorta(_super);
        } else {
            $('#divResultado').hide();
            Limpiar();
            alert("Sin resultados, intenta con un número menor al 733");
        }
      },
      error: function (error) {
        jsonValue = jQuery.parseJSON(error.responseText);
        Limpiar();
        alert("error" + error.responseText);
      },
    });
};  

function PintarHero(hero){
    $("#imgHero").attr('src', hero[0].image.url);
    $("#lblNombre").append("<b>Nombre:</b> " + hero[0].name);
    $("#lblConexiones").append("<b>Conexiones:</b> " + Object.values(hero[0].connections))[0];
    $("#lblPublicado").append("<b>Publicado por:</b> " + hero[0].biography.publisher);
    $("#lblOcupacion").append("<b>Ocupación:</b> " + hero[0].work.occupation);
    $("#lblPrimeraAparicion").append("<b>Primera Aparición:</b> " + Object.values(hero[0].biography)[4]);
    $("#lblAltura").append("<b>Altura: </b>" + hero[0].appearance.height);
    $("#lblPeso").append("<b>Peso: </b>" + hero[0].appearance.weight);
    $("#lblAlianzas").append("<b>Alianzas: </b>" + hero[0].biography.aliases);
};

function PintarTorta(hero) {
  let _title = "Estadisticas de poder para " + hero[0].name;

  let _dataPoints = Object.keys(hero[0].powerstats).map(function (key) {
    return { y: hero[0].powerstats[key], name: key };
  });
  let chart = new CanvasJS.Chart("chartContainer", {
    exportEnabled: false,
    animationEnabled: true,
    title: {
      text: _title,
    },
    legend: {
      cursor: "pointer",
      itemclick: explodePie,
    },
    data: [
      {
        type: "pie",
        showInLegend: true,
        toolTipContent: "{name}: <strong>{y}%</strong>",
        indexLabel: "{name} - {y}%",
        dataPoints: _dataPoints,
      },
    ],
  });
  chart.render();
}

function explodePie(e) {
  if (
    typeof e.dataSeries.dataPoints[e.dataPointIndex].exploded === "undefined" ||
    !e.dataSeries.dataPoints[e.dataPointIndex].exploded
  ) {
    e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
  } else {
    e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
  }
  e.chart.render();
}

function Limpiar(){
    $("#lblNombre").empty();
    $("#lblConexiones").empty();
    $("#lblPublicado").empty();
    $("#lblOcupacion").empty();
    $("#lblPrimeraAparicion").empty();
    $("#lblAltura").empty();
    $("#lblPeso").empty();
    $("#lblAlianzas").empty();
};