import debounce from 'lodash-es/debounce';
import {atom} from 'nanostores';

export const $inputQuery = atom('SELECT title from employees');
export const $inputSelection = atom({start: 0, end: 0});
export const $queryEdits = atom<string[]>([]);
export const $undoRedoPosition = atom(-1);
export const $pressedUndoRedo = atom(false);
export const $cameFromUndoRedo = atom(false);

const debouncedQueryUpdate = debounce((val: string) => {
  $queryEdits.set([...$queryEdits.get(), val]);
}, 200);

$inputQuery.subscribe(val => {
  // don't do anything if undo is pressed
  if ($pressedUndoRedo.get()) {
    setTimeout(() => $pressedUndoRedo.set(false), 60);
    return;
  }
  if ($cameFromUndoRedo.get()) {
  }
  debouncedQueryUpdate(val);
});
