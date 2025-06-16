/**
 * Constants for Cognitive Behavioral Therapy (CBT) features
 */

import { CognitiveDistortionId } from './types';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

export const COGNITIVE_DISTORTIONS_LIST = {
  allOrNothingThinking: 'All or Nothing Thinking',
  emotionalReasoning: 'Emotional Reasoning',
  jumpingToConclusions: 'Jumping to Conclusions',
  labelingAndMislabeling: 'Labeling and Mislabeling',
  magnificationAndMinimization: 'Magnification and Minimization',
  overgeneralization: 'Over Generalization',
  shouldStatements: 'Should Statements',
  personalization: 'Personalization',
  mentalFilter: 'Mental Filter',
  discountingThePositive: 'Discounting the Positive',
} as const;

export const DISTORTION_DESCRIPTIONS: Record<
  CognitiveDistortionId,
  { description: string; example: string; reframe: string }
> = {
  allOrNothingThinking: {
    description: 'Seeing things in black and white categories, with no middle ground',
    example: "If I don't get a perfect score, I'm a total failure.",
    reframe: 'Recognize shades of gray. Acknowledge that outcomes exist on a spectrum, not just extremes.',
  },
  emotionalReasoning: {
    description: "Assuming feelings reflect reality ('I feel it, so it must be true')",
    example: 'I feel anxious, so there must be something terrible about to happen.',
    reframe:
      'Recognize that feelings are not facts. Examine the evidence for your thoughts, rather than relying on emotions alone.',
  },
  jumpingToConclusions: {
    description: 'Interpreting the meaning of something with little or no evidence',
    example: "They haven't called me back, so they must hate me.",
    reframe:
      'Consider all possible explanations and seek evidence before drawing conclusions. Avoid making assumptions.',
  },
  labelingAndMislabeling: {
    description: 'Attaching a negative label to yourself or others instead of describing behavior',
    example: "I'm a complete idiot for making that mistake.",
    reframe:
      'Describe the specific behavior or situation without attaching global, negative labels. Separate the person from the action.',
  },
  magnificationAndMinimization: {
    description: 'Exaggerating the importance of problems or shortcomings',
    example: "I made a tiny error, and now everyone will think I'm incompetent.",
    reframe:
      'Put the problem in perspective. How important will this be in a week, a month, or a year? Avoid blowing things out of proportion.',
  },
  overgeneralization: {
    description: 'Viewing a single negative event as a never-ending pattern',
    example: "I failed this test, so I'm going to fail all my classes and drop out.",
    reframe:
      'Identify that a single event does not dictate all future outcomes. Focus on specific events rather than sweeping generalizations.',
  },
  shouldStatements: {
    description: "Having rigid rules about how you or others 'should' behave",
    example: 'I should always be productive and never waste time.',
    reframe: 'Replace "shoulds" with more flexible preferences or desires. Allow for imperfection and self-compassion.',
  },
  personalization: {
    description: 'Believing others are reacting to you when their behavior has other causes',
    example: 'My boss looked stressed, so I must have done something wrong.',
    reframe:
      "Consider other possible reasons for others' behavior that have nothing to do with you. Avoid taking things personally.",
  },
  mentalFilter: {
    description: 'Focusing exclusively on negative details while ignoring positives',
    example: 'My presentation went well, but I stumbled on one word, so it was a disaster.',
    reframe:
      'Acknowledge both positive and negative aspects. Try to see the full picture rather than dwelling on isolated negatives.',
  },
  discountingThePositive: {
    description: "Rejecting positive experiences by insisting they 'don't count'",
    example: "Anyone could have done what I did; it wasn't a real achievement.",
    reframe:
      'Accept compliments and positive feedback. Allow yourself to experience and internalize positive moments and achievements.',
  },
};
