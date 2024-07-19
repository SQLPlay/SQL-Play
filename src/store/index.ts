import {atom} from 'nanostores/atom';

import commandsJSON from '../data/commands.json';

export const $isAppLoading = atom(true);
export const $isSearchOpen = atom(false);
export const $searchedCommandsResult = atom(commandsJSON);
export const $searchText = atom('');
