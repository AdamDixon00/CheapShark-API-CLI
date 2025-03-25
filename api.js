import axios from 'axios';

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

/**
 * Fetches a list of games from the Cheapshark API based on the jey word given.
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of game objects.
 */

export const searchByKeyword = async (keyword)=> {
    try {
        const response = await axios.get(`${BASE_URL}/games`, {
            params: {
                title: keyword
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching for games:', error.message);
        throw error;
    }
}

/**
 * Get info about a game by it's ID.
 * @param {string} id - The ID of the game.
 * @returns {Promise<Object>} Detailed game information.
 */

export const getGameInfoById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/games`, {
            params: {
                id: gameID
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching for details for game:', error.message);
        throw error;
    } 
}
