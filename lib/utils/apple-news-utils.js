export const TAG_NAME_TO_AN_ROLE = {
  'p': 'body',
  'aside': 'pullquote',
  'blockquote': 'quote',
  'h1': 'heading1',
  'h2': 'heading2',
  '__default__': 'body'
};

export const AN_DEFAULT_ARTICLE_LAYOUT = {
  "columns": 10,
  "width": 1024,
  "margin": 85,
  "gutter": 20
};

export const AN_DEFAULT_DOCUMENT_STYLE = {
  "color": "#FFFFFF"
};

export function getComponentLayout(component) {
  let { role } = component;
  return AN_DEFAULT_COMPONENT_LAYOUTS[role] || {};
}

export const AN_DEFAULT_COMPONENT_LAYOUTS = {
  body: "quarterMarginBelowLayout",
  byline: "fullMarginBelowLayout",
  heading: "heading1Layout",
  heading1: "heading1Layout",
  heading2: "heading1Layout",
  photo: "fullBleedLayout",
  heading2: "fullMarginAboveHalfBelowLayout",
  pullquote: "halfMarginAboveQuarterBelowLayout",
  tweet: "noMarginLayout",
  quote: "halfMarginAboveQuarterBelowLayout"
};

// from https://developer.apple.com/library/content/documentation/General/Conceptual/News_Design_Tutorial/TheJSON.html#//apple_ref/doc/uid/TP40016784-CH19-SW1
export const AN_NAMED_COMPONENT_LAYOUTS = {
  "noMarginLayout": {
    "columnStart": 0,
    "columnSpan": 7
  },
  "heading1Layout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 24,
      "bottom": 3
    }
  },
  "quarterMarginBelowLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "bottom": 6
    }
  },
  "halfMarginBelowLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "bottom": 12
    }
  },
  "fullMarginBelowLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "bottom": 24
    }
  },
  "fullMarginAboveHalfBelowLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 24,
      "bottom": 12
    }
  },
  "bigDividerLayout": {
    "ignoreDocumentMargin": "right",
    "columnStart": 0,
    "columnSpan": 10,
    "margin": {
      "top": 6,
      "bottom": 6
    }
  },
  "fullBleedLayout": {
    "ignoreDocumentMargin": true
  },
  "halfMarginBothLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 12,
      "bottom": 12
    }
  },
  "fullMarginAboveLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 24
    }
  },
  "halfMarginAboveQuarterBelowLayout": {
    "columnStart": 0,
    "columnSpan": 7,
    "margin": {
      "top": 12,
      "bottom": 6
    }
  }
};

export const AN_NAMED_COMPONENT_TEXT_STYLES = {
  "default": {
    "fontName": "DINAlternate-Bold",
    "textColor": "#222222",
    "fontSize": 16,
    "lineHeight": 22,
    "linkStyle": {
      "textColor": "#D5B327"
    }
  },
  "default-body": {
    "fontName": "IowanOldStyle-Roman",
    "paragraphSpacingBefore": 12,
    "paragraphSpacingAfter": 12
  },
  "default-title": {
    "fontName": "HelveticaNeue-Bold",
    "fontSize": 64,
    "lineHeight": 74,
    "textColor": "#000"
  },
  "default-intro": {
    "fontName": "DINAlternate-Bold",
    "fontSize": 18,
    "lineHeight": 22,
    "textColor": "#A6AAA9"
  },
  "default-byline": {
    "fontName": "DINAlternate-Bold",
    "fontSize": 15,
    "lineHeight": 18,
    "textColor": "#53585F"
  },
  "default-heading2": {
    "fontName": "DINAlternate-Bold",
    "tracking": 0.05,
    "fontSize": 28,
    "textColor": "#53585F"
  },
  "default-heading1": {
    "fontName": "DINAlternate-Bold",
    "tracking": 0.12,
    "fontSize": 28,
    "textColor": "#53585F"
  },
  "bodyFirstDropCap": {
    "dropCapStyle": {
      "fontName": "DINAlternate-Bold",
      "textColor": "#A6AAA9",
      "numberOfLines": 2
    }
  },
  "default-caption": {
    "fontName": "IowanOldStyle-Italic",
    "fontSize": 12,
    "lineHeight": 16,
    "paragraphSpacingBefore": 12,
    "paragraphSpacingAfter": 12,
    "textColor": "#53585F"
  },
  "default-pullquote": {
    "fontName": "DINAlternate-Bold",
    "fontSize": 30,
    "lineHeight": 36,
    "textColor": "#A6AAA9",
    "hangingPunctuation": true
  },
  "attribution": {
    "fontName": "DINAlternate-Bold",
    "fontSize": 12,
    "lineHeight": 16,
    "tracking": 0.12,
    "textColor": "#53585F",
    "textAlignment": "right"
  }
};

export const AN_DEFAULT_COMPONENT_TEXT_STYLES = AN_NAMED_COMPONENT_TEXT_STYLES;
