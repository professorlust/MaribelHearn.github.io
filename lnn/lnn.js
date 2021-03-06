var LNNs, all = ["overall", "players", "SoEW", "PoDD", "LLS", "MS", "EoSD", "PCB", "IN", "MoF", "SA", "UFO", "GFW", "TD", "DDC", "LoLK", "HSiFS"];

function show(game) {
    $("#" + game).css("display", "block");
    
    if (!$("#" + game + "c").is(":checked")) {
        $("#" + game + "c").prop("checked", true);
    }
}

function hide(game) {
    $("#" + game).css("display", "none");
    
    if ($("#" + game + "c").is(":checked")) {
        $("#" + game + "c").prop("checked", false);
    }
}

function checkGame(arg) {
    if ($("#" + arg + "c").is(":checked")) {
        show(arg);
    } else {
        hide(arg);
    }
}

function checkAll() {
    var checked = $("#all").is(":checked");
    
    for (var key in all) {
        checked ? show(all[key]) : hide(all[key]);
    }
}

$(document).ready(function() {
    // detect smartphone and tablet
    if (navigator.userAgent.contains("Mobile") || navigator.userAgent.contains("Tablet")) {
        $("#back").css("display", "block");
	}
    
    $.get("../json/lnnlist.json", function(data) {
        LNNs = data;
        
        var playergameLNNs = {}, playerLNNs = {}, overallplayers = [], typeString = "", count = 0, game, players, gamecount, shottype, shotplayers, shotplayersIN, shotcount, character, type, i, player;
        
        for (game in LNNs) {
            players = [];
            gamecount = 0;
            
            for (shottype in LNNs[game]) {
                if (game != "IN" && game != "UFO" && game != "HSiFS" || (game == "IN" && shottype.contains("FinalA")) || (game == "UFO" && !shottype.contains("UFOs")) || (game == "HSiFS" && shottype.contains("Spring"))) {
                    shotplayers = [];
                    shotplayersIN = [];
                    shotcount = 0;
                }
                
                character = shottype.replace(/Spring|Summer|Autumn|Winter|FinalA|FinalB|UFOs/, "");
                
                if (game == "IN" || game == "UFO" || game == "HSiFS") {
                    type = shottype.replace(character, "");
                    
                    if (type !== "") {
                        typeString = " (" + type + ")";
                    } else {
                        typeString = "";
                    }
                }
                
                for (i in LNNs[game][shottype]) {
                    player = LNNs[game][shottype][i];
                    shotplayers.push(player + (game == "IN" || game == "UFO" || game == "HSiFS" ? typeString : ""));
                    shotplayersIN.pushStrict(player);
                    
                    if (!playerLNNs.hasOwnProperty(player)) {
                        playerLNNs[player] = 0;
                    }
                    
                    playerLNNs[player] += 1;
                    
                    if (!playergameLNNs.hasOwnProperty(player)) {
                        playergameLNNs[player] = [];
                    }
                    
                    playergameLNNs[player].pushStrict(game);
                    
                    if (!players.contains(player)) {
                        players.push(player);
                    }
                    
                    count += 1;
                    gamecount += 1;
                    shotcount += 1;
                }
                
                if (!(game == "IN" && type != "FinalB") && !(game == "UFO" && type != "UFOs") && !(game == "HSiFS" && type != "Winter")) {
                    shotplayers.sort();
                    $("#" + game + character + "n").html(shotcount + (game == "IN" ? " (" + shotplayersIN.length + ")" : ""));
                    
                    if (shotcount === 0) {
                        $("#" + game + character).html('-');
                        continue;
                    }
                    
                    for (i in shotplayers) {
                        $("#" + game + character).append(", " + shotplayers[i]);
                    }
                    
                    if ($("#" + game + character).html().substring(0, 2) == ", ") {
                        $("#" + game + character).html($("#" + game + character).html().replace(", ", ""));
                    }
                }
            }
            
            players.sort();
            
            for (i in players) {
                $("#" + game + "t").append(", " + players[i]);
            }
            
            $("#" + game + "tn").html(gamecount + " (" + players.length + ")");
            $("#" + game + "on").html(gamecount);
            $("#" + game + "o").html(players.length);
            $("#" + game + "t").html($("#" + game + "t").html().replace(", ", ""));
            
            if (!$("#" + game + "c").is(":checked")) {
                hide(game);
            }
        }
        
        for (player in playerLNNs) {
            $("#ranking_tbody").append("<tr><td>" + player + "</td><td>" + playerLNNs[player] + "</td><td>" + playergameLNNs[player].length + "</td></tr>");
        }
        
        $("#on").html(count);
        $("#o").html(Object.keys(playerLNNs).length);
            
        if (!$("#overallc").is(":checked")) {
            hide("overall");
        }
            
        if (!$("#playersc").is(":checked")) {
            hide("players");
        }
        
        $("#autosort2").click();
        $("#autosort2").click();
        $("#autosort2").click();
        $("#autosort1").click();
        $("#autosort1").click();
    }, "json");
});