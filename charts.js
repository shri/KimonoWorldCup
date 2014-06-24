tgfactor = .0164;
rcfactor = .3403;
mfactor = .12;




function generateStats()
{
	$.ajax({
		url:"http://worldcup.kimonolabs.com/api/teams?apikey=989877be85a3ca05477428c8b41d4fbe",
		type: 'get',
		dataType: 'html',
		async: false,
		success: function(data) 
		{
			data = JSON.parse(data);
			for (var i=0; i<data.length; i++)
			{
				teams[data[i].name] = data[i];
			}
		}
	});
	var result = null;
	var scriptUrl = "http://worldcup.kimonolabs.com/api/players?includes=player_season_stats&apikey=989877be85a3ca05477428c8b41d4fbe&limit=5000";
	$.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        } 
     });
	for (var team in colors)
	{
		teams[team].teamgoals = 0;
		teams[team].redcards = 0;
		teams[team].yellowcards = 0;
		teams[team].momentum = 0;
		teams[team].minutes = 0;
	}
	console.log(team);
	console.log(teams[team]);
	var idteam = {};
	result = JSON.parse(result);
	for (var player=0; player<result.length; player++)
	{
		if(result[player].playerSeasonStats!=undefined)
		{
			var team = result[player].nationality;
			for (var seasonid=0; seasonid<result[player].playerSeasonStats.length; seasonid++)
			{
				if ( (result[player].playerSeasonStats[seasonid].season=="2014") || (result[player].playerSeasonStats[seasonid].season=="2013/2014") )
				{
					teams[team].teamgoals += result[player].playerSeasonStats[seasonid].goalsScored;
					teams[team].redcards += result[player].playerSeasonStats[seasonid].redCards;
					teams[team].yellowcards += result[player].playerSeasonStats[seasonid].yellowCards;
					teams[team].minutes += result[player].playerSeasonStats[seasonid].minPlayed;
					idteam[result[player].teamId] = team;
				}
			}
		}
	}


	for (var team in colors)
	{
		teams[team].historicalscore = teams[team].teamgoals * tgfactor - teams[team].redcards * rcfactor;

	}	

	var result = null;
	var scriptUrl = "http://worldcup.kimonolabs.com/api/matches?limit=5000&apikey=989877be85a3ca05477428c8b41d4fbe";
	$.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(data) {
            result = data;
        } 
     });
	result = JSON.parse(result);
// Momentum = A weighted SUM of goal diffs across each game played in this WC = Σ( weight_i ) * (goal_diff_i) 

// weight_i = IF goal_diff is negative, then =  1 + (target_country_historic_score - opponent_historic_score)/ target_country_historic_score
// IF goal_diff > 1, then = 1 + (opponent_historic_score - target_country_historic_score)/ target_country_historic_score
	for (var matchnum in result)
	{
		var match = result[matchnum];
		if (match.status == "Final" && idteam[match.homeTeamId]!=undefined && idteam[match.awayTeamId]!=undefined)
		{
			var home = teams[idteam[match.homeTeamId]];
			var away = teams[idteam[match.awayTeamId]];
			var goal_diff = match.homeScore - match.awayScore;
			if (goal_diff < 0)
			{
				var w_i = 1 + (home.historicalscore - away.historicalscore)/home.historicalscore;
			} 
			else
			{
				var w_i = 1 + (away.historicalscore - home.historicalscore)/home.historicalscore;
			}
			teams[idteam[match.homeTeamId]].momentum += w_i*goal_diff;
			// switch
			var home = teams[idteam[match.awayTeamId]];
			var away = teams[idteam[match.homeTeamId]];
			var goal_diff = match.awayScore - match.homeScore;
			if (goal_diff < 0)
			{
				var w_i = 1 + (home.historicalscore - away.historicalscore)/home.historicalscore;
			} 
			else
			{
				var w_i = 1 + (away.historicalscore - home.historicalscore)/home.historicalscore;
			}
			teams[idteam[match.awayTeamId]].momentum += w_i*goal_diff;

		}
	}

	for (var team in colors)
	{
		teams[team].score = teams[team].teamgoals * tgfactor - teams[team].redcards * rcfactor + teams[team].momentum * mfactor;

	}
	return teams;
}



var teams = {};
var chart = null;
var startCharts = function(){
	
	

	chart = c3.generate({
		bindto: "#chart",
	    data: {
	    	x: 'x',
	        columns: [
	        	['x', "Goals", "Goal Momentum", "Mins Played", "Red Cards", "Yellow Cards"],
	            ['team1', 1, 1, 1, 1, 1],
	            ['team2', -1, -1, -1, -1, -1]
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

	changeTeam1("Germany");
	changeTeam2("Brazil");

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
	team1 = ["team1", teams[team].teamgoals, (parseInt(teams[team].goalsDiff)+12)*2, parseInt(teams[team].minutes/500), teams[team].redcards*18+1, teams[team].yellowcards];
	console.log(team1);
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





