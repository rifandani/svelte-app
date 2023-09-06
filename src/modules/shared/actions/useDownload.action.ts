import { tick } from 'svelte';
import type { ActionReturn } from 'svelte/action';

type Params = { blob: Blob; filename: string };

/**
 * a download will occur with a given Blob object as a file with the given filename.
 *
 * @example
 *
 * ```tsx
 * <script>
 *   import { download } from '../useDownload.action'
 * </script>
 *
 * <button use:download={{ blob: new Blob([JSON.stringify({ hello: 'world' })], { type: 'application/json' }), filename: "test.txt" }} on:usedownload={() => { alert('File Downloaded')}}>Download</button>
 * ```
 */
export function download(node: HTMLElement, params: Params): ActionReturn<Params, HTMLElement> {
  const onClick = () => {
    const { blob, filename } = params;
    const anchor = document.createElement('a');
    const url = URL.createObjectURL(blob);

    anchor.href = url;
    anchor.download = filename || '';
    document.body.appendChild(anchor);

    anchor.click();
    tick()
      .then(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        node.dispatchEvent(new CustomEvent('usedownload', { detail: { blob, filename } }));
      })
      .catch((err) =>
        node.dispatchEvent(
          new CustomEvent('usedownloadError', {
            detail: { error: err as Error, blob, filename },
          }),
        ),
      );
  };

  node.addEventListener('click', onClick, true);

  return {
    update: (_params) => (params = _params),
    destroy: () => node.removeEventListener('click', onClick, true),
  };
}
