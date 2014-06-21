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
		teams[team.cohesion] = parseInt(100*i/result.length);
	}
	return teams;
}

var teams = {};
var chart = null;
$(document).on("ready", function(){
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


});



var team1 = [];
var team2 = [];
var categories = ["Goals", "Goal Momentum", "Mins Played", "Red Cards", "Yellow Cards"];

function changeTeam1(team)
{
	getTeamStats(team);
	team1 = ["team1", teams[team].teamgoals, (teams[team].goalsDiff+7)*2, teams[team].minutes/500, teams[team].redcards*25, teams[team].yellowcards];
	chart.load({
        columns:[team1]
    });
    chart.data.names({team1: team});
}

function changeTeam2(team)
{
	getTeamStats(team);
	team2 = ["team2", -teams[team].teamgoals, -(teams[team].goalsDiff+7)*2, -teams[team].minutes/500, -teams[team].redcards*25, -teams[team].yellowcards];
	chart.load({
        columns:[team2]
    });
    chart.data.names({team2: team});
}

