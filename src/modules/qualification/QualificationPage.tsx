// src/modules/qualification/QualificationPage.tsx
import React, { useState } from 'react';

export default function QualificationPage(): JSX.Element {
  const [status, setStatus] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fm = new FormData(e.currentTarget);
    const fullName = (fm.get('fullName') || '').toString().trim();
    const email = (fm.get('email') || '').toString().trim();
    const phone = (fm.get('phone') || '').toString().trim();
    const education = (fm.get('education') || '').toString().trim();

    // Basic client validation
    if (fullName.length < 2) {
      setStatus('Please enter your full name (min 2 chars).');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }

    setStatus('Submitting...');
    try {
      const res = await fetch('/api/qualification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, education })
      });
      if (res.ok) {
        setStatus('Submitted successfully — thank you!');
        e.currentTarget.reset();
      } else {
        const j = await res.json().catch(()=>null);
        setStatus('Submission failed: ' + (j?.error || res.statusText));
      }
    } catch (err) {
      setStatus('Submission failed: network error');
      console.error(err);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Qualification Gate</h1>

      <form
        onSubmit={handleSubmit}
        aria-label="Qualification form"
        className="space-y-4"
      >
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">Full name</label>
          <input
            id="fullName"
            name="fullName"
            aria-label="Full name"
            required
            minLength={2}
            className="w-full border rounded-md p-3"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            aria-label="Email address"
            type="email"
            required
            className="w-full border rounded-md p-3"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone (optional)</label>
          <input id="phone" name="phone" aria-label="Phone" className="w-full border rounded-md p-3" />
        </div>

        <div>
          <label htmlFor="education" className="block text-sm font-medium">Education (optional)</label>
          <input id="education" name="education" aria-label="Education" className="w-full border rounded-md p-3" />
        </div>

        <div>
          <button
            type="submit"
            className="rounded-md px-4 py-3 bg-[#2563EB] text-white focus:outline-none focus:ring-2"
          >
            Submit
          </button>
        </div>

        <div role="status" aria-live="polite" className="mt-2 text-sm">
          {status}
        </div>
      </form>
    </main>
  );
}
