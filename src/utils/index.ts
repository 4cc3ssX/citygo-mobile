export function calculateTime(
  distance: number,
  speed: number,
  type: 'm' | 'h',
) {
  if (type === 'm') {
    return Math.round((distance / speed) * 60);
  }
  return Math.round(distance / speed);
}

export function getReadableBadgeCount(count: number = 0) {
  if (count > 99) {
    return 99;
  }
  return count;
}
