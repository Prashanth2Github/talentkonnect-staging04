// src/modules/spotlight/SpotlightPage.tsx
import React, { useEffect, useState } from 'react';
import { dateISTString } from '../../lib/date';

type User = { id: string; name: string; email: string };

export default function SpotlightPage(): JSX.Element {
  const [entries, setEntries] = useState<User[]>([]);
  const [winner, setWinner] = useState<{ date: string; winner?: User | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchAll() {
    setLoading(true);
    try {
      const [eR, wR] = await Promise.all([
        fetch('/api/spotlight/eligible').then(r => r.json()),
        fetch('/api/spotlight/winner').then(r => r.json())
      ]);
      setEntries(Array.isArray(eR) ? eR : []);
      setWinner(wR || null);
    } catch (err) {
      console.error(err);
      alert('Failed to load spotlight data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  async function enterSpotlight() {
    const name = prompt('Name (demo entry):');
    const email = prompt('Email (demo entry):');
    if (!name || !email) {
      alert('Name & email required for demo entry');
      return;
    }
    const id = crypto.randomUUID();
    const payload = { id, name, email };
    // optimistic update
    setEntries(prev => [payload, ...prev]);
    try {
      const res = await fetch('/api/spotlight/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        setEntries(prev => prev.filter(x => x.id !== id));
        alert('Failed to enter');
      } else {
        alert('Entered successfully');
      }
    } catch (err) {
      setEntries(prev => prev.filter(x => x.id !== id));
      alert('Failed to enter (network)');
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Daily Spotlight</h1>
        <div>
          <button onClick={enterSpotlight} className="rounded-md px-4 py-2 bg-[#2563EB] text-white">Enter Spotlight</button>
          <button onClick={fetchAll} className="ml-2 rounded-md px-4 py-2 border border-[#2563EB] text-[#2563EB]">Refresh</button>
        </div>
      </div>

      {loading ? <p>Loading…</p> : (
        <>
          <section className="mb-4 p-4 border rounded-md">
            <h2 className="font-medium">Today's Winner</h2>
            {winner?.winner ? (
              <div className="mt-2">
                <div className="font-semibold">{winner.winner.name}</div>
                <div className="text-sm text-ink/70">{winner.winner.email}</div>
                <div className="text-xs text-ink/60 mt-1">Date (IST): {winner.date}</div>
              </div>
            ) : <p className="mt-2">No winner selected yet for {winner?.date ?? dateISTString()}.</p>}
          </section>

          <section className="p-4 border rounded-md">
            <h3 className="font-medium mb-2">Eligible Entries ({entries.length})</h3>
            <ul className="divide-y">
              {entries.map(e => (
                <li key={e.id} className="py-3 flex justify-between">
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-sm text-ink/70">{e.email}</div>
                  </div>
                  <div className="text-xs text-ink/60">{e.id.slice(0, 8)}</div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
