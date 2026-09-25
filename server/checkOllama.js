import ollama from "ollama";

console.log("=================================");
console.log("🤖 DIRECT OLLAMA TEST");
console.log("=================================");

try {
  console.log("⏳ Sending request to Ollama...");

  const response = await ollama.chat({
    model: "qwen3:8b",

    messages: [
      {
        role: "user",
        content:
          "Explain why Munnar is famous in exactly two short sentences.",
      },
    ],
  });

  console.log("\n✅ Ollama responded:\n");

  console.log(response.message.content);

  console.log("\n=================================");
  console.log("✅ DIRECT OLLAMA TEST COMPLETE");
  console.log("=================================");
} catch (error) {
  console.error("\n❌ Ollama Error:");
  console.error(error);
}