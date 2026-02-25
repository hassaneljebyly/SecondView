import type { NoteResponse } from '@/api/types/notes';
import { useStackedNavigation } from '@/hooks/useStackedNavigation';
import { isoStringToLocalTimeString } from '@shared/utils/format/timeStamp';

import Icon from './Icon';

export default function NoteDetails(note: NoteResponse) {
  const { dispatchNavigateBack } = useStackedNavigation();
  const { status, createdBy, createdAt, alreadyRated, isOwn } = note;
  const createdAtToLocal = createdAt ? isoStringToLocalTimeString(createdAt) : 'N/A';
  // Help the community evaluate this note
  // Needs more votes to determine accuracy
  // Community hasn't reached consensus
  // TODO(me): 📝 add the other options
  const communityConsensusHeader =
    status === 'active' ? 'Currently rated accurate' : "Community hasn't reached consensus";
  const canSeeStats = alreadyRated && !isOwn;
  return (
    <div className='sv-note-details'>
      <div className='sv-note-details__header'>
        <button className='sv-note-details__back-btn' onClick={dispatchNavigateBack} data-autofocus>
          <Icon variant='back' />
          <span className='sv-sr-only'>Back to note</span>
        </button>
        <span className='sv-note-details__header-text'>Note details</span>
      </div>

      <div className='sv-note-details__main'>
        {/* {!alreadyRated && !isOwn && ( */}
        <p className='sv-note-details__note-rated-note'>
          Note:{' '}
          <span className='sv-note-details__data'>
            Rating details are hidden until you vote (to avoid bias).{' '}
            <span className='sv-note-details__data' title='Experimental data'>
              Placeholder data
            </span>{' '}
            shown during beta will be hidden for non-voters in later versions.
          </span>
        </p>
        {/* )} */}
        <div className='sv-note-details__verdict'>
          <span className='sv-note-status-icon' aria-hidden='true' data-note-status={status}>
            <Icon variant='badge' size='sm' />
          </span>
          <span className='sv-note-details__verdict-status'>{communityConsensusHeader}</span>
          <p className='sv-note-details__verdict-confidence'>
            Consensus confidence:{' '}
            <span className='sv-note-details__data' title='Experimental data'>
              High (87%)
            </span>
          </p>
          {canSeeStats && (
            <>
              <p className='sv-note-details__verdict-accurate-votes'>
                <span className='sv-note-details__data' title='Experimental data'>
                  8
                </span>{' '}
                found it accurate
              </p>
              <p className='sv-note-details__verdict-inaccurate-votes'>
                <span className='sv-note-details__data' title='Experimental data'>
                  15
                </span>{' '}
                found it inaccurate
              </p>
            </>
          )}
        </div>
        {canSeeStats && (
          <div className='sv-note-details__user-vote'>
            <p className='sv-note-details__user-vote-text' title='Experimental data'>
              Your vote: <span className='sv-note-details__data'>Accurate</span>— based on clear
              explanation, reliable sources, and neutral tone.
            </p>
          </div>
        )}
        <div className='sv-note-details__community-consensus'>
          <p>Community Consensus:</p>
          <ul className='sv-note-details__dimension-distribution'>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Evidence
              </span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '78%' }} />
              </span>
              <span className='sv-note-details__data' title='Experimental data'>
                78%
              </span>
            </li>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Explanation
              </span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '31%' }} />
              </span>
              <span className='sv-note-details__data' title='Experimental data'>
                31%
              </span>
            </li>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Coverage
              </span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '48%' }} />
              </span>
              <span className='sv-note-details__data' title='Experimental data'>
                48%
              </span>
            </li>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Tone & Quality
              </span>
              <span className='sv-note-details__distribution-bar'>
                <span style={{ width: '25%' }} />
              </span>
              <span className='sv-note-details__data' title='Experimental data'>
                25%
              </span>
            </li>
          </ul>
          <p>Top reasons:</p>
          <ul className='sv-note-details__top-reasons'>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Clear explanation (12)
              </span>
            </li>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Reliable sources (8)
              </span>
            </li>
            <li>
              <span className='sv-note-details__data' title='Experimental data'>
                Neutral tone (7)
              </span>
            </li>
          </ul>
        </div>
        <div className='sv-note-details__author-info'>
          <p>
            Author: <span className='sv-note-details__data'>{isOwn ? 'You' : createdBy}</span>
          </p>
          <p>
            Note created at: <span className='sv-note-details__data'>{createdAtToLocal}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
