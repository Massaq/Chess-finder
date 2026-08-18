import { AJAX } from './helpers.js';
import default_avatar from 'url:../imgs/default_avatar.png';
import { BATCH_SIZE } from './config.js';

export const state = {
  player: {},
  playerStats: {},
  allArchives: [],
  fetchedArchives: [],
  playerEloHistory: { rapid: [], blitz: [], bullet: [] },
};

const extractStats = function (modeData) {
  return {
    current: modeData?.last?.rating || 'Unrated',
    best: modeData?.best?.rating || '-',
    record: modeData?.record || null
  };
};

export const getPlayerEloHistory = async function (username, monthsCount) {
  try {
    let archivesToFetch = [];
    
    if (monthsCount === 'all') {
      archivesToFetch = state.allArchives;
    } else {
      archivesToFetch = state.allArchives.slice(-Number(monthsCount));
    }

    
    archivesToFetch = archivesToFetch.filter(url => !state.fetchedArchives.includes(url));

    if (archivesToFetch.length === 0) return; 

   

    for (let i = 0; i < archivesToFetch.length; i += BATCH_SIZE) {
      const batchUrls = archivesToFetch.slice(i, i + BATCH_SIZE);
      
      const batchResponses = await Promise.all(
        batchUrls.map(url => 
          AJAX(url).catch(err => {
            console.warn(`Архів ${url} недоступний на Chess.com.`);
            return { games: [] };
          })
        )
      );

      batchResponses.forEach((monthData, index) => {
        state.fetchedArchives.push(batchUrls[index]); 

        monthData.games.forEach(game => {
          if (!game.rated) return;
          
          const mode = game.time_class;
          if (!state.playerEloHistory[mode]) return;

          const isWhite = game.white.username.toLowerCase() === username.toLowerCase();
          const rating = isWhite ? game.white.rating : game.black.rating;

          const timestamp = game.end_time * 1000;
          const dateObj = new Date(timestamp);
          const dateString = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

          state.playerEloHistory[mode].push({ timestamp, date: dateString, rating });
        });
      });
    }

    ['rapid', 'blitz', 'bullet'].forEach(mode => {
      state.playerEloHistory[mode].sort((a, b) => a.timestamp - b.timestamp);
    });

  } catch (err) {
    throw err;
  }
}


export const getFilteredHistory = function (mode, monthsCount) {
  if (monthsCount === 'all') return state.playerEloHistory[mode];
  
  const history = state.playerEloHistory[mode];
  if (history.length === 0) return []; 
  
  const latestGameTimestamp = history[history.length - 1].timestamp;
  const cutoff = latestGameTimestamp - (Number(monthsCount) * 30 * 24 * 60 * 60 * 1000);
  
  return history.filter(item => item.timestamp >= cutoff);
};

export const getPlayer = async function (username) {
  try {
    const data = await AJAX(`https://api.chess.com/pub/player/${username}`);

    const countryCode = data.country.slice(-2).toUpperCase();
    
    let fullCountryName = countryCode; 
    try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        fullCountryName = regionNames.of(countryCode);
    } catch (err) {
        fullCountryName = countryCode;
    }

    state.player = {
      username: data.username,
      name: data.name || data.username,
      avatar: data.avatar || default_avatar,
      title: data.title || 'No Title',
      country: fullCountryName,
      joined: new Date(data.joined * 1000).toLocaleDateString(),
      lastOnline: new Date(data.last_online * 1000).toLocaleDateString(),
      status: data.status,
    };
    
  } catch (err) {
    throw err;
  }
};

export const getPlayerStats = async function (username) {
  try {
    const data = await AJAX(`https://api.chess.com/pub/player/${username.toLowerCase()}/stats`);
    
    state.playerStats = {
      rapid: extractStats(data.chess_rapid),
      blitz: extractStats(data.chess_blitz),
      bullet: extractStats(data.chess_bullet),
    };
  } catch (err) {
    console.warn(`Chess.com Stats API is down: ${err.message}. Using fallback data.`);
    
  
    state.playerStats = {
      rapid: extractStats(null),
      blitz: extractStats(null),
      bullet: extractStats(null),
    };
  }
};

export const loadSearchQuery = async function (username) {
  try {
  
    const archivesData = await AJAX(`https://api.chess.com/pub/player/${username.toLowerCase()}/games/archives`);
    state.allArchives = archivesData.archives || [];
    state.fetchedArchives = [];
    state.playerEloHistory = { rapid: [], blitz: [], bullet: [] };

    await Promise.all([
      getPlayer(username),
      getPlayerStats(username),
      getPlayerEloHistory(username, 1) 
    ]);
  } catch (err) {
    console.error(err);
    throw err;
  }
};



