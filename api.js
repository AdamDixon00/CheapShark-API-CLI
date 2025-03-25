// 📦 Import axios to make HTTP requests
import axios from 'axios';

// 🌍 Base URL for all CheapShark API endpoints
const BASE_URL = 'https://www.cheapshark.com/api/1.0';

/**
 * 🔎 searchByKeyword
 * Searches for games that match a keyword (title).
 * 
 * @param {string} keyword - The keyword to search (e.g. "Halo")
 * @returns {Promise<Array>} - A list of games matching the keyword
 */
export const searchByKeyword = async (keyword) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        title: keyword  // 🔍 Title is passed as query param
      }
    });
    return response.data; // ✅ Return array of results
  } catch (error) {
    console.error('Error searching for games:', error.message);
    throw error;
  }
};

/**
 * 🔥 getTopDeals
 * Fetches the top 10 best-rated Steam deals currently available.
 * 
 * @returns {Promise<Array>} - A list of discounted game deals
 */
export const getTopDeals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/deals`, {
      params: {
        storeID: 1,            // 1 = Steam store
        sortBy: 'Deal Rating', // 📈 Sorted by best deal ratings
        pageSize: 10           // Limit to top 10 deals
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top deals:', error.message);
    throw error;
  }
};

/**
 * 🧾 getGameDetailsById
 * Fetches detailed deal info for a game using its Game ID.
 * 
 * @param {string} gameID - The game's unique ID from the search results
 * @returns {Promise<Object>} - Full game info with deals array
 */
export const getGameDetailsById = async (gameID) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        id: gameID // 📌 Passed as query param to get full info
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error.message);
    throw error;
  }
};


export const getStoreList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/stores`);
      return response.data; // This is an array of store objects
    } catch (error) {
      console.error('Error fetching store list:', error.message);
      throw error;
    }
  };
  
