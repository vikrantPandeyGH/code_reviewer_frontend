import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { marked } from "marked";
import MonacoEditor from "@monaco-editor/react";

const Projectpage = () => {
  const id = useParams().id;
  const [Socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("// Start coding...");
  const [reviewContent, setReviewContent] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    const temp = io("https://code-reviewer-backend-flax.vercel.app/", {
      query: { project: id },
    });

    temp.on("chat-message", function (msg) {
      setMessages((previous) => [...previous, msg]);
    });

    temp.emit("chat-history");

    temp.on("chat-history", function (msgs) {
      const nearr = msgs.map((mg) => mg.text);
      setMessages(nearr);
    });

    temp.emit("get-code");

    temp.on("code-history", function (receivedCode) {
      setCode(receivedCode);
    });

    temp.on("code-update", function (newCode) {
      setCode(newCode);
    });

    temp.on("code-review", function (rev) {
      setReviewContent(rev);
    });
    setSocket(temp);
  }, []);

  function handleUserInput() {
    setMessages((prev) => [...prev, input]);
    Socket.emit("chat-message", input);
    setInput("");
  }

  function reviewgenerater() {
    if (Socket) {
      Socket.emit("code-review", code);
    }
  }

  function handleCodeChange(value) {
    setCode(value);
    if (Socket) Socket.emit("code-update", value);
  }

  return (
    <div id="project-container">
      {/* Chat Section */}
      <div id="chat">
        <div id="allchats">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="chat-div">
                {msg}
              </div>
            ))
          ) : (
            <p>No messages yet</p>
          )}
        </div>

        <div id="chat-section">
          <input
            value={input}
            type="text"
            onChange={(event) => setInput(event.target.value)}
          />
          <button id="send-btn" onClick={handleUserInput}>
            Send
          </button>
        </div>
      </div>

      {/* Code Editor Section */}
      <div id="code">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            marginBottom: "2px",
            borderRadius: "4px",
            padding: "4px",
            fontSize: "14px",
            background: "#252526",
            color: "#fff",
            border: "1px solid #333",
            outline: "none",
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
        <MonacoEditor
          className="my-monaco-editor"
          language={language}
          value={code}
          theme="vs-dark"
          options={{
            fontSize: 15,
            fontFamily: 'Fira Mono, Consolas, "Courier New", monospace',
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            roundedSelection: true,
            scrollbar: { vertical: "auto" },
            padding: { top: 10, bottom: 10 },
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            tabSize: 2,
            formatOnType: true,
            formatOnPaste: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: true, strings: true },
            acceptSuggestionOnEnter: "on",
            renderWhitespace: "boundary",
            bracketPairColorization: { enabled: true },
            guides: { indentation: true },
            suggestSelection: "first",
            snippetSuggestions: "inline",
          }}
          onChange={handleCodeChange}
        />
      </div>

      {/* Review Section */}
      <div id="review" style={{ overflowY: "auto", padding: "5px" }}>
        <button
          id="reviewer"
          onClick={function () {
            reviewgenerater();
          }}
        >
          generate review
        </button>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            paddingLeft: "10px",
            borderRadius: "8px",
            maxWidth: "600px",
            color: "#333",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: marked(reviewContent) }}
        />
      </div>
    </div>
  );
};

export default Projectpage;