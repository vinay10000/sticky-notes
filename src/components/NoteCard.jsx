import DeleteButton from "../components/DeleteButton";
import { useRef, useEffect, useState } from "react";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import Spinner from "../icons/Spinner";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
const NoteCard = ({ note }) => {
  const [saving, setSaving] = useState(false);
  const { setSelectedNote } = useContext(NoteContext);
  const keyUpTimer = useRef(null);
  const body = bodyParser(note.body);
  const [position, setposition] = useState(JSON.parse(note.position));
  let mouseStartPos = { x: 0, y: 0 };
  const cardRef = useRef(null);
  const colors = JSON.parse(note.colors);
  const textAreaRef = useRef(null);
  useEffect(() => {
    autoGrow(textAreaRef);
    setZIndex(cardRef.current);
  }, []);
  const mouseDown = (e) => {
    if (e.target.className === "card-header") {
      mouseStartPos = { x: e.clientX, y: e.clientY };
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      setZIndex(cardRef.current);
      setSelectedNote(note);
    }
  };
  const mouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };
    mouseStartPos = { x: e.clientX, y: e.clientY };
    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setposition(newPosition);
  };
  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
    const newPosition = setNewOffset(cardRef.current);
    saveData("position", newPosition);
  };
  const saveData = async (key, value) => {
    const payload = { [key]: JSON.stringify(value) };
    try {
      await db.notes.update(note.$id, payload);
    } catch (error) {
      console.log(error);
    }
    setSaving(false);
  };
  const handleKeyUp = function (e) {
    setSaving(true);
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }
    keyUpTimer.current = setTimeout(() => {
      saveData("body", textAreaRef.current.value);
    }, 2000);
  };
  return (
    <div
      className="card"
      ref={cardRef}
      style={{
        backgroundColor: colors.colorBody,
        left: position.x,
        top: position.y,
      }}
    >
      <div
        onMouseDown={mouseDown}
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
      >
        <DeleteButton noteId={note.$id} />
        {saving && (
          <div className="card-saving">
            <Spinner color={colors.colorText} />
            <span style={{ color: colors.colorText }}>Saving...</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <textarea
          onKeyUp={handleKeyUp}
          ref={textAreaRef}
          style={{ color: colors.colorText }}
          defaultValue={body}
          onInput={() => autoGrow(textAreaRef)}
          onFocus={() => {setZIndex(cardRef.current); setSelectedNote(note)}}
        ></textarea>
      </div>
    </div>
  );
};

export default NoteCard;
