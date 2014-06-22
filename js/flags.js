/**
 * Created by minerva on 6/20/14.
 */
function kimonoCallback(data) {
    // do something with the data
    // please make sure the scope of this function is global
    $.each(data.results.collection2, function(key,value)

        {
           // console.log(value.property2.src);

           // $("#team1flag").append("<img src= " + " ' " + value.property2.src + " ' " + "/>");

           $("#team2flag").append("<img src= " + " ' " + value.property2.src + " ' " + "/>");

            //  $("#team2flag").append("<p>" + value.property2.alt + "</p>");
          //  $("#flags").append("<option value='" + value.property2.alt + "'>" + "<img src= " + " ' " + value.property2.src + " ' " + "/></option>");

          //  var selects = document.getElementById("team1");
            //var selectedValue = selects.options[selects.selectedIndex].value;// will gives u 2
           // if (selectedValue==16){
              //  alert('aloha');
            $("#team1flag").append("<img src= " + " ' " + value.property2.src + " ' " + "/>");

             // }

        }



    );


}

$.ajax({
    "url":"http://www.kimonolabs.com/api/c30l5e5u?apikey=5eadc80e616c893a6320ae4fe3763624&kimlimit=1000&callback=kimonoCallback",
    "crossDomain":true,
    "dataType":"jsonp"
});