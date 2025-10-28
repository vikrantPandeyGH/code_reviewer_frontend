import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { marked } from "marked";
import MonacoEditor from "@monaco-editor/react";

const Projectpage = () => {
  const { id } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("// Start coding...");
  const [reviewContent, setReviewContent] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    const tempSocket = io("https://code-reviewer-backend-flax.vercel.app", {
      query: { project: id },
    });

    setSocket(tempSocket);

    tempSocket.on("chat-history", (msgs) => setMessages(msgs));

    tempSocket.on("chat-message", (msg) => setMessages((prev) => [...prev, msg]));

    tempSocket.on("code-history", (receivedCode) => setCode(receivedCode));

    tempSocket.on("code-update", (newCode) => setCode(newCode));

    tempSocket.on("code-review", (review) => setReviewContent(review));

    tempSocket.emit("chat-history");
    tempSocket.emit("get-code");

    return () => tempSocket.disconnect();
  }, [id]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    socket.emit("chat-message", input);
    setInput("");
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) socket.emit("code-update", value);
  };

  const generateReview = () => {
    if (socket) socket.emit("code-review", code);
  };

  return (
    <div id="project-container">
      <div id="chat">
        <div id="allchats">
          {messages.length
            ? messages.map((msg, i) => <div key={i} className="chat-div">{msg}</div>)
            : <p>No messages yet</p>}
        </div>
        <div id="chat-section">
          <input value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      <div id="code">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>

        <MonacoEditor
          language={language}
          value={code}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div id="review">
        <button onClick={generateReview}>Generate Review</button>
        <div dangerouslySetInnerHTML={{ __html: marked(reviewContent) }} />
      </div>
    </div>
  );
};

export default Projectpage;
