import View from './view.html?raw';
import './style.scss';
import { createElementFromHTML } from '@Loop/utils/dom';
import { Obj } from '@Loop/types';

interface DebugDialogState {
  setOutput(output: Obj<any>): void;
}

function DebugDialog() {
  const Component = createElementFromHTML<HTMLDivElement>(View);
  const Output = Component.querySelector<HTMLSpanElement>('.output')!;

  const State: DebugDialogState = {
    setOutput(output: Obj<any>) {
      Output.innerText = JSON.stringify(output, null, 2);
    },
  };

  return {
    Component,
    State,
  };
}

export const init = {
  Identifier: 'data-debug-dialog',
  buildComponent: DebugDialog,
};
