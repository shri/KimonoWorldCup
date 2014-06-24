tgfactor = .0164;
rcfactor = .3403;
mfactor = .01;

function getTeamStats(team)
{
	if (teams[team].teamgoals==undefined)
	{
		var result = null;
		var scriptUrl = "http://worldcup.kimonolabs.com/api/players?nationality="+team;
		scriptUrl = scriptUrl+"&includes=player_season_stats&apikey=989877be85a3ca05477428c8b41d4fbe&limit=5000";
		$.ajax({
	        url: scriptUrl,
	        type: 'get',
	        dataType: 'html',
	        async: false,
	        success: function(data) {
	            result = data;
	        } 
	     });
		teams[team].teamgoals = 0;
		teams[team].redcards = 0;
		teams[team].yellowcards = 0;
		teams[team].momentum = 0;
		teams[team].minutes = 0;
		teams[team].cohesion = 0;
		result = JSON.parse(result);
		for (var player=0; player<result.length; player++)
		{
			if(result[player].playerSeasonStats!=undefined)
			{
				for (var seasonid=0; seasonid<result[player].playerSeasonStats.length; seasonid++)
				{
					if ( (result[player].playerSeasonStats[seasonid].season=="2014") || (result[player].playerSeasonStats[seasonid].season=="2013/2014") )
					{
						// console.log(result[player].playerSeasonStats[season].goalsScored);
						// console.log(result[player].playerSeasonStats[season].redCards);
						teams[team].teamgoals += result[player].playerSeasonStats[seasonid].goalsScored;
						teams[team].redcards += result[player].playerSeasonStats[seasonid].redCards;
						teams[team].yellowcards += result[player].playerSeasonStats[seasonid].yellowCards;
						teams[team].momentum += result[player].playerSeasonStats[seasonid].goalsScored;
						teams[team].minutes += result[player].playerSeasonStats[seasonid].minPlayed;
					}
					else if ((result[player].playerSeasonStats[seasonid].season=="2013") || (result[player].playerSeasonStats[seasonid].season=="2012/2013"))
					{
						teams[team].momentum -= result[player].playerSeasonStats[seasonid].goalsScored;
					}
				}
			}
		}
		var clubs = {};
		for (var player in result)
		{
			if (clubs[result[player].clubId]!=undefined)
			{
				clubs[result[player].clubId] += 1;
			}
			else
			{
				clubs[result[player].clubId] = 0;
			}
		}
		var i = 0;
		for (var club in clubs)
		{
			if (clubs[club] == 1)
			{
				i += 1;
			}
		}
		teams[team].cohesion = parseInt(100*i/result.length);
		teams[team].score = teams[team].teamgoals * tgfactor - teams[team].redcards * rcfactor + teams[team].momentum * mfactor;
	}
	return teams;
}

var teams = {};
var chart = null;
var startCharts = function(){
	$.getJSON("http://worldcup.kimonolabs.com/api/teams?apikey=989877be85a3ca05477428c8b41d4fbe", function(data) 
	{
		for (var i=0; i<data.length; i++)
		{
			teams[data[i].name] = data[i];
		  	// set select state to team
		}


		changeTeam1("Germany");
		changeTeam2("Brazil");
	});

	chart = c3.generate({
		bindto: "#chart",
	    data: {
	    	x: 'x',
	        columns: [
	        	['x', "Goals", "Goal Momentum", "Mins Played", "Red Cards", "Yellow Cards"],
	            ['team1', 80, 100, 100, 400, 60],
	            ['team2', -90, -30, -140, -200, -45]
	        ],
	        groups: [
	            ['team1', 'team2']
	        ],
	        type: 'bar'
	    },
	    axis: {
	        x: {
	            type: 'category'
	        }
	    },
	    grid: {
	        y: {
	            lines: [{value:0}]
	        }
	    }
	});

	$("#team1").change(function(){
		changeTeam1($("#team1 option:selected").text());
	});

	$("#team2").change(function(){
		changeTeam2($("#team2 option:selected").text());
	});

}



var team1 = [];
var team2 = [];
var currentteams = [];
var categories = ["Goals", "Goal Momentum", "Mins Played", "Red Cards", "Yellow Cards"];

function changeTeam1(team)
{
	currentteams[0] = team;
	getTeamStats(team);
	team1 = ["team1", teams[team].teamgoals, (parseInt(teams[team].goalsDiff)+12)*2, parseInt(teams[team].minutes/500), teams[team].redcards*18+1, teams[team].yellowcards];
	chart.load({
        columns:[team1]
    });
    chart.data.names({team1: team});
    // chart.data.colors({team1: d3.rgb(colors[team]).darker(2)});
    updateWinner();
    $("#team1flag").html("<img src='"+flags[team]+"'></img>");
}

function changeTeam2(team)
{
	currentteams[1] = team;
	getTeamStats(team);
	team2 = ["team2", -teams[team].teamgoals, -(parseInt(teams[team].goalsDiff)+12)*2, -parseInt(teams[team].minutes/500), -teams[team].redcards*18-1, -teams[team].yellowcards];
	chart.load({
        columns:[team2]
    });
    chart.data.names({team2: team});
    // chart.data.colors({team2: d3.rgb(colors[team])});
    updateWinner();
    $("#team2flag").html("<img src='"+flags[team]+"'></img>");
}

function updateWinner()
{
	if (teams[currentteams[0]] && teams[currentteams[1]] && teams[currentteams[0]].score>teams[currentteams[1]].score)
    {
    	$("#winner").html("<h3>kimono predicts...</h3><h1 style='text-transform:uppercase; color: rgb(31, 119, 180);'>"+currentteams[0]+"</h1>");
    }
    else
    {
    	$("#winner").html("<h3>kimono predicts...</h3><h1 style='text-transform:uppercase; color: rgb(255, 127, 14)'>"+currentteams[1]+"</h1>");
    }
}


var colors = 
{
	"Algeria": "#00FF99",
    "Argentina":"#3c4249",
    "Australia":"#d2ad53",
    "Belgium":"#de9ea2",
    "Bosnia-Herzegovina":"#7984b2",
    "Brazil":"#c8ad64",
    "Cameroon":"#95b0a8",
    "Chile":"#dda5a8",
    "Colombia":"#eae7a7",
    "Costa Rica":"#d39097",
    "Côte d'Ivoire": "#F77F00",
    "Croatia":"#9f797f",
    "Ecuador":"#e5e0b0",
    "England":"#b6b6b6",
    "France":"#60697b",
    "Germany":"#dbd6d9",
    "Ghana":"#e9e9e8",
    "Greece":"#b5b7bb",
    "Honduras":"#e5e6ef",
    "Iran":"#d8d3d3",
    "Italy":"#aab9dd",
    "Japan":"#969dba",
    "Korea Republic":"#ab5356",
    "Mexico":"#94bdae",
    "Netherlands": " #AE1C28",
    "Nigeria":"#16552a",
    "Portugal":"#944f52",
    "Russia":"#2f0b15",
    "Spain":"#4c0e0d",
    "Switzerland":"#d79598",
    "United States": "#b6b5b5",
    "Uruguay":"#ccd9e9"

}





