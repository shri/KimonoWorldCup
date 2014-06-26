tgfactor = .12;
rcfactor = .4;
mfactor = .04;
yfactor = 0;
minfactor = 0;
cfactor = 0;

tgfactor_i = .12;
rcfactor_i = .4;
mfactor_i = .04;
yfactor_i = .4;
minfactor_i = .00005;
cfactor_i = 30;

cohesion = [
  {
    "FIELD1":"England",
    "FIELD2":0.391304348
  },
  {
    "FIELD1":"Italy",
    "FIELD2":0.434782609
  },
  {
    "FIELD1":"Spain",
    "FIELD2":0.391304348
  },
  {
    "FIELD1":"Germany",
    "FIELD2":0.47826087
  },
  {
    "FIELD1":"Switzerland",
    "FIELD2":0.695652174
  },
  {
    "FIELD1":"Argentina",
    "FIELD2":0.652173913
  },
  {
    "FIELD1":"Chile",
    "FIELD2":0.869565217
  },
  {
    "FIELD1":"Belgium",
    "FIELD2":0.739130435
  },
  {
    "FIELD1":"Greece",
    "FIELD2":0.652173913
  },
  {
    "FIELD1":"Costa Rica",
    "FIELD2":0.739130435
  },
  {
    "FIELD1":"Iran",
    "FIELD2":0.695652174
  },
  {
    "FIELD1":"Russia",
    "FIELD2":0.391304348
  },
  {
    "FIELD1":"Honduras",
    "FIELD2":0.652173913
  },
  {
    "FIELD1":"Portugal",
    "FIELD2":0.739130435
  },
  {
    "FIELD1":"Croatia",
    "FIELD2":0.826086957
  },
  {
    "FIELD1":"Bosnia-Herzegovina",
    "FIELD2":0.956521739
  },
  {
    "FIELD1":"France",
    "FIELD2":0.695652174
  },
  {
    "FIELD1":"Japan",
    "FIELD2":0.826086957
  },
  {
    "FIELD1":"Côte d'Ivoire",
    "FIELD2":0.826086957
  },
  {
    "FIELD1":"Brazil",
    "FIELD2":0.782608696
  },
  {
    "FIELD1":"Colombia",
    "FIELD2":0.913043478
  },
  {
    "FIELD1":"Netherlands",
    "FIELD2":0.652173913
  },
  {
    "FIELD1":"Nigeria",
    "FIELD2":0.869565217
  },
  {
    "FIELD1":"Uruguay",
    "FIELD2":0.913043478
  },
  {
    "FIELD1":"Australia",
    "FIELD2":0.913043478
  },
  {
    "FIELD1":"United States",
    "FIELD2":0.869565217
  },
  {
    "FIELD1":"Algeria",
    "FIELD2":1
  },
  {
    "FIELD1":"Cameroon",
    "FIELD2":1
  },
  {
    "FIELD1":"Ghana",
    "FIELD2":0.956521739
  },
  {
    "FIELD1":"Korea Republic",
    "FIELD2":0.782608696
  },
  {
    "FIELD1":"Ecuador",
    "FIELD2":0.739130435
  },
  {
    "FIELD1":"Mexico",
    "FIELD2":0.52173913
  }
]

valid = ['PRL','PRD','A-L','MLS','BUN','LI1','LIN','PRA','J1L','1.H','PGC','SEA','PRA','KLC','ELO','SUL','ERE','NPF','LIM', 
    'ELI', 'LI2', '2.B', 'SED', 'SÜL', 'ALL', 'CSL', 'PSL', 'LEO', 'PRE', 'CHA', 'PSL', 'LIH'];

function recalculateScores(){
	tgfactor = tgfactor_i * $(".dial-tg").val() / 50;
	rcfactor = rcfactor_i * $(".dial-rc").val() / 50;
	mfactor = mfactor_i * $(".dial-m").val() / 50;
	yfactor = yfactor_i * $(".dial-y").val() / 50;
	minfactor = minfactor_i * $(".dial-min").val() / 50;
	cfactor = cfactor_i * $(".dial-c").val() / 50;

	for (var team in colors)
	{
		teams[team].score = teams[team].cohesion * cfactor + teams[team].teamgoals * tgfactor - teams[team].redcards * rcfactor + teams[team].momentum * mfactor - teams[team].yellowcards * yfactor + teams[team].minutes * minfactor;
	}

	reloadCharts();

	updateWinner();
}


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
	// This is how you would normally obtain the playerseasons variable
	// var result = null;
	// var scriptUrl = "http://worldcup.kimonolabs.com/api/players?includes=player_season_stats&apikey=989877be85a3ca05477428c8b41d4fbe&limit=10000";
	// $.ajax({
 //        url: scriptUrl,
 //        type: 'get',
 //        dataType: 'html',
 //        async: false,
 //        success: function(data) {
 //            result = data;
 //        } 
 //     });
	for (var obj in cohesion)
	{
		var stat = cohesion[obj];
		teams[stat.FIELD1].cohesion = stat.FIELD2; 
	}
	for (var team in colors)
	{
		teams[team].teamgoals = 0;
		teams[team].redcards = 0;
		teams[team].yellowcards = 0;
		teams[team].momentum = 0;
		teams[team].minutes = 0;
	}
	var idteam = {};
	var result = playerseasons;
	for (var player=0; player<result.length; player++)
	{
		if(result[player].playerSeasonStats!=undefined)
		{
			var team = result[player].nationality;
			for (var seasonid=0; seasonid<result[player].playerSeasonStats.length; seasonid++)
			{
				if ( (result[player].playerSeasonStats[seasonid].season=="2014") || (result[player].playerSeasonStats[seasonid].season=="2013/2014") && ($.inArray(result[player].playerSeasonStats[seasonid].league, valid)!=-1) )
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
		teams[team].score = teams[team].cohesion * cfactor + teams[team].teamgoals * tgfactor - teams[team].redcards * rcfactor + teams[team].momentum * mfactor - teams[team].yellowcards * yfactor + teams[team].minutes * minfactor;

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
	        	['x', "Goals", "Cohesion","Momentum", "Mins Played", "Red Cards", "Yellow Cards"],
	            ['team1', 1, 1, 1, 1, 1, 1],
	            ['team2', -1, -1, -1, -1, -1, -1]
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

function changeTeam1(team)
{
	currentteams[0] = team;
	team1 = ["team1", parseInt(teams[team].teamgoals*tgfactor/tgfactor_i)+1, parseInt(teams[team].cohesion*cfactor/cfactor_i*60)+1,(parseInt(teams[team].momentum*mfactor/mfactor_i)+12)*4, parseInt(teams[team].minutes*minfactor/minfactor_i/700)+1, parseInt(teams[team].redcards*rcfactor/rcfactor_i*18)+1, parseInt(teams[team].yellowcards*yfactor/yfactor_i)+1];
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
	team2 = ["team2", -parseInt(teams[team].teamgoals*tgfactor/tgfactor_i)-1, -parseInt(teams[team].cohesion*cfactor/cfactor_i*60)-1,-(parseInt(teams[team].momentum*mfactor/mfactor_i)+12)*4, -parseInt(teams[team].minutes*minfactor/minfactor_i/700)-1, -parseInt(teams[team].redcards*rcfactor/rcfactor_i)*18-1, -parseInt(teams[team].yellowcards*yfactor/yfactor_i)-1];
	chart.load({
        columns:[team2]
    });
    chart.data.names({team2: team});
    // chart.data.colors({team2: d3.rgb(colors[team])});
    updateWinner();
    $("#team2flag").html("<img src='"+flags[team]+"'></img>");
}

function reloadCharts()
{
	var team = currentteams[0];
	team1 = ["team1", parseInt(teams[team].teamgoals*tgfactor/tgfactor_i)+1, parseInt(teams[team].cohesion*cfactor/cfactor_i*60)+1,(parseInt(teams[team].momentum*mfactor/mfactor_i)+12)*4, parseInt(teams[team].minutes*minfactor/minfactor_i/700)+1, parseInt(teams[team].redcards*rcfactor/rcfactor_i*18)+1, parseInt(teams[team].yellowcards*yfactor/yfactor_i)+1];
	team = currentteams[1];
	team2 = ["team2", -parseInt(teams[team].teamgoals*tgfactor/tgfactor_i)-1, -parseInt(teams[team].cohesion*cfactor/cfactor_i*60)-1,-(parseInt(teams[team].momentum*mfactor/mfactor_i)+12)*4, -parseInt(teams[team].minutes*minfactor/minfactor_i/700)-1, -parseInt(teams[team].redcards*rcfactor/rcfactor_i)*18-1, -parseInt(teams[team].yellowcards*yfactor/yfactor_i)-1];
	chart.load({
        columns:[team1, team2]
    });
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





