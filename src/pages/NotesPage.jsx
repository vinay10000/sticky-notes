import { useContext } from 'react';
import Controls from '../components/Controls';
import NoteCard from '../components/NoteCard';
import { NoteContext } from '../context/NoteContext';

const NotesPage = () => {
  const { notes } = useContext(NoteContext);

  if (!notes) {
    // Handle the case where notes is still undefined or null
    return <div>Loading...</div>;
  }

  return (
    <div>
      {notes.map(note => (
        <NoteCard key={note.$id} note={note} />
      ))}
      <Controls />
    </div>
  );
};

export default NotesPage;
