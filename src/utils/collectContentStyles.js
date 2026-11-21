const GLOBAL_AT_RULES = [
  'CSSFontFaceRule',
  'CSSKeyframesRule',
  'CSSCounterStyleRule',
  'CSSPropertyRule',
  'CSSFontFeatureValuesRule',
  'CSSFontPaletteValuesRule',
  'CSSNamespaceRule',
  'CSSLayerStatementRule',
];

function isGlobalAtRule(rule) {
  return GLOBAL_AT_RULES.some((name) => {
    const Constructor = globalThis[name];
    return typeof Constructor === 'function' && rule instanceof Constructor;
  });
}

function buildFingerprint(content) {
  const tags = new Set();
  const classes = new Set();
  const ids = new Set();
  const elements = [];

  if (content instanceof Element) elements.push(content);
  if (typeof content.querySelectorAll === 'function') {
    elements.push(...content.querySelectorAll('*'));
  }

  for (const element of elements) {
    if (!(element instanceof Element)) continue;

    tags.add(element.localName.toLowerCase());
    for (const className of element.classList) classes.add(className);
    if (element.id) ids.add(element.id);
  }

  return { tags, classes, ids };
}

function getSubjectNodes(selector) {
  const nodes = selector.children.toArray();
  let subjectStart = 0;

  nodes.forEach((node, index) => {
    if (node.type === 'Combinator' || node.type === 'WhiteSpace') {
      subjectStart = index + 1;
    }
  });

  return nodes.slice(subjectStart);
}

function isSubjectPossible(nodes, fingerprint) {
  const firstType = nodes.find((node) => node.type === 'TypeSelector');
  if (firstType && /^(html|body)$/i.test(firstType.name)) return true;

  const hasRootPseudo = nodes.some(
    (node) => node.type === 'PseudoClassSelector' && node.name === 'root'
  );
  if (hasRootPseudo) return true;

  return nodes.every((node) => {
    if (node.type === 'ClassSelector') {
      return fingerprint.classes.has(node.name);
    }
    if (node.type === 'IdSelector') {
      return fingerprint.ids.has(node.name);
    }
    if (node.type === 'TypeSelector') {
      return fingerprint.tags.has(node.name.toLowerCase());
    }
    return true;
  });
}

function getSubjectSelector(nodes, generate) {
  return nodes
    .filter(
      (node) =>
        node.type !== 'PseudoClassSelector' &&
        node.type !== 'PseudoElementSelector'
    )
    .map((node) => generate(node))
    .join('');
}

function isSubjectMatched(content, subject) {
  if (!subject) return true;
  if (subject === '*') return true;
  if (/^(html|body)(?![\w-])/i.test(subject)) return true;

  if (content instanceof Element) {
    try {
      if (content.matches(subject)) return true;
    } catch {
      return false;
    }
  }

  try {
    return Boolean(content.querySelector?.(subject));
  } catch {
    return false;
  }
}

function selectorListMatches(content, selectorText, context) {
  let selectorList;

  try {
    selectorList = context.parse(selectorText, { context: 'selectorList' });
  } catch {
    return false;
  }

  return selectorList.children.toArray().some((selector) => {
    const subjectNodes = getSubjectNodes(selector);

    if (!isSubjectPossible(subjectNodes, context.fingerprint)) return false;

    const subject = getSubjectSelector(subjectNodes, context.generate);
    return isSubjectMatched(content, subject);
  });
}

function rebuildGroup(rule, inner) {
  const body = inner.join('\n');

  if (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule) {
    const condition = rule.conditionText || rule.media?.mediaText || 'all';
    return `@media ${condition} {\n${body}\n}`;
  }

  if (
    typeof CSSSupportsRule !== 'undefined' &&
    rule instanceof CSSSupportsRule
  ) {
    return `@supports ${rule.conditionText} {\n${body}\n}`;
  }

  if (
    typeof CSSLayerBlockRule !== 'undefined' &&
    rule instanceof CSSLayerBlockRule
  ) {
    return `@layer${rule.name ? ` ${rule.name}` : ''} {\n${body}\n}`;
  }

  if (
    typeof CSSContainerRule !== 'undefined' &&
    rule instanceof CSSContainerRule
  ) {
    const name = rule.containerName ? `${rule.containerName} ` : '';
    return `@container ${name}${rule.conditionText} {\n${body}\n}`;
  }

  if (
    typeof CSSStartingStyleRule !== 'undefined' &&
    rule instanceof CSSStartingStyleRule
  ) {
    return `@starting-style {\n${body}\n}`;
  }

  return rule.cssText;
}

function collectRules(rules, content, context, collected, options) {
  for (const rule of Array.from(rules)) {
    if (typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule) {
      if (rule.cssRules && rule.cssRules.length > 0) continue;

      if (selectorListMatches(content, rule.selectorText, context)) {
        collected.push(rule.cssText);
      }

      continue;
    }

    if (isGlobalAtRule(rule)) {
      collected.push(rule.cssText);
      continue;
    }

    if (typeof CSSPageRule !== 'undefined' && rule instanceof CSSPageRule) {
      const pageSelector = (rule.selectorText || '')
        .trim()
        .replace(/^@page\s*/, '');
      const mode = options.pageRules ?? 'named';

      if (mode === 'all' || (mode === 'named' && pageSelector)) {
        collected.push(rule.cssText);
      }

      continue;
    }

    if (typeof CSSImportRule !== 'undefined' && rule instanceof CSSImportRule) {
      collected.push(rule.cssText);
      continue;
    }

    const CharsetRule = globalThis.CSSCharsetRule;
    if (typeof CharsetRule === 'function' && rule instanceof CharsetRule) {
      continue;
    }

    if (rule.cssRules) {
      const inner = [];
      collectRules(rule.cssRules, content, context, inner, options);

      if (inner.length > 0) collected.push(rebuildGroup(rule, inner));
      continue;
    }

    collected.push(rule.cssText);
  }
}

function getStyleSheets(content) {
  const doc = content.ownerDocument || document;
  const sheets = [];
  const seen = new Set();

  for (const sheet of Array.from(doc.styleSheets)) {
    if (!seen.has(sheet)) {
      seen.add(sheet);
      sheets.push(sheet);
    }
  }

  for (const sheet of doc.adoptedStyleSheets || []) {
    if (!seen.has(sheet)) {
      seen.add(sheet);
      sheets.push(sheet);
    }
  }

  return { sheets, doc };
}

export async function collectContentStyles(content, options = {}) {
  if (!content) return [];

  const module = await import('css-tree');
  const csstree = module.default?.parse ? module.default : module;
  const context = {
    parse: csstree.parse,
    generate: csstree.generate,
    fingerprint: buildFingerprint(content),
  };
  const { sheets, doc } = getStyleSheets(content);
  const payloads = [];

  sheets.forEach((sheet, index) => {
    let rules;

    try {
      rules = sheet.cssRules;
    } catch {
      rules = null;
    }

    if (!rules) {
      if (sheet.href) payloads.push(sheet.href);
      return;
    }

    const collected = [];
    collectRules(rules, content, context, collected, options);

    const css = collected.join('\n');
    if (!css.trim()) return;

    const href =
      sheet.href ||
      new URL(`inline-${index}.css`, sheet.ownerNode?.baseURI || doc.baseURI)
        .href;

    payloads.push({ [href]: css });
  });

  return payloads;
}
