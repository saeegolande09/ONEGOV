// Pre-loaded Knowledge Base for BharatSetu / ONEGOV
const knowledgeBase = [
  // --- General & Greetings ---
  {
    keywords: ["hello", "hi", "hey", "start", "help", "namaste", "good morning", "good evening"],
    response: "Namaste! Welcome to BharatSetu Support AI. I can assist you with portal navigation, scheme eligibility, document reuse, and government services."
  },
  {
    keywords: ["who are you", "what is this", "about bharatsetu", "about portal", "onegov"],
    response: "BharatSetu (ONEGOV) is a unified platform connecting multiple government registries so citizens can access verified data, check scheme eligibility, and apply for services in one place."
  },

  // --- Scheme & Eligibility Queries ---
  {
    keywords: ["scheme", "schemes", "eligible", "eligibility", "match", "filter"],
    response: "Click on **Eligibility Checker** in the left navigation menu. By entering your income, age, category, and state, the platform automatically filters matching welfare schemes."
  },
  {
    keywords: ["scholarship", "student", "education", "college", "fee"],
    response: "Education & scholarship services are available under **Educational Qualifications Registry**. You can track active scholarship applications in your **Application History** tab."
  },
  {
    keywords: ["farmer", "agriculture", "land", "pm kisan", "crop"],
    response: "Agricultural and land-related schemes can be accessed via the **Land Records & Revenue Department** portal card on your Home Dashboard."
  },
  {
    keywords: ["caste", "social welfare", "reservation", "certificate"],
    response: "Caste certificates and social welfare benefits can be viewed under the **Social Welfare & Caste Certificate** portal card."
  },

  // --- Identity & Government Portals ---
  {
    keywords: ["uidai", "aadhaar", "national identity", "identity", "address"],
    response: "Your verified national identity profile is linked via the **National Identity & Address Portal** on the home dashboard. Click it to view linked credential statuses."
  },
  {
    keywords: ["pan", "tax", "gst", "revenue", "income", "assessment"],
    response: "Tax assessments, PAN link status, and business registrations can be managed through the **Revenue & Income Assessment** and **Taxation & Business Registry** portal cards."
  },
  {
    keywords: ["rto", "license", "driving", "vehicle", "transport", "rc"],
    response: "For vehicle registration certificates (RC), driving licenses, and road transport applications, select the **Transport Department (RTO)** card on your dashboard."
  },
  {
    keywords: ["abha", "health", "hospital", "medical", "insurance"],
    response: "The **National Health Authority (ABHA)** registry allows you to access digital health IDs, link medical records, and check health-related scheme benefits."
  },
  {
    keywords: ["job", "employment", "unemployed", "work", "labour"],
    response: "Career registration and employment exchange services are managed under the **Employment Exchange Board** portal card."
  },

  // --- Platform Features & Settings ---
  {
    keywords: ["document", "docs", "upload", "reuse", "certificate", "files"],
    response: "With **Document Reuse**, you don't need to manually re-upload certificates. BharatSetu fetches your verified records directly from official registries with your consent."
  },
  {
    keywords: ["consent", "privacy", "security", "data", "permission", "revoke"],
    response: "You control your data. Navigate to **Consent Management** in the left sidebar to view, approve, or revoke third-party data-sharing permissions at any time."
  },
  {
    keywords: ["audit", "logs", "activity", "history"],
    response: "To review security activities and track who accessed your verified records, check the **Audit Logs** section in the left navigation panel."
  },

  // --- Tracking & Troubleshooting ---
  {
    keywords: ["status", "application", "track", "history", "submitted"],
    response: "To check the current stage of your submitted applications, go to **Application History** or open the **Unified Scheme & Application Tracker** on your dashboard."
  },
  {
    keywords: ["grievance", "complaint", "issue", "support", "ticket", "problem"],
    response: "If you encounter errors or delays with any service, lodge a formal ticket under **Grievance Management**. You can monitor resolution updates using your Grievance ID."
  },
  {
    keywords: ["notification", "alert", "updates", "message"],
    response: "Check the **Recent Notifications** panel on the right side of your home dashboard for real-time status alerts regarding applications, verifications, and matched schemes."
  },
  {
    keywords: ["login", "profile", "logout", "account", "citizen"],
    response: "You can view your verified citizen details or update profile settings by clicking **View Full Profile** under your profile card on the top right."
  }
];

// Offline AI Matching Engine
function generateAIResponse(userQuery) {
  const queryLower = userQuery.toLowerCase();

  // Keyword match loop
  for (const item of knowledgeBase) {
    if (item.keywords.some(keyword => queryLower.includes(keyword))) {
      return item.response;
    }
  }

  // Fallback response
  return "I am operating in offline guidance mode. I couldn't find a direct match for your request. Please check the **Help & FAQ** section in the sidebar or use the top search bar.";
}

// UI Handler Logic
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const chatBox = document.getElementById("ai-chat-box");
  const sendBtn = document.getElementById("ai-chat-send");
  const inputEl = document.getElementById("ai-chat-input");
  const messagesEl = document.getElementById("ai-chat-messages");

  if (!toggleBtn || !chatBox || !sendBtn || !inputEl || !messagesEl) return;

  // Toggle Visibility
  toggleBtn.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "none" ? "flex" : "none";
  });

  // Main Send Function
  window.handleUserMessage = function(customText) {
    const query = customText || inputEl.value.trim();
    if (!query) return;

    // Render User Message
    messagesEl.innerHTML += `<div style="align-self: flex-end; background: #007bff; color: white; padding: 8px 12px; border-radius: 10px; max-width: 85%; font-size: 13px;">${query}</div>`;
    if (!customText) inputEl.value = "";
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Simulated AI response delay
    setTimeout(() => {
      const reply = generateAIResponse(query);
      messagesEl.innerHTML += `<div style="align-self: flex-start; background: #e3f2fd; color: #212529; padding: 8px 12px; border-radius: 10px; max-width: 85%; font-size: 13px;">${reply}</div>`;
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 350);
  };

  sendBtn.addEventListener("click", () => window.handleUserMessage());
  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.handleUserMessage();
  });
});