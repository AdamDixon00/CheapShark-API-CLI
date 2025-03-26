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
    /*TO IMPLEMENT:
        define command: 'history <keyword / selections>'
            Add command description
            Add a builder function
            Create a handler function to accept either case
                Call function keywordHistory or selectionHistory
    */
    // .command(
        
    // )

    // Define 'history' command
    .command(
      'history <type>', // Command structure
      'view search history (keywords or selections)', // Description

      // Validate the type argument
      (yargs) => {
          yargs.positional('type', {
              describe: 'either "keywords" or "selections"',
              type: 'string',
              choices: ['keywords', 'selections'] // restrict input to two valid values
          });
      },

      // Handler to call appropriate function based on input
      (args) => {
          if (args.type === 'keywords') {
              keywordHistory();
          } else if (args.type === 'selections') {
              selectionHistory();
          }
      }
  )

    .help().argv;