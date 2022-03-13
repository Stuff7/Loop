import View from './view.html?raw';
import './style.scss';
import { createElementFromHTML } from '@Loop/utils/dom';

interface FPSCounterState {
  setTimestamp(timestamp: number): void;
}

function FPSCounter() {
  const Component = createElementFromHTML<HTMLDivElement>(View);
  const FPS = Component.querySelector<HTMLSpanElement>('.fps')!;

  let timestamp = 0;
  const State: FPSCounterState = {
    setTimestamp(newTimestamp: number) {
      const elapsed = newTimestamp - timestamp;
      timestamp = newTimestamp;

      FPS.innerText = Math.round(1e3 / elapsed).toString();
    },
  };

  return {
    Component,
    State,
  };
}

export const init = {
  Identifier: 'data-fps-counter',
  buildComponent: FPSCounter,
};
