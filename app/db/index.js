const mysql = require('mysql');

const MatchesByPlayer = require('./matchesBypage');
const Match = require('./match');
const Player = require('./player');
const Stats = require('./stats');
const Heroes = require('./heroes');
const pages = require('./pages');

const db = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "pagequalitymonitor",
  password: "qpmpass",
  database: "pagequalitymonitor",
});


db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

exports.get = function() {
  return db;
}

exports.saveMatchesBypage = function(pageId, matches) {
  const response = [];
  // return;
  // console.log(matches);
  matches.forEach(match => {
    response.push(MatchesByPlayer.insertOrUpdate(db, pageId, match));
  });

  return Promise.all(response);
}

exports.getMatchIdsToLoad = function(playerId) {
  return MatchesByPlayer.getMatchIdsToLoad(db, playerId);
}

exports.saveMatchDetails = function(matchDetails, pageId) {

  Match.insertOrUpdate(db, {
    match_id: matchDetails.match_id,
    dire_score: matchDetails.dire_score,
    radiant_score: matchDetails.radiant_score,
    radiant_win: matchDetails.radiant_win,
    start_time: matchDetails.start_time,
  });

  MatchesByPlayer.insertOrUpdate(db, pageId, {
    match_id: matchDetails.match_id,
    details_loaded: true
  });

  matchDetails.players.forEach((player, i) => {
    Player.insertOrUpdate(db, {
        id: `${player.match_id}_${i}`,
        page_id: player.page_id,
        match_id: player.match_id,
        assists: player.assists,
        backpack_0: player.backpack_0,
        backpack_1: player.backpack_1,
        backpack_2: player.backpack_2,
        backpack_3: player.backpack_3,
        deaths: player.deaths,
        denies: player.denies,
        gold_per_min: player.gold_per_min,
        hero_id: player.hero_id,
        item_0: player.item_0,
        item_1: player.item_1,
        item_2: player.item_2,
        item_3: player.item_3,
        item_4: player.item_4,
        item_5: player.item_5,
        item_neutral: player.item_neutral,
        kills: player.kills,
        last_hits: player.last_hits,
        level: player.level,
        net_worth: player.net_worth,
        party_id: player.party_id,
        party_size: player.party_size,
        xp_per_min: player.xp_per_min,
        pagename: player.pagename,
        isRadiant: player.isRadiant,
        win: player.win,
        total_gold: player.total_gold,
        total_xp: player.total_xp,
    });
  })
}

exports.getTeamCombinationStats = function(pageId) {
  return Stats.getTeamCombinationStats(db, pageId)
}


exports.getBestHeroesInTeam = function(pageId) {
  return Stats.getBestHeroesInTeam(db, pageId)
}

exports.getBestHeroesInEnemyTeam = function(pageId) {
  return Stats.getBestHeroesInEnemyTeam(db, pageId)
}





exports.saveHeroes = function(heroStats) {
  const response = [];

  heroStats.forEach(hero => {
    response.push(Heroes.insertOrUpdate(db, hero));
  });

  return Promise.all(response);
}

exports.getHeroes = function() {
  return Heroes.get(db);
}

exports.getpages = function() {
  return pages.get(db);
}

exports.savepage = function(data) {
  return pages.insertOrUpdate(db, data);
}

exports.deletepage = function(id) {
  return pages.delete(db, id);
}