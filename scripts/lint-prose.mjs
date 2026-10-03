#!/usr/bin/env node
// Prose-slop linter: flags AI-voice writing patterns in docs content.
// See CONTRIBUTING.md "Prose linting" for the rule list and why each
// disabled rule was turned off.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const DEFAULT_DIR = join(ROOT, "content/docs");

const LONG_SENTENCE_WORDS = 40;

// Section numbers below refer to .claude/skills/humanizer/SKILL.md, which
// supplied the AI-overused-word list (§12) this reuses.
const MARKETING_WORDS = [
  "seamless", "seamlessly", "unlock", "unlocks", "unlocking", "elevate",
  "elevates", "supercharge", "supercharges", "cutting-edge", "cutting edge",
  "state-of-the-art", "game-changer", "game-changing", "best-in-class",
  "unparalleled", "revolutionize", "revolutionizes", "revolutionizing",
  "effortless", "effortlessly", "frictionless", "empower", "empowers",
  "empowering", "world-class", "next-level", "turbocharge", "blazing-fast",
  "blazing fast", "delightful",
];

const BANNED_VERBS = [
  "leverage", "leverages", "leveraged", "leveraging",
  "utilize", "utilizes", "utilized", "utilizing",
  "ensure", "ensures", "ensured", "ensuring",
  "facilitate", "facilitates", "facilitated", "facilitating",
  "streamline", "streamlines", "streamlined", "streamlining",
  "delve", "delves", "delved", "delving",
  "foster", "fosters", "fostered", "fostering",
  "harness", "harnesses", "harnessed", "harnessing",
  "unleash", "unleashes", "unleashed", "unleashing",
  "underscore", "underscores", "underscored", "underscoring",
  "showcase", "showcases", "showcased", "showcasing",
  "garner", "garners", "garnered", "garnering",
  "enhance", "enhances", "enhanced", "enhancing",
  "align with", "aligns with", "aligned with", "aligning with",
];

// Overused-AI-word list (humanizer SKILL.md §12), minus terms excluded
// below because they collide with this repo's domain vocabulary.
const AI_OVERUSED_WORDS = [
  "actually", "additionally", "bolstered", "crucial", "deep dive",
  "enduring", "intricate", "intricacies", "landscape", "meticulous",
  "meticulously", "pivotal", "quietly", "tapestry", "testament",
  "valuable", "vibrant", "interplay",
];
// Excluded from the §12 list, and why:
//   - "key" (adjective): buildd docs use "key" constantly as a literal noun
//     (API key, model key) and as a legitimate adjective ("key" criterion
//     fields). Flagging it would swamp every page with noise unrelated to
//     AI voice.
//   - "gate" / "gated" / "gating": a domain term here (mission gates, goal
//     criteria gating), not a figurative AI tell.
//   - "robust": used in genuinely technical senses (robust error handling)
//     about as often as the figurative AI sense; too ambiguous to score.
//   - "highlight" (verb): ordinary in UI instructions ("highlight the
//     row"), not reliably a tell.

const HOLLOW_PHRASES = [
  "it is important to note that", "it should be noted that",
  "in today's fast-paced world", "at the end of the day",
  "needless to say", "it goes without saying", "the fact that",
  "when it comes to",
];

const PASSIVE_RE =
  /\b(?:am|is|are|was|were|be|been|being)\s+(?:\w+ed|given|taken|written|driven|broken|chosen|spoken|frozen|fallen|eaten|hidden|ridden|stolen|woven|shown|known|seen|done|made|held|told|sold|sent|built|found|kept|left|lost|meant|paid|read|said|set|shut|spent|spread|understood|won|brought|bought|caught|taught|thought|fought)\b/gi;

const NOT_X_IT_IS_Y_RE =
  /\bnot\s+(?:just\s+|only\s+|merely\s+)?[^,.;:\n]{3,80},\s*(?:it'?s|it is|but)\b/gi;

// Em dash character is always flagged. `--` is only flagged when spaced,
// so CLI flags like `--max` in fenced-off command examples don't trigued it
// (code blocks are stripped before this runs anyway, but inline code spans
// such as `--max` are handled the same way for safety).
const EM_DASH_RE = /—|\s--\s/g;

function wordList(words) {
  const escaped = words
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  return new RegExp(`\\b(?:${escaped.join("|")})\\b`, "gi");
}

const MARKETING_RE = wordList(MARKETING_WORDS);
const BANNED_VERB_RE = wordList(BANNED_VERBS);
const AI_WORD_RE = wordList(AI_OVERUSED_WORDS);
const HOLLOW_RE = wordList(HOLLOW_PHRASES);

const RULES = [
  { key: "long-sentence", label: "long sentence (>%d words)".replace("%d", LONG_SENTENCE_WORDS) },
  { key: "passive-voice", label: "passive voice" },
  { key: "marketing-word", label: "marketing word" },
  { key: "banned-verb", label: "banned verb" },
  { key: "ai-overused-word", label: "overused AI word" },
  { key: "hollow-phrase", label: "hollow phrase" },
  { key: "em-dash", label: "em dash" },
  { key: "not-x-it-is-y", label: '"not X, it\'s Y" pivot' },
];

function stripFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { body: text, frontmatter: "" };
  const blankLines = match[0].split("\n").length - 1;
  const body = "\n".repeat(blankLines) + text.slice(match[0].length);
  return { body, frontmatter: match[1] };
}

function isGenerated(frontmatter) {
  return /^generated:\s*true\s*$/m.test(frontmatter);
}

// Replaces fenced code blocks and inline code spans with blank
// placeholders of the same line count, so later line-number lookups on the
// cleaned text still point at the right line in the original file.
function stripCode(text) {
  let out = text.replace(/```[\s\S]*?```/g, (block) =>
    block
      .split("\n")
      .map(() => "")
      .join("\n"),
  );
  out = out.replace(/`[^`\n]*`/g, (span) => " ".repeat(span.length));
  return out;
}

// Strips MDX/JSX tags but keeps the text between them, and reduces links
// to their link text so prose rules still see real sentences.
function stripMarkup(text) {
  return text
    .replace(/^import .*$/gm, "")
    .replace(/^export .*$/gm, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[A-Za-z][^>]*>/g, "");
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text[i] === "\n") line++;
  }
  return line;
}

function splitParagraphs(text) {
  const paragraphs = [];
  let offset = 0;
  for (const chunk of text.split(/\n\s*\n/)) {
    const start = text.indexOf(chunk, offset);
    paragraphs.push({ text: chunk, index: start });
    offset = start + chunk.length;
  }
  return paragraphs;
}

function splitSentences(paragraph) {
  const sentences = [];
  const re = /[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g;
  let match;
  while ((match = re.exec(paragraph))) {
    if (match[0].trim()) {
      sentences.push({ text: match[0], index: match.index });
    }
  }
  return sentences;
}

function countWords(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function lintText(cleanText, originalText) {
  const findings = [];
  const words = countWords(cleanText.replace(/[#*_>`]/g, " "));

  for (const paragraph of splitParagraphs(cleanText)) {
    if (!paragraph.text.trim()) continue;
    for (const sentence of splitSentences(paragraph.text)) {
      const absoluteIndex = paragraph.index + sentence.index;
      const sentenceWords = countWords(sentence.text);
      if (sentenceWords > LONG_SENTENCE_WORDS) {
        findings.push({
          rule: "long-sentence",
          line: lineAt(originalText, absoluteIndex),
          detail: `${sentenceWords} words`,
        });
      }
      for (const [re, rule] of [
        [PASSIVE_RE, "passive-voice"],
        [NOT_X_IT_IS_Y_RE, "not-x-it-is-y"],
      ]) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(sentence.text))) {
          findings.push({
            rule,
            line: lineAt(originalText, absoluteIndex + m.index),
            detail: m[0].trim().slice(0, 60),
          });
        }
      }
    }
  }

  for (const [re, rule] of [
    [MARKETING_RE, "marketing-word"],
    [BANNED_VERB_RE, "banned-verb"],
    [AI_WORD_RE, "ai-overused-word"],
    [HOLLOW_RE, "hollow-phrase"],
    [EM_DASH_RE, "em-dash"],
  ]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(cleanText))) {
      findings.push({
        rule,
        line: lineAt(originalText, m.index),
        detail: m[0].trim() || "—",
      });
    }
  }

  return { findings, words };
}

function lintFile(path) {
  const original = readFileSync(path, "utf8");
  const { body, frontmatter } = stripFrontmatter(original);
  if (isGenerated(frontmatter)) return null;
  const clean = stripMarkup(stripCode(body));
  const { findings, words } = lintText(clean, original);
  const total = findings.length;
  const per100w = words > 0 ? (total / words) * 100 : 0;
  return { path, findings, total, words, per100w };
}

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walk(full));
    } else if (entry.endsWith(".mdx") || entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function parseArgs(argv) {
  const args = { max: Infinity, files: [], json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--max") {
      args.max = Number(argv[++i]);
    } else if (arg === "--json") {
      args.json = true;
    } else {
      args.files.push(arg);
    }
  }
  return args;
}

function emitAnnotations(result) {
  const relPath = relative(ROOT, result.path);
  for (const finding of result.findings) {
    const ruleLabel = RULES.find((r) => r.key === finding.rule)?.label ?? finding.rule;
    console.log(
      `::warning file=${relPath},line=${finding.line}::[${ruleLabel}] ${finding.detail}`,
    );
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.files.length > 0 ? args.files : walk(DEFAULT_DIR);
  const results = files.map(lintFile).filter(Boolean);
  results.sort((a, b) => b.per100w - a.per100w);

  if (args.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const inCI = Boolean(process.env.GITHUB_ACTIONS);
    console.log("file\ttotal\twords\tper100w");
    for (const result of results) {
      const relPath = relative(ROOT, result.path);
      console.log(
        `${relPath}\t${result.total}\t${result.words}\t${result.per100w.toFixed(2)}`,
      );
      if (inCI) emitAnnotations(result);
    }
  }

  const worst = results.find((r) => r.per100w > args.max);
  if (worst) {
    console.error(
      `\nprose-lint: ${relative(ROOT, worst.path)} scored ${worst.per100w.toFixed(2)} per100w, over --max ${args.max}`,
    );
    process.exitCode = 1;
  }
}

main();
