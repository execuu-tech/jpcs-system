import { apiGet } from "@/lib/api";

export default async function Home() {
  const members = await apiGet("members/");
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">JPCS Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m: any) => (
          <div key={m.id} className="rounded-2xl border p-4">
            <div className="font-semibold">{m.lastName}, {m.firstName} {m.middleName}</div>
            <div className="text-sm text-gray-500">{m.studentNumber}</div>
            {m.qr_code && (
              <img src={m.qr_code} alt="QR" className="mt-3 w-32 h-32" />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}