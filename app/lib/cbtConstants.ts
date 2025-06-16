

/**
 * Constants for Cognitive Behavioral Therapy (CBT) features
 */

import { CognitiveDistortionId } from "@/src/types";

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component

export const COGNITIVE_DISTORTIONS_LIST = {
  allOrNothing: 'All or Nothing Thinking',
  catastrophizing: 'Catastrophizing',
  emotionalReasoning: 'Emotional Reasoning',
  fortuneTelling: 'Fortune Telling',
  labeling: 'Labeling',
  magnification: 'Magnification of Negative',
  mindReading: 'Mind Reading',
  minimization: 'Minimization of Positive',
  otherBlaming: 'Other Blaming',
  overGeneralization: 'Over Generalization',
  selfBlaming: 'Self Blaming',
  shouldStatements: 'Should Statements',
  personalization: 'Personalization',
  mentalFilter: 'Mental Filter',
  disqualifyingThePositive: 'Disqualifying the Positive',
} as const;

export const DISTORTION_DESCRIPTIONS: Record<
  CognitiveDistortionId,
  { description: string; example: string; reframe: string }
> = {
  allOrNothing: {
    description:
      'Seeing things in black and white categories, with no middle ground',
    example: "If I don't get a perfect score, I'm a total failure.",
    reframe:
      'Recognize shades of gray. Acknowledge that outcomes exist on a spectrum, not just extremes.',
  },
  catastrophizing: {
    description: 'Expecting disaster or the worst possible outcome',
    example: "If I don't get this job, my life is over.",
    reframe:
      'Identify the actual probability of the worst outcome and consider more realistic scenarios. Create a plan for less-than-ideal outcomes.',
  },
  emotionalReasoning: {
    description:
      "Assuming feelings reflect reality ('I feel it, so it must be true')",
    example:
      'I feel anxious, so there must be something terrible about to happen.',
    reframe:
      'Recognize that feelings are not facts. Examine the evidence for your thoughts, rather than relying on emotions alone.',
  },
  fortuneTelling: {
    description:
      'Predicting the future negatively without considering other outcomes',
    example: "I just know I'm going to mess up this presentation.",
    reframe:
      'Consider alternative, more positive or neutral outcomes. Focus on what you can control in the present moment.',
  },
  labeling: {
    description:
      'Attaching a negative label to yourself or others instead of describing behavior',
    example: "I'm a complete idiot for making that mistake.",
    reframe:
      'Describe the specific behavior or situation without attaching global, negative labels. Separate the person from the action.',
  },
  magnification: {
    description: 'Exaggerating the importance of problems or shortcomings',
    example:
      "I made a tiny error, and now everyone will think I'm incompetent.",
    reframe:
      'Put the problem in perspective. How important will this be in a week, a month, or a year? Avoid blowing things out of proportion.',
  },
  mindReading: {
    description: 'Assuming you know what others are thinking without evidence',
    example:
      "My friend hasn't replied to my text, so they must be angry with me.",
    reframe:
      "Ask for clarification instead of assuming. Recognize that you cannot read minds and that others' thoughts are often not about you.",
  },
  minimization: {
    description: 'Shrinking the importance of positive events or qualities',
    example: 'I did well on the project, but it was just luck.',
    reframe:
      "Acknowledge your achievements and positive qualities fully. Give yourself credit where it's due, without downplaying successes.",
  },
  otherBlaming: {
    description:
      'Focusing on others as the source of negative feelings; ignoring your role',
    example: "It's their fault I'm so stressed; they never help.",
    reframe:
      'Take responsibility for your own actions and reactions. Consider how you contribute to a situation and what you can do to change it.',
  },
  overGeneralization: {
    description: 'Viewing a single negative event as a never-ending pattern',
    example:
      "I failed this test, so I'm going to fail all my classes and drop out.",
    reframe:
      'Identify that a single event does not dictate all future outcomes. Focus on specific events rather than sweeping generalizations.',
  },
  selfBlaming: {
    description:
      'Taking excessive responsibility for events not entirely under your control',
    example:
      "It's my fault the team project failed, even though others were involved.",
    reframe:
      'Distinguish between what you can and cannot control. Recognize your actual role and avoid taking on undue blame.',
  },
  shouldStatements: {
    description: "Having rigid rules about how you or others 'should' behave",
    example: 'I should always be productive and never waste time.',
    reframe:
      'Replace "shoulds" with more flexible preferences or desires. Allow for imperfection and self-compassion.',
  },
  personalization: {
    description:
      'Believing others are reacting to you when their behavior has other causes',
    example: 'My boss looked stressed, so I must have done something wrong.',
    reframe:
      "Consider other possible reasons for others' behavior that have nothing to do with you. Avoid taking things personally.",
  },
  mentalFilter: {
    description:
      'Focusing exclusively on negative details while ignoring positives',
    example:
      'My presentation went well, but I stumbled on one word, so it was a disaster.',
    reframe:
      'Acknowledge both positive and negative aspects. Try to see the full picture rather than dwelling on isolated negatives.',
  },
  disqualifyingThePositive: {
    description:
      "Rejecting positive experiences by insisting they 'don't count'",
    example: "Anyone could have done what I did; it wasn't a real achievement.",
    reframe:
      'Accept compliments and positive feedback. Allow yourself to experience and internalize positive moments and achievements.',
  },
};
