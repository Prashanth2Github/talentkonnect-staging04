import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../GigList.css';

const mockGigs = [
  { id: 1, title: "Fold laundry", description: "Fold 10 clothes", bounty: "$1" },
  { id: 2, title: "Sketch logo", description: "Quick logo draft", bounty: "$1" }
];

export default function GigList() {
  const [acceptedGig, setAcceptedGig] = useState(null);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleAccept = (id) => {
    setAcceptedGig(id);
  };

  const handleComplete = () => {
    if (!file || !comment) return alert("Fill all fields");
    alert("Gig completed! +1 Credit");
    navigate("/wallet");
  };

  return (
    <div>
      <h2>Available Gigs</h2>
      {mockGigs.map((gig) => (
        <div key={gig.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p>Bounty: {gig.bounty}</p>
          {acceptedGig === gig.id ? (
            <div>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <textarea placeholder="Comment" onChange={(e) => setComment(e.target.value)} />
              <button onClick={handleComplete}>Submit</button>
            </div>
          ) : (
            <button onClick={() => handleAccept(gig.id)}>Accept</button>
          )}
        </div>
      ))}
    </div>
  );
}
