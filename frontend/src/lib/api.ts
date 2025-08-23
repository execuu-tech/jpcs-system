// lib/api.ts
async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
}

export async function apiGet(path: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, { cache: "no-store" });
  return handleResponse(res);
}

export async function apiPost(path: string, body: any) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path: string, body: any) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  const res = await fetch(url, { method: "DELETE" });
  await handleResponse(res);
  return true;
}
