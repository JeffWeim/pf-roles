export default function trimChars(input: string, count = 100): string {
  return input.length > 100 ? input.slice(0, count) : input;
}
