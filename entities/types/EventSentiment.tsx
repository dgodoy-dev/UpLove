const eventSentiments = ["positive", "negative"] as const;

export type EventSentiment = (typeof eventSentiments)[number];
export default EventSentiment;
