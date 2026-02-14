import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';

import { submitRating } from '@/api/apiHandlers/ratings';
import type { NoteResponse } from '@/api/types/notes';
import type { RatingSubmissionPayload } from '@/api/types/ratings';
import { optimisticIdPrefix } from '@/hooks/useNoteForm';
import useProfile from '@/hooks/useProfile';
import useRequest from '@/hooks/useRequest';
import { useStackedNavigation } from '@/hooks/useStackedNavigation';
import type { FormState } from '@/types/components';
import type { RatingFlagsState, RatingTabsType } from '@/types/noteRating';
import { BUTTON_STATES_MAP } from '@/utils/config/componentsConfig';
import { RATINGS_CHECKBOXES_TABS } from '@/utils/config/notRatingConfig';
import { autoFocusActiveTab } from '@/utils/dom/autoFocus';
import { logger } from '@/utils/lib/logger';
import type { AccurateRatingValue, InaccurateRatingValue } from '@shared/types/noteRating';
import { isoStringToLocalTimeString } from '@shared/utils/format/timeStamp';
import { validateSelectedReasons } from '@shared/utils/validation/noteRatingValidation';

import Button from './Button';
import ErrorMessage from './ErrorMessage';
import Icon from './Icon';

// first tab is opened by default
// making as a state will reset it to 0 with every render
// too much headache on that one
let activeTabIndex = 0;
let allowRating = true;
// reference https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
export default function NoteRatingTabs({ noteId }: { noteId: NoteResponse['id'] }) {
  const { dispatchNavigateBack } = useStackedNavigation();
  const { run, data, isError, isLoading } = useRequest(submitRating);
  const { pick } = useProfile();
  const [formSubmissionState, setFormSubmissionState] = useState<FormState>('idle');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<RatingTabsType>('accurate');
  const [ratingFlags, setRatingFlags] = useState<RatingFlagsState>({
    accurate: {},
    inaccurate: {},
  });
  // NOTE:
  // typescript is complaining because reduce infers `prev` as a tuple type,
  // while what we actually want is an array of rating reasons.
  // strictly, the result should be typed as
  //   (AccurateRatingValue | InaccurateRatingValue)[]
  // depending on the active tab.
  // For now, we don't enforce that union type to avoid extra boilerplate,
  // and instead collect them loosely as string[].
  // gonna validate them on submit anyways
  const selectedRatingReasons = Object.entries(ratingFlags[activeTab]).reduce(
    // @ts-expect-error: TS can't infer the correct accumulator type here
    (prev, [reason, selected]) => (selected ? [reason, ...prev] : prev),
    []
  ) as (AccurateRatingValue | InaccurateRatingValue)[];
  const tabs = Object.keys(RATINGS_CHECKBOXES_TABS) as RatingTabsType[];
  const heading = activeTab === 'accurate' ? 'Why was this useful?' : 'Why wasn’t this useful?';
  const isOptimistic = noteId.startsWith(optimisticIdPrefix);
  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        activeTabIndex = (activeTabIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        activeTabIndex = (activeTabIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        activeTabIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        e.preventDefault();
        activeTabIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    autoFocusActiveTab(tabs[activeTabIndex]!);
    setActiveTab(tabs[activeTabIndex]!);
  }
  function handleCheckBoxChange(e: ChangeEvent<HTMLInputElement>) {
    const ratingReasonIsChecked = e.target.checked;
    const ratingReasonValue = e.target.value;
    setRatingFlags({
      ...ratingFlags,
      [activeTab]: {
        ...ratingFlags[activeTab],
        [ratingReasonValue]: ratingReasonIsChecked,
      },
    });
  }
  function handleRatingSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      allowRating = true;
      const expectedCheckBoxValues = RATINGS_CHECKBOXES_TABS[activeTab].map(({ value }) => value);
      const isValid = validateSelectedReasons(selectedRatingReasons, expectedCheckBoxValues);
      if (isValid) {
        const userId = pick('user.id');
        const signingKey = pick('user.signingKey');
        const ratingData: RatingSubmissionPayload = {
          noteData: {
            noteId,
          },
          ratingData: {
            vote: activeTab,
            reasons: selectedRatingReasons,
          },
        };
        if (!userId || !signingKey) {
          logger.error('Unauthorized action, please add a global message');
          return;
        }

        run(userId, signingKey, ratingData);
        setError('');
      } else {
        // validation failed, user tampered with input or invalid state
        setError('Invalid Input!');
      }
    } catch (error) {
      logger.error('Something Went wrong While Submitting Note Rating', error);
      setError('Something Went Wrong! Please try again later');
    }
  }
  useEffect(() => {
    if (isLoading) {
      setFormSubmissionState('submitting');
      return;
    }

    if (data && !isError) {
      allowRating = false;
      setFormSubmissionState('success');
      setRatingFlags({
        accurate: {},
        inaccurate: {},
      });
      setFormSubmissionState('idle');
      dispatchNavigateBack();
      return;
    }

    if (isError) {
      const { code, message, meta } = isError;
      let errorMessage = message;
      if (code === 'DUPLICATE_VOTE') {
        setRatingFlags({
          accurate: {},
          inaccurate: {},
        });
        allowRating = false;
      } else if (code === 'RATE_LIMIT_EXCEEDED') {
        let retryAt;
        if (meta && meta['windowOpensAt']) {
          const windowOpensAt = meta['windowOpensAt'] as string;

          retryAt = isoStringToLocalTimeString(windowOpensAt);
          errorMessage = `${message}, try again at: ${retryAt}`;
        }
        setRatingFlags({
          accurate: {},
          inaccurate: {},
        });
        allowRating = false;
      } else if (code === 'INVALID_VOTE_REASON') {
        errorMessage = 'Invalid Input';
      }
      setError(errorMessage);
      setFormSubmissionState('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, data, isError]);
  return (
    <div className='sv-note-rating'>
      <form className='sv-note-rating__form' onSubmit={handleRatingSubmit}>
        <fieldset className='sv-note-rating__fieldset'>
          <legend id='sv-tablist' className='sv-note-rating__legend sv-divider sv-divider--bottom'>
            How Accurate was this note?
          </legend>

          <div
            className='sv-note-rating__tabs sv-divider sv-divider--bottom'
            role='tablist'
            aria-labelledby='sv-tablist'
          >
            {tabs.map(tab => (
              <Button
                id={tab}
                key={tab}
                text={tab}
                shape='rounded'
                theme={activeTab === tab ? 'dark' : 'light'}
                tabIndex={activeTab === tab ? 0 : -1}
                role='tab'
                aria={{
                  'aria-selected': activeTab === tab,
                  'aria-controls': 'sv-tab-panel',
                }}
                noDarkMode
                actions={{
                  onClick: () => setActiveTab(tab),
                  onKeyDown: handleTabKeyDown,
                }}
              />
            ))}
          </div>

          <div
            id='sv-tab-panel'
            className='sv-note-rating__reasons sv-divider sv-divider--bottom'
            aria-labelledby={activeTab}
            tabIndex={0}
          >
            <h3 className='sv-note-rating__checkbox-heading'>{heading}</h3>
            {RATINGS_CHECKBOXES_TABS[activeTab].map(({ value, label, description }) => {
              // @ts-expect-error: safe because we ensure value matches activeTab at runtime
              const isChecked = Boolean(ratingFlags[activeTab][value]);
              return (
                <label key={value} className='sv-note-rating__checkbox-label' htmlFor={value}>
                  {label}
                  <span className='sv-sr-only'>{description}</span>
                  <span className='sv-note-rating__description-wrapper' aria-hidden='true'>
                    <span className='sv-note-rating__description'>{description}</span>
                    <Icon variant='error' size='sm' theme='dark' noDarkMode />
                  </span>
                  <input
                    id={value}
                    type='checkbox'
                    name={activeTab}
                    value={value}
                    className='sv-checkbox'
                    checked={isChecked}
                    onChange={handleCheckBoxChange}
                  />
                </label>
              );
            })}
            {error && <ErrorMessage id='rating-form' global errorMessage={error} />}
          </div>

          <div className='sv-note-rating__action'>
            <Button
              text='Cancel'
              shape='pill'
              actions={{
                onClick: () => {
                  dispatchNavigateBack();
                  setError('');
                },
              }}
              noDarkMode
            />
            <Button
              text={BUTTON_STATES_MAP[formSubmissionState]['text']}
              shape='pill'
              theme='blue'
              type='submit'
              icon={{ variant: BUTTON_STATES_MAP[formSubmissionState]['icon'] }}
              disabled={Boolean(!selectedRatingReasons.length || !allowRating) || isOptimistic}
              noDarkMode
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
}
