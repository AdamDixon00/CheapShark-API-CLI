import axios from 'axios';

const BASE_URL = 'https://www.cheapshark.com/api/1.0';

/**
 * Fetches a list of games from the Cheapshark API based on the keyword given.
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of game objects.
 */

export const searchByKeyword = async (keyword)=> {
    try {
        // create query for games
        const query = `${BASE_URL}/games?title=${keyword}`;
        const response = await axios.get(query);

        return response.data;
    } catch (error) {
        console.error('Error searching for games:', error.message);
        throw error;
    }
}

/**
 * Fetches a list of games from the Cheapshark API based on the keyword given.
 * @param {string} deal - The deal to search for.
 * @returns {Promise<Object>} A promise that resolves to a deal objects.
 */

export const findDeal = async (deal)=> {
    try {
        const query = `${BASE_URL}/deals?id=${deal}`;
        const response = await axios.get(query);
        
        return response.data;
    } catch (error) {
        console.error('Error searching for deal:', error.message);
        throw error;
    }
}

/**
 * Fetches a list of stores from the Cheapshark API.
 * @returns {Promise<Array>} A promise that resolves to a store object array.
 */

export const getStores = async () => {
    try {
        const query = `${BASE_URL}/stores`;
        const response = await axios.get(query);
        
        return response.data;
    } catch (error) {
        console.error('Error searching for stores:', error.message);
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
                id: id
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching for details for game:', error.message);
        throw error;
    } 
}