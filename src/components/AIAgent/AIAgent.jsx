import React, { useMemo, useState } from "react";
import styles from "./AIAgent.module.css";
import projects from "../../data/projects.json";
import history from "../../data/history.json";

const buildDefaultContext = () => {
  const experienceText = history
    .map((item) => {
      const lines = item.experiences?.join("; ");
      return `${item.role} at ${item.organisation} (${item.startDate}-${item.endDate}): ${lines}`;
    })
    .join("\n");

  const projectText = projects
    .map((project) => {
      const domains = Array.isArray(project.domains)
        ? project.domains.join(", ")
        : project.domain || "N/A";
      return `${project.title} [${domains}] - ${project.description}`;
    })
    .join("\n");

  return `Profile summary:
${experienceText}

Projects summary:
${projectText}`;
};

export const AIAgent = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useMemo(() => buildDefaultContext(), []);

  const apiBase = useMemo(
    () =>
      import.meta.env.VITE_AI_API_BASE ||
      (import.meta.env.DEV ? "http://localhost:8787" : ""),
    []
  );

  const quickPrompts = [
    "What is your strongest domain experience?",
    "Which project best demonstrates your full-stack capability?",
    "Which projects show your embedded systems skills?",
    "What technologies do you use most in industrial automation?",
    "How much experience do you have in semiconductor software?",
    "Which projects are most relevant for a Software Engineer role?",
    "What leadership or team collaboration experience do you have?",
    "Which work best matches automotive domain requirements?",
    "What are your strongest programming languages?",
    "Which project highlights your AI and computer vision skills?",
    "What technologies do you use for web development?",
  ];

  const askAgent = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setError("Please enter a question.");
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: trimmedQuestion }]);
    setQuestion("");
    setIsLoading(true);
    try {
      const base = apiBase ? apiBase.replace(/\/$/, "") : "";
      const response = await fetch(`${base}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context,
          question: trimmedQuestion,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error || "Failed to get a response.");
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: payload?.answer || "No answer returned." },
        ]);
      }
    } catch (_error) {
      setError("Cannot reach AI server. Start backend with `npm run server`.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.container} id="ai-agent">
      <h2 className={styles.title}>Ask About Me</h2>
      <p className={styles.subtitle}>
        Ask me anything about my experience, projects, or skills — I’m happy to
        share!
      </p>

      <div className={styles.quickPrompts}>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className={styles.quickPrompt}
            onClick={() => setQuestion(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className={styles.chatBox}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            Try asking: "Which projects best match embedded systems roles?"
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`${styles.message} ${
                message.role === "user" ? styles.userMessage : styles.assistantMessage
              }`}
            >
              {message.text}
            </div>
          ))
        )}
        {isLoading && <div className={styles.thinking}>AI is thinking...</div>}
      </div>

      <form className={styles.form} onSubmit={askAgent}>
        <textarea
          id="agent-question"
          className={styles.textarea}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="Ask anything about me, my experience, or my projects..."
        />

        <button className={styles.askBtn} type="submit" disabled={isLoading}>
          {isLoading ? "Thinking..." : "Ask Me!"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </section>
  );
};
