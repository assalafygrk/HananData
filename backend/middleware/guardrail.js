const { sendResponse } = require('../utils/helpers');

// Simple heuristic-based adversarial detection
const ADVERSARIAL_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /you are now (an admin|the developer|a founder)/i,
  /system prompt/i,
  /bypass (security|payment)/i,
  /override/i,
  /transfer.*proof/i,
  /my (mother|father|child|wife).*hospital/i, // Emotional manipulation
  /ref\d{4,}/i, // Fake transfer proofs
  /credit my (wallet|account)/i
];

exports.securityGuardrail = (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return sendResponse(res, 400, false, 'Message text is required');
  }

  // 1. Check for adversarial language
  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(text)) {
      console.warn(`[SECURITY] Blocked prompt injection / social engineering attempt: "${text}"`);
      return sendResponse(res, 403, false, 'Message flagged by security guardrail. Malicious intent detected.');
    }
  }

  // 2. Sanitize prompt (basic trimming & stripping)
  req.body.sanitizedText = text.trim().substring(0, 500); // Enforce length limit

  next();
};
