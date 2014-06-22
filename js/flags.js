/**
 * Created by minerva on 6/20/14.
 */

var flags = {};
function kimonoCallback(data) {
    // do something with the data
    // please make sure the scope of this function is global
    $.each(data.results.collection2, function(key,value)
        {
            flags[value.property2.alt] = value.property2.src;
        }
    );
    console.log(flags);
}

$.ajax({
    "url":"http://www.kimonolabs.com/api/c30l5e5u?apikey=5eadc80e616c893a6320ae4fe3763624&kimlimit=1000&callback=kimonoCallback",
    "crossDomain":true,
    "dataType":"jsonp"
});