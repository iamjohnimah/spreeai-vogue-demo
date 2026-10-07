// Recorded with the approved Celine preset. No device-synthesized fallback.
export const stylistSpeech = {
  "reset": "Of course. Let's start fresh. What are we dressing for?",
  "compare": "Let's put these first two pieces side by side. With your profile saved, you'll see them on you. Which one feels more like you?",
  "build": "Let's build around this piece. I've brought in complementary pieces from the same collection. You can swap anything, choose your sizes, and add the look to your demo bag.",
  "occasion": "Tell me a little about the occasion. Is it a wedding, dinner, work, or a getaway?",
  "wedding": "Lovely. What's the dress code or the mood? Something formal, understated, or more of a statement?",
  "mood": "What feels right for you? Relaxed and easy, understated, or a little more of a statement?",
  "category": "Would you like to explore dresses, tailored separates, or just the finishing accessories?",
  "empty": "I couldn't find pieces matching that selection in this demo collection. Shall we open up the budget, or try another category?",
  "results": "I've found a few ideas from the store's collection. Would you like to compare the first two on you, or build a complete look?",
  "single": "I've found a piece from the store's collection. Shall we build a complete look around it?",
  "studio": "Welcome to our creative studio. Let's discover a considered look, made personal to you.",
  "advisor": "Hi, I'm your personal shopping advisor. Tell me where you're going, and we'll find something you love.",
  "editorial": "Welcome. Let's find a look with a point of view. What is the occasion?",
  "greeting": "Hi. Welcome to the Spree AI stylist experience. Think of me as your in-store stylist, right here. Tell me, what are we dressing for today?"
} as const;
export type StylistSpeechKey = keyof typeof stylistSpeech;
export const stylistAudioUrl = (key: StylistSpeechKey) => `/spreeai-always-on-demo/online/media/stylist-celine/${key}.wav`;
