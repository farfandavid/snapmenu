import { useState } from "react";

export default function Modal({ addTable, closeModal }) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    addTable(title);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Add Table Title</h2>
        <input
          type="text"
          className="border p-2 w-full mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleSubmit}>
          Add
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}
