const express = require("express");
const groq = require("../groq");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { rows } = req.body;

    const prompt = `
You are an AI CRM data extraction engine.

Convert the following CSV rows into JSON.

Return ONLY valid JSON.

Format:

{
  "imported":[
    {
      "created_at":"",
      "name":"",
      "email":"",
      "country_code":"",
      "mobile_without_country_code":"",
      "company":"",
      "city":"",
      "state":"",
      "country":"",
      "lead_owner":"",
      "crm_status":"",
      "crm_note":"",
      "data_source":"",
      "possession_time":"",
      "description":""
    }
  ],
  "skipped":[]
}

Rules:
1. Skip records that have neither email nor mobile.
2. crm_status must be one of:
GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE
For every imported record, crm_status is mandatory. If there is no negative information, set crm_status to GOOD_LEAD_FOLLOW_UP.
3. Never invent values.
4. Return ONLY JSON.

CSV:
${JSON.stringify(rows)}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    let text = completion.choices[0].message.content;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);
    data.imported = data.imported.map((item) => ({
  ...item,
  crm_status: item.crm_status || "GOOD_LEAD_FOLLOW_UP",
}));

    res.json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;