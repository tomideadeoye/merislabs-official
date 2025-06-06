/**
 * Constants for Cognitive Behavioral Therapy (CBT) features
 */

export const COGNITIVE_DISTORTIONS_LIST = {
  all_or_nothing: "All or Nothing Thinking",
  catastrophizing: "Catastrophizing",
  emotional_reasoning: "Emotional Reasoning",
  fortune_telling: "Fortune Telling",
  labeling: "Labeling",
  magnification: "Magnification of Negative",
  mind_reading: "Mind Reading",
  minimization: "Minimization of Positive",
  other_blaming: "Other Blaming",
  over_generalization: "Over Generalization",
  self_blaming: "Self Blaming",
  should_statements: "Should Statements",
  personalization: "Personalization",
  mental_filter: "Mental Filter",
  disqualifying_the_positive: "Disqualifying the Positive",
} as const;

export type CognitiveDistortionId = keyof typeof COGNITIVE_DISTORTIONS_LIST;

export const DISTORTION_DESCRIPTIONS = {
  all_or_nothing: "Seeing things in black and white categories, with no middle ground",
  catastrophizing: "Expecting disaster or the worst possible outcome",
  emotional_reasoning: "Assuming feelings reflect reality ('I feel it, so it must be true')",
  fortune_telling: "Predicting the future negatively without considering other outcomes",
  labeling: "Attaching a negative label to yourself or others instead of describing behavior",
  magnification: "Exaggerating the importance of problems or shortcomings",
  mind_reading: "Assuming you know what others are thinking without evidence",
  minimization: "Shrinking the importance of positive events or qualities",
  other_blaming: "Focusing on others as the source of negative feelings; ignoring your role",
  over_generalization: "Viewing a single negative event as a never-ending pattern",
  self_blaming: "Taking excessive responsibility for events not entirely under your control",
  should_statements: "Having rigid rules about how you or others 'should' behave",
  personalization: "Believing others are reacting to you when their behavior has other causes",
  mental_filter: "Focusing exclusively on negative details while ignoring positives",
  disqualifying_the_positive: "Rejecting positive experiences by insisting they 'don't count'",
};