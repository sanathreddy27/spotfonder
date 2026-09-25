import { useState } from "react";
import "./TravelChatbot.css";

function TravelChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm SpotFonder AI. Ask me anything about travelling in India.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    const userMessage = {
      role: "user",
      text: question,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: question,
            history: messages,
          }),
        }
      );

      console.log("✅ Chat response received:", response.status);

      if (!response.ok) {
        throw new Error(
          `Chat request failed: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("✅ Chat data received:", data);

      if (!data.success) {
        throw new Error(
          data.message || "Chat request failed."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            data.answer ||
            "I couldn't find an answer right now.",
          type: data.type || "text",
          photos: data.photos || [],
        },
      ]);
    } catch (error) {
      console.error("❌ Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            "Sorry, I couldn't connect to SpotFonder AI right now. Please make sure the backend and Ollama are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (question) => {
    setInput(question);
  };

  return (
    <section className="travel-chatbot-section">
      <div className="travel-chatbot-container">

        <div className="travel-chatbot-header">
          <div className="travel-chatbot-header-content">
            <span className="travel-chatbot-icon">
              🤖
            </span>

            <div>
              <h2>SpotFonder AI Travel Assistant</h2>

              <p>
                Ask me anything about destinations,
                hotels, food and trips.
              </p>
            </div>
          </div>

          <span className="travel-chatbot-status">
            ● Online
          </span>
        </div>

        <div className="travel-chatbot-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.role === "user"
                  ? "chat-message-user"
                  : "chat-message-ai"
              }`}
            >

              {message.role === "assistant" && (
                <span className="chat-avatar">
                  🤖
                </span>
              )}

              <div className="chat-message-content">

                <div className="chat-message-bubble">
                  {message.text}
                </div>

                {message.photos &&
                  message.photos.length > 0 && (
                    <div className="chat-photo-grid">

                      {message.photos.map(
                        (photo, photoIndex) => (
                          <div
                            className="chat-photo-card"
                            key={
                              photoIndex
                            }
                          >
                            <img
                              src={photo.image}
                              alt={
                                photo.title ||
                                "Travel photo"
                              }
                              loading="lazy"
                            />

                            <div className="chat-photo-info">
                              <p>
                                {photo.title ||
                                  "Travel photo"}
                              </p>

                              {photo.sourceUrl && (
                                <a
                                  href={
                                    photo.sourceUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View source
                                </a>
                              )}
                            </div>
                          </div>
                        )
                      )}

                    </div>
                  )}

              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message chat-message-ai">
              <span className="chat-avatar">
                🤖
              </span>

              <div className="chat-message-bubble">
                Thinking...
              </div>
            </div>
          )}

        </div>

        <form
          className="travel-chatbot-input-area"
          onSubmit={handleSend}
        >
          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder="Ask about destinations, hotels, food..."
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              !input.trim() || loading
            }
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        <div className="travel-chatbot-suggestions">

          <button
            type="button"
            onClick={() =>
              handleSuggestion(
                "Best places to visit in Kerala?"
              )
            }
          >
            🌴 Kerala
          </button>

          <button
            type="button"
            onClick={() =>
              handleSuggestion(
                "Plan a 3 day trip to Munnar"
              )
            }
          >
            🏔️ Munnar
          </button>

          <button
            type="button"
            onClick={() =>
              handleSuggestion(
                "Best hill stations in India?"
              )
            }
          >
            ⛰️ Hill stations
          </button>

          <button
            type="button"
            onClick={() =>
              handleSuggestion(
                "Best food to try in Kerala?"
              )
            }
          >
            🍛 Food
          </button>

        </div>

      </div>
    </section>
  );
}

export default TravelChatbot;