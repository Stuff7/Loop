import { $$, copyElementAttributes } from '@Loop/utils/dom';
import { Obj } from '@Loop/types';
import assert from '@Loop/utils/assert';
import { init as FPSCounter} from './FPSCounter';
import { init as DebugDialog } from './DebugDialog';

type ComponentFn<C extends HTMLElement, S> = () => {
  Component: C;
  State: S;
};

function init<C extends HTMLElement, S, T extends ComponentFn<C, S>>({
  buildComponent,
  Identifier,
  Attributes = [],
}: {
  buildComponent: T;
  Identifier: string;
  Attributes?: string[];
}) {
  const elements = $$<HTMLElement>(`[${Identifier}]`);
  const ComponentMap: Obj<ReturnType<T>['State']> = {};
  const ComponentName = buildComponent.prototype.constructor.name;

  elements.forEach(element => {
    const { Component, State } = buildComponent();

    copyElementAttributes({
      blacklist: [Identifier, ...Attributes],
      from: element,
      to: Component,
    });

    element.replaceWith(Component);
    ComponentMap[element.id] = State;
  });

  return (id: string) => {
    const state = ComponentMap[id];
    assert(state, `Could not find "${ComponentName}" component with id "${id}"`);

    return state;
  };
}

export const getFPSCounter = init(FPSCounter);
export const getDebugDialog = init(DebugDialog);
