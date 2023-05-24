import type { Action, UnknownKeyString } from '../types/action.type';

/**
 * an object of properties will be treated as css custom variables.
 * By defining this object inside of a $: {} reactive block, `useCssVariable` can update those css properties on the fly whenever some of its values change.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { cssVariable } from '../useCssVariable.action'
 *
 *   let isRed = true;
 *
 *   $: styleVars = {
 *     titleColor: isRed ? 'red' : 'blue',
 *   };
 * </script>
 *
 * <div use:cssVariable="{styleVars}">
 *   <!-- anything here will have access to var(--titleColor) -->
 *   <p>This text is normal</p>
 *   <p class='example'>This text is using the variable</p>
 * </div>
 *
 * <Button on:click={() => isRed = !isRed}>Click to switch colors</Button>
 *
 * <style>
 *   .example {
 *     color: var(--titleColor);
 *   }
 * </style>
 * ```
 */
export function cssVariable(
  node: HTMLElement,
  props: UnknownKeyString<string>,
): ReturnType<Action> {
  Object.entries(props).forEach(([key, value]) => {
    node.style.setProperty(`--${key}`, `${value}`);
  });

  return {
    update(_props: UnknownKeyString<string>) {
      Object.entries(_props).forEach(([key, value]) => {
        node.style.setProperty(`--${key}`, `${value}`);
        delete props[key];
      });

      Object.keys(props).forEach((name) => node.style.removeProperty(`--${name}`));
      props = _props;
    },
  };
}
