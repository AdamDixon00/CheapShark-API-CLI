import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { search, keywordHistory, selectionHistory } from './app.js';

yargs(hideBin(process.argv))
    .usage('$0: Usage <command> [options]')
    .command(
        // defining command
        'search <game>',
        // description of command
        'search for a game and associated deals',
        // builder functions
        (yargs) => {
            yargs 
                // name of game is mandatory
                .positional('game', {
                    describe: 'name of the game',
                    type: 'string'
                })
        },
        (args) => {
            search(args.game);
        }
    )
    .command(
        'history <type>', // Command name and required positional argument "type"
    
        // Description that shows up in the --help output
        'view search history: "keywords" for past searches, "selections" for past selected items',
    
        // Builder function to configure the argument
        (yargs) => {
            yargs.positional('history', {
                describe: 'type of history to view', // Description shown in help
                type: 'string',                      // Argument must be a string
                choices: ['keywords', 'selections']  // Restrict allowed values
            });
        },

        // Handler function - executes when user runs this command
        (args) => {
            // If type is "keywords", call keywordHistory(); otherwise, call selectionHistory()
            if (args.type === 'keywords') {
                keywordHistory();
            } else if(args.type === 'selections'){
                selectionHistory();
            } else {
                console.log(`${args.history} is not a valid option. :(`);
            }
        }
    )
    .help().argv;