
export function maskPhone(phone: string, visibleDigits = 2): string {
  const separator = phone.lastIndexOf(' ') + 1;
  const prefix = phone.slice(0, separator);
  const number = phone.slice(separator);
  const visible = number.slice(-visibleDigits);
  return prefix + '*'.repeat(Math.max(0, number.length - visibleDigits)) + visible;
}
