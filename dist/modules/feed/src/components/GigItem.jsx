import React, { useState } from 'react';
import CompleteForm from './CompleteForm';
import '../GigItem.css';

const GigItem = ({ gig }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    // Simulate POST /accept
    setAccepted(true);
    alert(`Accepted ${gig.title}`);
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="font-semibold">{gig.title}</h3>
      <p>{gig.description}</p>
      <p className="text-orange-500">{gig.bounty}</p>

      {!accepted ? (
        <button onClick={handleAccept} className="bg-orange-500 text-white px-3 py-1 rounded mt-2">
          Accept
        </button>
      ) : (
        <>
          <p className="text-blue-500 mt-2">In Progress</p>
          <CompleteForm gigId={gig.id} />
        </>
      )}
    </div>
  );
};

export default GigItem;
