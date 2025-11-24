package com.bookstore.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    // Gemini Model URL
    private static final String MODEL_URL =
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=";

    // 🔥 FIXED SYSTEM PROMPT: This controls the bookstore’s personality & rules
    private static final String SYSTEM_PROMPT =
            "You are the official AI assistant of Fable Foundry Bookstore. "
            + "Your job is to assist customers with book availability, recommendations from our own inventory, "
            + "and bookstore-related queries. "
            + "STRICT RULES:\n"
            + "1. Only respond based on Fable Foundry’s inventory and database context.\n"
            + "2. NEVER recommend Amazon, other bookstores, libraries, or any external sellers.\n"
            + "3. If a book is available, state its availability clearly.\n"
            + "4. If a book is NOT available, say it is out of stock and optionally suggest similar books ONLY from our inventory (if provided).\n"
            + "5. If no relevant inventory data is provided, politely say you don’t have info.\n"
            + "You must ALWAYS act as the Fable Foundry assistant.";

    /**
     * Generate AI response using:
     * - systemPrompt (fixed)
     * - dbContext (optional dynamic data from DB search)
     * - userMessage (raw user's question)
     */
    public String generateResponse(String userMessage, String dbContext) {

        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            // Escape quotes to avoid breaking JSON
            String safeUser = userMessage.replace("\"", "\\\"");
            String safeContext = dbContext == null ? "" : dbContext.replace("\"", "\\\"");

            // 🧩 BUILD FULL PROMPT (system + context + user)
            String fullPrompt =
                    "SYSTEM:\n" + SYSTEM_PROMPT + "\n\n"
                    + "CONTEXT FROM DATABASE:\n" + safeContext + "\n\n"
                    + "USER:\n" + safeUser;

            // 📌 Gemini v1 API – NO roles, just a text part
            String requestBody =
                    "{ \"contents\": [ { \"parts\": [ { \"text\": \"" + fullPrompt + "\" } ] } ] }";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    MODEL_URL + apiKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = mapper.readTree(response.getBody());

            return root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            System.out.println("Gemini ERROR: " + e.getMessage());
            return "Sorry, I couldn’t process your request right now.";
        }
    }
}
