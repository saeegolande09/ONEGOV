const knowledgeBase = [
  {
    keywords: ["hello", "hi", "hey", "start", "help", "namaste", "good morning", "good evening"],
    response: "Namaste! 👋 Welcome to OneGov Support AI. I can help you with government portals, schemes, eligibility, document reuse, application tracking, and citizen services."
  },
  {
    keywords: ["who are you", "what is this", "about onegov", "about portal", "onegov", "bharatsetu"],
    response: "OneGov is a unified government service platform designed to connect verified government data and services in one place, making it easier for citizens to access services without repeatedly submitting the same information."
  },
  {
    keywords: ["scheme", "schemes", "welfare scheme", "government scheme", "yojana"],
    response: "You can find suitable government schemes through the **Eligibility Checker**. It uses details such as income, age, category, and state to identify potentially matching schemes."
  },
  {
    keywords: ["eligible", "eligibility", "am i eligible", "qualify", "qualification"],
    response: "To check your eligibility, open **Eligibility Checker** from the left navigation menu. Enter the required details and the platform will show schemes that match your profile."
  },
  {
    keywords: ["scholarship", "student", "education", "college", "fee", "tuition"],
    response: "Education and scholarship services are available through the **Educational Qualifications Registry**. You can also track submitted scholarship applications from **Application History**."
  },
  {
    keywords: ["farmer", "agriculture", "pm kisan", "crop", "farming"],
    response: "Farmer and agriculture-related services can be accessed through the **Land Records & Revenue Department** and relevant welfare service sections."
  },
  {
    keywords: ["land", "property", "survey number", "land record", "agricultural land"],
    response: "Land-related verified information is available through the **Land Records & Revenue Department** portal. Select the corresponding portal card from your dashboard."
  },
  {
    keywords: ["caste", "reservation", "caste certificate", "community certificate"],
    response: "Caste and community-related services are available under the **Social Welfare & Caste Certificate** portal. You can use it to view relevant verified records and certificate information."
  },
  {
    keywords: ["uidai", "aadhaar", "national identity", "identity", "address proof"],
    response: "Your verified identity information is available through the **National Identity & Address Portal**. Open the portal from your dashboard to view the linked identity information."
  },
  {
    keywords: ["pan", "gst", "tax", "income tax", "business", "gstin"],
    response: "PAN, GST, tax, and business-related information can be accessed through the **Revenue & Income Assessment** and **Taxation & Business Registry** sections."
  },
  {
    keywords: ["income certificate", "income", "annual income", "income proof"],
    response: "Income-related information and certificate services are available through the **Revenue & Income Assessment Portal**."
  },
  {
    keywords: ["rto", "driving license", "driving licence", "license", "licence", "vehicle", "transport", "rc"],
    response: "Driving licence, vehicle, and transport-related services are available through the **Transport Department (RTO)** portal."
  },
  {
    keywords: ["abha", "health", "hospital", "medical", "health insurance"],
    response: "Health-related information and services are available through the **National Health Authority (ABHA)** section."
  },
  {
    keywords: ["job", "employment", "unemployed", "work", "career", "labour", "labor"],
    response: "Employment and career-related services are available through the **Employment Exchange Board** portal."
  },
  {
    keywords: ["document", "documents", "docs", "upload", "certificate", "files"],
    response: "With **Document Reuse**, verified documents can be reused for eligible services instead of repeatedly submitting the same documents. Data is shared only when the required consent is provided."
  },
  {
    keywords: ["reuse", "document reuse", "reuse documents", "repeat documents"],
    response: "**Document Reuse** helps reduce repeated document submission. Once a document is available from a verified government source, it can be reused for another eligible service with citizen consent."
  },
  {
    keywords: ["consent", "privacy", "permission", "revoke consent", "data sharing"],
    response: "You control how your data is shared. Open **Consent Management** to review, approve, or revoke data-sharing permissions."
  },
  {
    keywords: ["security", "secure", "safe", "data security"],
    response: "OneGov is designed around controlled data sharing, citizen consent, verified government sources, and audit logging to improve transparency and security."
  },
  {
    keywords: ["audit", "audit logs", "logs", "activity", "access history"],
    response: "You can review data-access and security activity through the **Audit Logs** section in the left navigation menu."
  },
  {
    keywords: ["status", "application status", "track application", "track", "submitted application"],
    response: "To track an application, open **Application History** or select the **Unified Scheme & Application Tracker** from your dashboard."
  },
  {
    keywords: ["application", "applications", "application history", "submitted"],
    response: "Your submitted applications can be viewed and tracked from **Application History**. You can check the current status and available remarks there."
  },
  {
    keywords: ["grievance", "complaint", "issue", "ticket", "problem"],
    response: "If you face an issue with a service, open **Grievance Management** from the sidebar and submit a grievance. You can use your Grievance ID to track updates."
  },
  {
    keywords: ["notification", "notifications", "alert", "alerts", "updates", "messages"],
    response: "Check the **Notifications** section or the Recent Notifications panel on your dashboard for application, verification, and service updates."
  },
  {
    keywords: ["login", "sign in", "account", "profile", "logout", "sign out"],
    response: "You can manage your account from the profile section at the top-right of the dashboard. Use the available profile or logout options according to the action you need."
  },
  {
    keywords: ["portal", "portals", "government portal", "department"],
    response: "The **Government Portals** section provides access to verified information from different government departments such as Identity, Revenue, Education, Health, RTO, Land Records, and Employment."
  },
  {
    keywords: ["how does onegov work", "how it works", "how does it work", "working"],
    response: "OneGov connects government data sources through an interoperability layer. After citizen verification and consent, only the required information can be used for the selected service."
  },
  {
    keywords: ["minimum data", "purpose specific", "purpose specific data", "only required data"],
    response: "OneGov follows purpose-specific data sharing: **only the minimum data required for the selected purpose is shared.**"
  },
  {
    keywords: ["duplicate verification", "repeated verification", "government verification"],
    response: "By reusing verified information from connected government sources, OneGov aims to reduce unnecessary duplicate verification across services."
  },
  {
    keywords: ["repeated submission", "submit again", "same documents", "again and again"],
    response: "OneGov is designed to reduce repeated submission of the same citizen information and documents by enabling reuse of verified records with consent."
  }
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordMatches(query, keyword) {
  const normalizedQuery = normalizeText(query);
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (normalizedKeyword.includes(" ")) {
    return normalizedQuery.includes(normalizedKeyword);
  }

  const words = normalizedQuery.split(" ");
  return words.includes(normalizedKeyword);
}

function generateAIResponse(userQuery) {
  const query = normalizeText(userQuery);

  if (!query) {
    return "Please type your question and I’ll help you.";
  }

  let bestMatch = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;

    for (const keyword of item.keywords) {
      if (keywordMatches(query, keyword)) {
        const normalizedKeyword = normalizeText(keyword);

        if (normalizedKeyword.includes(" ")) {
          score += normalizedKeyword.split(" ").length * 3;
        } else {
          score += 2;
        }

        if (query === normalizedKeyword) {
          score += 5;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && bestScore >= 2) {
    return bestMatch.response;
  }

  return "I couldn't find an exact answer for that yet. You can ask me about **schemes, eligibility, documents, document reuse, consent, application status, government portals, RTO, income, education, health, land records, or grievances**.";
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function createMessage(text, type) {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = type === "user" ? "flex-end" : "flex-start";
  wrapper.style.maxWidth = "100%";

  const message = document.createElement("div");

  if (type === "user") {
    message.style.background = "#2563eb";
    message.style.color = "#ffffff";
  } else {
    message.style.background = "#ffffff";
    message.style.color = "#334155";
    message.style.border = "1px solid #e2e8f0";
  }

  message.style.padding = "10px 12px";
  message.style.borderRadius = "10px";
  message.style.maxWidth = "85%";
  message.style.fontSize = "12px";
  message.style.lineHeight = "1.5";
  message.innerHTML = type === "bot" ? formatResponse(text) : escapeHTML(text);

  const time = document.createElement("span");
  time.textContent = getTime();
  time.style.fontSize = "9px";
  time.style.color = "#94a3b8";
  time.style.marginTop = "3px";
  time.style.padding = "0 3px";

  wrapper.appendChild(message);
  wrapper.appendChild(time);

  return wrapper;
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const chatBox = document.getElementById("ai-chat-box");
  const sendBtn = document.getElementById("ai-chat-send");
  const inputEl = document.getElementById("ai-chat-input");
  const messagesEl = document.getElementById("ai-chat-messages");

  if (!toggleBtn || !chatBox || !sendBtn || !inputEl || !messagesEl) {
    return;
  }

  chatBox.style.display = "none";

  toggleBtn.addEventListener("click", () => {
    const isHidden = chatBox.style.display === "none";

    chatBox.style.display = isHidden ? "flex" : "none";

    if (isHidden) {
      setTimeout(() => inputEl.focus(), 100);
    }
  });

  window.handleUserMessage = function(customText) {
    const query = customText || inputEl.value.trim();

    if (!query) {
      inputEl.focus();
      return;
    }

    const userMessage = createMessage(query, "user");
    messagesEl.appendChild(userMessage);

    if (!customText) {
      inputEl.value = "";
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;

    const typingWrapper = document.createElement("div");
    typingWrapper.id = "ai-typing-indicator";
    typingWrapper.style.display = "flex";
    typingWrapper.style.alignItems = "center";
    typingWrapper.style.gap = "5px";
    typingWrapper.style.padding = "10px 12px";
    typingWrapper.style.background = "#ffffff";
    typingWrapper.style.border = "1px solid #e2e8f0";
    typingWrapper.style.borderRadius = "10px";
    typingWrapper.style.width = "fit-content";
    typingWrapper.style.fontSize = "11px";
    typingWrapper.style.color = "#64748b";

    typingWrapper.textContent = "OneGov AI is typing...";

    messagesEl.appendChild(typingWrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    setTimeout(() => {
      const typingIndicator = document.getElementById("ai-typing-indicator");

      if (typingIndicator) {
        typingIndicator.remove();
      }

      const reply = generateAIResponse(query);
      const botMessage = createMessage(reply, "bot");

      messagesEl.appendChild(botMessage);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 500);
  };

  sendBtn.addEventListener("click", () => {
    window.handleUserMessage();
  });

  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      window.handleUserMessage();
    }
  });
});