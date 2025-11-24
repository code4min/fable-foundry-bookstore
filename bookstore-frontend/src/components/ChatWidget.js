import React, { useState } from "react";
import { IconButton, Box, TextField, Button, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // NEW

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true); // NEW

    try {
      const res = await axios.post(
        "http://localhost:8080/api/ai/chat",
        { message: input },
        { headers: { "Content-Type": "application/json" } }
      );

      // Backend returns plain TEXT response → No more res.data.response
      const botMsg = { sender: "bot", text: res.data };
      setMessages(prev => [...prev, botMsg]);

    } catch (err) {
      console.error("Chat request error:", err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I couldn't process your request." }
      ]);
    }

    setLoading(false); // NEW
    setInput("");
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 25,
            right: 25,
            backgroundColor: "#c6a67a",
            "&:hover": { backgroundColor: "#b8966c" },
            zIndex: 2000,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          <ChatIcon sx={{ color: "white" }} />
        </IconButton>
      )}

      {/* Chat Window */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 95,
            right: 25,
            width: 330,
            height: 430,
            backgroundColor: "#fcf6e8",
            border: "2px solid #c6a67a",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.25s ease-out"
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#c6a67a",
              px: 2,
              py: 1.2,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10
            }}
          >
            <Typography sx={{ fontWeight: "bold", color: "white" }}>
              Fable Foundry Assistant
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              px: 1.5,
              py: 1.2,
              mt: 1,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  mb: 1.2
                }}
              >
                <Typography
                  sx={{
                    display: "inline-block",
                    px: 1.6,
                    py: 1,
                    borderRadius: 3,
                    maxWidth: "85%",
                    lineHeight: 1.4,
                    fontSize: "0.9rem",
                    backgroundColor:
                      msg.sender === "user" ? "#e0c6a4" : "#ffffff",
                    boxShadow:
                      msg.sender === "user"
                        ? "0 1px 4px rgba(0,0,0,0.15)"
                        : "0 1px 3px rgba(0,0,0,0.15)"
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}

            {/* Loading indicator */}
            {loading && (
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#8b7b6a",
                  textAlign: "left",
                  px: 1,
                  mt: 1
                }}
              >
                Thinking...
              </Typography>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ display: "flex", gap: 1, px: 1.2, pb: 1.2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "white"
                }
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                backgroundColor: "#c6a67a",
                "&:hover": { backgroundColor: "#b8966c" },
                borderRadius: 2
              }}
            >
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatWidget;
