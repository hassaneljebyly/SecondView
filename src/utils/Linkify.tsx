import { REGEX } from "./constant";
import { truncateLinks } from "./helpers";

export function Linkify({ text }: { text: string }) {
  const regex = REGEX.ACCEPTED_LINKS_FORMAT;
  const textWithLinkComponents = text
    .split(regex)
    .filter(Boolean)
    .map((textItem, index) => {
      if (textItem.match(regex)) {
        const displayLink = truncateLinks(textItem);
        return (
          <a
            key={`${textItem + index}`}
            tabIndex={0}
            href={textItem.startsWith("http") ? textItem : "http://" + textItem}
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
