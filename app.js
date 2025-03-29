import * as api from './api.js';
import * as db from './db.js';
import { select, Separator } from '@inquirer/prompts';

// displays deal for selected game
const _displayDeal = async (gameDeal) => {
    // find the name of the store for us
    let store = '';
    const stores = await api.getStores();

    // finds store name
    for (const st in stores)
    {
        if(stores[st].storeID === gameDeal.gameInfo.storeID)
        {
            store = stores[st].storeName;
            break;
        }
    }

    // displays our message
    console.log(`->${gameDeal.gameInfo.name} can be found at ${store} for $${gameDeal.gameInfo.salePrice}<-`);
};

// allows user to select the game they are looking for
const _gameSelection = async (games) => {
    const displayGames = games.map((game) => {
        return { name: `${game.external}`, value: game };
    })

    return await select({
        message: 'Select game to view more info',
        choices: displayGames
    })
};

// adds entries into db and catches dupes
const _addToDB = async (dbName, entry) => {
    
    // checks if key is already in db
    if (!(await db.find(dbName, entry)).length)
        await db.insert(dbName, entry);
};

// searches for and displays games for users selection
export const search = async (gameName) => {
    try {
        // gets results from api call
        const games = await api.searchByKeyword(gameName);

        // displays games found
        const game = await _gameSelection(games);
        const gameDeal = await api.findDeal(game.cheapestDealID);

        //displays our deal
        await _displayDeal(gameDeal);

        // create an entry to store
        const entry = {
            keyword: gameName,
            results: games
        }
        // create entry to store our selection
        const selection = {
            keyword: game.external,
            deal: game.cheapestDealID
        }

        // adds to our db
        await _addToDB('search_history_keyword', entry);
        await _addToDB('search_history_selection', selection);

    } catch (error) {
        console.error(error);
    }
};

// Prints previously-used keywords and allows an option to use one for search
export const keywordHistory = async () => {
    // Pulls keyword history and formats it for printing
    const rawKeyHistory = await db.find('search_history_keyword');

    // If no history, inform the user and stop
    if (!rawKeyHistory.length) {
        console.log("No keyword history available.");
        return;
    }

    const keyHistory = rawKeyHistory.map((entry) =>{
        return {name: `${entry.keyword}`, value: `${entry.keyword}`};
    });
    _printHistory("Search Keyword History", keyHistory);

    // Must be named "name:" and "value:" to display choices properly
    // Prompts user to terminate or perform a search on a recorded keyword from history
    const willSelect = await select({
        message: 'Pick an option',
        choices: [
            {name: "Exit", value: false},
            {name: "Select a keyword", value: true}
        ]
    });

    // Prompts user for keyword from history to perform a search 
    if(willSelect){
        search(
            await select({
                message: 'Pick a keyword',
                choices: keyHistory
            })
        );
    }
};


// Finish Later
// Prints previously-used selections and allows an option to use one for search (runs api.findDeal(someGame.deal))
export const selectionHistory = async () => {
    try {
        // Read all past selections from the local DB
        const rawSelectionHistory = await db.read('search_history_selection');

        // If no history, inform the user and stop
        if (!rawSelectionHistory.length) {
            console.log("No selection history available.");
            return;
        }

        // Build prompt choices: Exit first, then game entries
        const choices = [
            { name: "Exit", value: null },
            ...rawSelectionHistory.map((entry) => ({
                name: `${entry.keyword}`,  // Display game title
                value: entry.deal          // Value = deal ID for API lookup
            }))
        ];

        // Show selection prompt
        const selectedDealId = await select({
            message: 'Select a past game to view deal info:',
            choices: choices
        });

        // Exit early if user chose "Exit"
        if (!selectedDealId) {
            console.log("Exited.");
            return;
        }

        // Fetch and display deal details for the selected item
        const deal = await api.findDeal(selectedDealId);
        await _displayDeal(deal);

    } catch (error) {
        console.error("Error accessing selection history:", error.message);
    }
};

// Prints out either Keyword or Selection history based on 'collection' arg
const _printHistory = (collection, data) => {
    console.log(`- - - - - - - - ${collection} - - - - - - - -`);
    data.forEach((entry) => {
        console.log(`${entry.name}`);
    });
    console.log(`- - - - - - - - - - - - - - - - - - - - - - - - - - - -`);
};