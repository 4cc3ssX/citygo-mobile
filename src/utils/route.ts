export function getShortenRouteName(name: string) {
  return name.split(/\W+/i)[0].substring(0, 3);
}
