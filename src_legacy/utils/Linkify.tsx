import { REGEX } from "./constant";
import { truncateLinks } from "./helpers";
// [🚀 FEATURE]: add verification labels
export function Linkify({ text }: { text: string }) {
  const regex = REGEX.ACCEPTED_LINKS_FORMAT;
  const textWithLinkComponents = text
    .split(regex)
    .filter(Boolean)
    .map((textItem, index) => {
      if (textItem.match(regex)) {
        const displayLink = truncateLinks(textItem);
        const link = textItem.startsWith("http")
          ? textItem
          : "https://" + textItem;
        return (
          <a
            key={`${textItem + index}`}
            tabIndex={0}
            // [⚙️ TECH DEBT]: better deal with it in regex
            href={link.replace(/[.,!?;:]$/gm, "")}
            rel="noopener nofollow"
            target="_blank"
          >
            {displayLink}
          </a>
        );
      } else {
        return textItem;
      }
    });
  return <>{textWithLinkComponents}</>;
}
