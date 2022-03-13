import { Obj } from '@Loop/types';

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export function createElementFromHTML<T extends HTMLElement = HTMLElement>(html: string) {
  const element = document.createElement('div');
  element.innerHTML = html;

  return element.firstChild as T;
}

export function getElementAttributes<T extends HTMLElement>(
  element: T,
  blacklist: string[] = [],
) {
  const attributes: Obj = {};
  for (const attribute of element.attributes) {
    if (blacklist.includes(attribute.name)) {
      continue;
    }
    attributes[attribute.name] = attribute.value;
  }

  return attributes;
}

export function setElementAttributes<T extends HTMLElement>(
  element: T,
  attributes?: Obj,
) {
  for (const attr in attributes) {
    if (attr === 'class') {
      element.classList.add(attributes[attr]);
      continue;
    }
    element.setAttribute(attr, attributes[attr]);
  }
}

export function copyElementAttributes<
  A extends HTMLElement,
  B extends HTMLElement,
>({
  from,
  to,
  blacklist,
}: { from: A, to: B, blacklist?: string[]}) {
  setElementAttributes(to, getElementAttributes(from, blacklist));
}
