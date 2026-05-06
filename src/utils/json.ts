export function extractJSON<T = any>(text: string): T {
  try {
    return JSON.parse(text);
  } catch (e) {
    const markdownMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      try {
        return JSON.parse(markdownMatch[1].trim());
      } catch (e2) {}
    }

    const firstObject = text.indexOf('{');
    const firstArray = text.indexOf('[');
    let startIdx = firstObject !== -1 && (firstArray === -1 || firstObject < firstArray) ? firstObject : firstArray;

    if (startIdx !== -1) {
      const remaining = text.substring(startIdx);
      for (let i = remaining.length; i > 0; i--) {
        const potential = remaining.substring(0, i);
        try {
          return JSON.parse(potential);
        } catch (e3) {}
      }
    }
    throw new Error(`Failed to extract JSON from LLM response. Length: ${text.length}`);
  }
}
