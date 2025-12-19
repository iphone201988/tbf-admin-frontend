const KEY = "tbf_device_id";

export function getBrowserDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    const fallback = Math.random().toString(36).slice(2);
    id = (crypto.randomUUID ? crypto.randomUUID() : fallback) + "-" + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

