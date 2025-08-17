// lib/api.ts  

export async function apiGet(path: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}