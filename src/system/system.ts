/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Game as Game} from './game';
import {JSON as JXON} from '../internal/util/json';

export class System{

  /**
   * Gets all currently running games
   *
   * @return {Promise<Game>}
   */
  static getGames(): Promise<Game[]> {
    return new Promise(resolve => {
      iApp.getAsList('gsenum').then(gamesJXON => {
        let games: Game[] = [];
        if (gamesJXON !== undefined) {
          var gamesJXONLength = gamesJXON.length;
          for (var i = 0; i < gamesJXONLength; ++i) {
            games.push(Game.parse(gamesJXON[i]));
          }
        }
        resolve(games);
      });
    });
  }
}
