import React from "react";
import Spinner from "../icons/Spinner";
import { useState, useEffect, createContext } from "react";
import { db } from "../appwrite/databases";
export const NoteContext = createContext();
const NoteProvider = ({ children }) => {
  const [selectedNote, setSelectedNote] = useState(null);
    const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const init = async () => {
    const response = await db.notes.list();
    setNotes(response.documents);
    setLoading(false);
  };
  useEffect(()=>{
    init()
  },[])
  const contextData = {notes, setNotes, selectedNote, setSelectedNote};
  return (
    <NoteContext.Provider value={ contextData }>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NoteContext.Provider>
  );
};
export default NoteProvider;
