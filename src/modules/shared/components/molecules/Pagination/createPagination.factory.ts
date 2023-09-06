import type {
  PaginationConfig,
  PaginationItem,
  PaginationReturn,
} from '@shared/types/pagination.type';
import { writableEffect } from '@shared/utils/store/store.util';
import { derived, readable, writable } from 'svelte/store';

function getPageItem(item: string | number, page: number, count: number): PaginationItem {
  if (typeof item === 'number') {
    return {
      type: 'page',
      page: item,
      selected: item === page,
    };
  }

  switch (item) {
    case 'first':
      return { type: item, page: 1, disabled: page <= 1 };
    case 'previous':
      return { type: item, page: page - 1, disabled: page <= 1 };
    case 'next':
      return { type: item, page: page + 1, disabled: page >= count };
    case 'last':
      return { type: item, page: count, disabled: page >= count };
    default:
      return { type: item as 'ellipsis-start' | 'ellipsis-end', page: null, disabled: true };
  }
}

function getItems({
  boundaryCount,
  count,
  hideNextButton,
  hidePrevButton,
  page,
  hideFirstButton,
  hideLastButton,
  siblingCount,
}: {
  boundaryCount: number;
  count: number;
  hideNextButton: boolean;
  hidePrevButton: boolean;
  page: number;
  hideFirstButton: boolean;
  hideLastButton: boolean;
  siblingCount: number;
}) {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  // Basic list of items to render
  return [
    ...(hideFirstButton ? [] : ['first']),
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,

    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? ['ellipsis-start']
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['ellipsis-end']
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next']),
    ...(hideLastButton ? [] : ['last']),
  ].map((i) => getPageItem(i, page, count));
}

/**
 * Allow user to select a specific page from a range of pages.
 */
export const createPagination = ({
  boundaryCount = 1,
  total = 0,
  perPage = 10,
  hideNextButton = false,
  hidePrevButton = false,
  page = 1,
  hideFirstButton = true,
  hideLastButton = true,
  siblingCount = 1,
  ariaLabel = 'Pagination Navigation',
  getPageAriaLabel = (page: number) => `Goto Page ${page}`,
  onPageChange,
}: PaginationConfig = {}): PaginationReturn => {
  const page$ = writableEffect(page, onPageChange);
  const total$ = writable(total);
  const perPage$ = writable(perPage);

  const count$ = derived([total$, perPage$], ([$total, $perPage]) => {
    return Math.ceil(+$total / +$perPage);
  });

  const items = derived([page$, count$], ([$page, $count]) => {
    const itemList = getItems({
      boundaryCount,
      count: $count,
      hideNextButton,
      hidePrevButton,
      page: $page,
      hideFirstButton,
      hideLastButton,
      siblingCount,
    });

    return itemList;
  });

  const navAttrs = readable({ role: 'navigation', 'aria-label': ariaLabel });

  const pageAttrs = derived(page$, () => {
    return function (item: PaginationItem) {
      return {
        ...(item.page && !item.disabled
          ? { 'aria-label': getPageAriaLabel(item.page, !!item.selected) }
          : {}),
        ...(item.selected ? { 'aria-current': 'page' } : {}),
        ...(item.disabled ? { disabled: 'true' } : {}),
      };
    };
  });

  const start = derived([page$, perPage$, total$], ([$page, $perPage, $total]) =>
    Math.min(Math.max(1 + ((+$page || 1) - 1) * +$perPage, 0), +$total),
  );

  const end = derived([start, perPage$, total$], ([$start, $perPage, $total]) =>
    Math.min($start + (+$perPage - 1), +$total),
  );

  return {
    navAttrs,
    pageAttrs,
    items,
    page: page$,
    start,
    end,
    total: total$,
    perPage: perPage$,
  };
};
