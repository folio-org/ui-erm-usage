export default function extractUUID(input) {
  const regex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
  const match = input.match(regex);
  return match ? match[0] : '';
}
