import { truncateLinks } from '@/utils/format/trimLink';
import { ACCEPTED_LINKS_FORMAT } from '@shared/utils/config/regexConfig';

export default function Linkify({ text }: { text: string }) {
  const textWithLinkComponents = text
    .split(ACCEPTED_LINKS_FORMAT)
    .filter(Boolean)
    .map((textItem, index) => {
      if (textItem.match(ACCEPTED_LINKS_FORMAT)) {
        const { href, label } = truncateLinks(textItem);
        return (
          <a
            className='sv-source-links'
            key={`${textItem + index}`}
            tabIndex={0}
            href={href}
            rel='noreferrer noopener nofollow'
            target='_blank'
          >
            {label}
          </a>
        );
      } else {
        return textItem;
      }
    });
  return <>{textWithLinkComponents}</>;
}
