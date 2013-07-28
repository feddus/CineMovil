function rellenarFicha(codigo) {
    //$('#ficha-div').html("");
    //alert(codigo);
    var idioma = $("input:radio[name=radio-choice-t-1]:checked").val();
    var url = 'https://www.googleapis.com/freebase/v1/topic' + codigo + '?lang=' + idioma + '&callback=?';
    alert(url);
    alert(url);
    $.getJSON(url, function(topic) {
        var name = topic.property['/type/object/name'].values[0].text;
        var desc = topic.property['/common/topic/description'].values[0].value;
        var web = '';
        if (topic.property['/common/topic/official_website'])
            web = topic.property['/common/topic/official_website'].values[0].value;
        var clave;
        var isSerie = false;
        var isFilm = false;
        var yearstart = '';
        var yearend = '';
        //comprobar si es serie o pelicula
        for (clave in topic.property['/type/object/type'].values) {
            if (topic.property['/type/object/type'].values[clave].id == "/tv/tv_program")
                isSerie = true;
            if (topic.property['/type/object/type'].values[clave].id == "/film/film")
                isFilm = true;
        }
        if (isSerie) {
            yearstart = topic.property['/tv/tv_program/air_date_of_first_episode'].values[0].text;
            yearstart = yearstart.substring(0, 4);
            if (topic.property['/tv/tv_program/air_date_of_final_episode']) {
                if (topic.property['/tv/tv_program/air_date_of_final_episode'].count > 0) {
                    yearend = topic.property['/tv/tv_program/air_date_of_final_episode'].values[0].text;
                    yearend = yearend.substring(0, 4);
                }
            }

        }

        $.getJSON('https://ajax.googleapis.com/ajax/services/search/images?q=' + name + ' poster&v=1.0&callback=?',
                function(json) {
                    $('#ficha-foto').html('');
                    var img = $('<img />').attr({'src': json.responseData.results[0].tbUrl, 'width': '125', 'height': '125'}).appendTo($('#ficha-foto'));
                });
        $.getJSON('https://ajax.googleapis.com/ajax/services/search/images?q=' + name + '&v=1.0&callback=?',
                function(json) {
                    $('#ficha-img').html('');
                    for (clave in json.responseData.results)
                        var img = $('<img />').attr({'src': json.responseData.results[clave].tbUrl, 'width': '110', 'height': '110'}).appendTo($('#ficha-img'));
                });

        $('#ficha-titulo').html("<h2>" + name + "</h2>");
        if (yearstart != '')
            $('#ficha-titulo').append("<h5>(" + yearstart + "-" + yearend + ")</h5>");
        if (web != '')
            $('#ficha-url').html("");
        $('#ficha-url').append("<h4><a href=\'" + web + "\'>Sitio Web</a></h4>");
        $('#ficha-des').html("" + desc);


        //alert(name);
        //alert(desc);
        //alert(web);
        //alert(yearstart);
        //a/lert(yearend);
    });
}

function realizaProceso() {
    //Freebase
    $('#resultado-ul').html("");
    var outputhtml = "";
    var termino = $('#search-1').val();//terminos[i];
    var cleanTerm = termino.replace(/ /gi, '_').toLowerCase();
    var idioma = $("input:radio[name=radio-choice-t-1]:checked").val();
    var service_url = 'https://www.googleapis.com/freebase/v1/search';
    var url = service_url + '?query=' + cleanTerm + '&lang=' + idioma + '&filter=(any domain:/tv domain:/film)&callback=?';
    //alert(url);
    $.getJSON(url, function(topic) {
        var clave;
        var anAbstract;
        var highscore = '';
        if (topic.result[0].score)
            highscore = topic.result[0].score;
        if (highscore != '') {
            for (clave in topic.result) {
                if (topic.result[clave].score > (highscore / 2)) {
                    anAbstract = topic.result[clave].name;
                    outputhtml = '<li><a onclick=rellenarFicha(\'' + topic.result[clave].mid + '\'); href=#ficha>' + anAbstract + '</a></li>';
                    $('#resultado-ul').append(outputhtml).listview('refresh');
                }
            }
        }

    });
}
function buscarImagenes() {
    var start;
    //Google Images
    $.getJSON('https://ajax.googleapis.com/ajax/services/search/images?q=' + $('#search-1').val() + '&v=1.0&start=0&callback=?',
            function(json) {
                var clave;
                $('#imagenes').html("");
                for (clave in json.responseData.results) {
                    //alert(json.responseData.results[clave].url);
                    var img = $('<img />').attr({'src': json.responseData.results[clave].tbUrl, 'width': '125', 'height': '125'}).appendTo($('#imagenes'));
                }
            });
}