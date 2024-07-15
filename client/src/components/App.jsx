import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "./AuthContext";

function App() {
  const { isAuthenticated } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if(isAuthenticated) {
      async function fetchNotes() {
        try {
          const response = await axios.get("http://localhost:3000/notesAll", {}, { withCredentials: true });
          setNotes(response.data);
        } catch (error) {
          console.error(error);
        }
      }
      fetchNotes();
    }
  }, [isAuthenticated]);

  async function addNote(newNote) {
    newNote.id = uuidv4();
    setNotes(prevNotes => {
      return [...prevNotes, newNote];
    });
    try {
      await axios.post("http://localhost:3000/add", { newNote }, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteNote(id) {
    setNotes(prevNotes => {
      return prevNotes.filter((noteItem) => {
        return noteItem.id !== id;
      });
    });
    try {
      await axios.post("http://localhost:3000/delete", { id }, { withCredentials: true });
    } catch (error) {
      console.error(error);
    }
  }

  if(!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
