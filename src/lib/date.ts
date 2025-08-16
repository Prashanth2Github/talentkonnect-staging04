export function getISTDate(): Date {
  const now = new Date();
  // convert UTC → IST (UTC+5:30)
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
}

export function formatDateIST(date: Date): string {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
