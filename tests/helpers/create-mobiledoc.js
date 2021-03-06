import {
  MOBILEDOC_VERSION_0_3_1
} from 'mobiledoc-apple-news-renderer/utils/mobiledoc-versions';
const MOBILEDOC_VERSION = MOBILEDOC_VERSION_0_3_1;
import {
  MARKUP_SECTION_TYPE,
  CARD_SECTION_TYPE
} from 'mobiledoc-apple-news-renderer/utils/section-types';
import {
  MARKUP_MARKER_TYPE,
  ATOM_MARKER_TYPE
} from 'mobiledoc-apple-news-renderer/utils/marker-types';

export function createBlankMobiledoc({version=MOBILEDOC_VERSION}={}) {
  return {
    version,
    atoms: [],
    cards: [],
    markups: [],
    sections: []
  };
}

export function createMobiledocWithAtom({version=MOBILEDOC_VERSION, atom}={}) {
  return {
    version,
    atoms: [atom],
    cards: [],
    markups: [],
    sections: [
      [MARKUP_SECTION_TYPE, 'P', [
        [ATOM_MARKER_TYPE, [], 0, 0]]
      ]
    ]
  };
}

export function createMobiledocWithCard({version=MOBILEDOC_VERSION, card}={}) {
  return {
    version,
    atoms: [],
    cards: [
      [card.name, card.payload || {}]
    ],
    markups: [],
    sections: [
      [CARD_SECTION_TYPE, 0]
    ]
  };
}

export function createSimpleMobiledoc({sectionName='p', text='hello world', markup=null, version=MOBILEDOC_VERSION}={}) {
  let openedMarkups = markup ? [0] : [];
  let closedMarkups = markup ? 1 : 0;
  let markups = markup ? [markup] : [];

  return {
    version,
    atoms: [],
    cards: [],
    markups: markups,
    sections: [
      [MARKUP_SECTION_TYPE, sectionName, [
        [MARKUP_MARKER_TYPE, openedMarkups, closedMarkups, text]]
      ]
    ]
  };
}
