import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CompleteForm.css';


const CompleteForm = ({ gigId }) => {
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(`POST /api/gigs/${gigId}/complete`);
    console.log("File:", file);
    console.log("Comment:", comment);
    console.log("POST /api/credits");

    alert("+1 Credit");
    navigate('/wallet');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input type="file" required onChange={(e) => setFile(e.target.files[0])} />
      <textarea
        required
        className="block border mt-2 p-2 w-full"
        placeholder="Add a comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button className="bg-green-600 text-white px-3 py-1 mt-2 rounded">Submit</button>
    </form>
  );
};

export default CompleteForm;
