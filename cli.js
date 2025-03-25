import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { search } from './app.js';

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
    .help().argv;