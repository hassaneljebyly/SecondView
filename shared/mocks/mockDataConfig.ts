import type { NoteRequestPayload } from '@shared/types/schemas';

import { testVideoDetails } from './youtube';

export const mockNotesDataResponse: NoteRequestPayload = {
  videoMetaData: testVideoDetails,
  noteList: [
    {
      noteId: 1001,
      userId: 'user_health_checker_42',
      startTimeSeconds: 15,
      endTimeSeconds: 52,
      category: 'UNSUBSTANTIATED_ADVICE',
      noteContent:
        "The claim that drinking apple cider vinegar before meals 'burns belly fat directly' lacks strong scientific backing. While some studies suggest it may modestly affect satiety and blood sugar, there’s no evidence it specifically targets belly fat. Weight management depends on overall calorie balance. https://www.healthline.com/nutrition/apple-cider-vinegar-weight-loss https://www.mayoclinic.org/healthy-lifestyle/weight-loss/expert-answers/apple-cider-vinegar-for-weight-loss/faq-20058394",
      sources: [
        'https://www.healthline.com/nutrition/apple-cider-vinegar-weight-loss',
        'https://www.mayoclinic.org/healthy-lifestyle/weight-loss/expert-answers/apple-cider-vinegar-for-weight-loss/faq-20058394',
      ],
    },
    {
      noteId: 1002,
      userId: 'user_fact_ninja_88',
      startTimeSeconds: 60,
      endTimeSeconds: 102,
      category: 'FALSE_CONTEXT',
      noteContent:
        "The creator claims that 'carrots dramatically improve night vision' because of WWII fighter pilots. In reality, this story was propaganda to disguise the use of radar technology, not a proven medical fact. While carrots contain vitamin A, which supports eye health, they do not give superhuman vision. https://www.bbc.com/future/article/20130708-do-carrots-help-you-see-in-the-dark https://www.scientificamerican.com/article/fact-or-fiction-carrots-improve-your-vision/",
      sources: [
        'https://www.bbc.com/future/article/20130708-do-carrots-help-you-see-in-the-dark',
        'https://www.scientificamerican.com/article/fact-or-fiction-carrots-improve-your-vision/',
      ],
    },
    {
      noteId: 1003,
      userId: 'user_science_maven_99',
      startTimeSeconds: 110,
      endTimeSeconds: 148,
      category: 'MISLEADING_CONTENT',
      noteContent:
        "The statement that 'drinking cold water slows down digestion because your body must warm it up first' is misleading. Research shows that water temperature does not meaningfully impact nutrient absorption or digestion speed. Hydration is beneficial regardless of water temperature. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2908954/ https://www.medicalnewstoday.com/articles/319673",
      sources: [
        'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2908954/',
        'https://www.medicalnewstoday.com/articles/319673',
      ],
    },
    {
      noteId: 1004,
      userId: 'user_sleep_expert_55',
      startTimeSeconds: 155,
      endTimeSeconds: 180,
      category: 'ERROR',
      noteContent:
        "The video claims that 'you need exactly 8 hours of sleep every night' which is incorrect. Sleep needs vary by age and individual. Most adults function well with 7–9 hours, but some may need slightly more or less. The quality of sleep also matters as much as the quantity. https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need https://www.cdc.gov/sleep/about_sleep/how_much_sleep.html",
      sources: [
        'https://www.sleepfoundation.org/how-sleep-works/how-much-sleep-do-we-really-need',
        'https://www.cdc.gov/sleep/about_sleep/how_much_sleep.html',
      ],
    },
  ],
};
