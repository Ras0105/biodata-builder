// schema.js — template_11 (Marathi Kuldaivat)
// Independent of every other template. First Marathi-language template in
// the catalog — labels themselves are in Devanagari script (मराठी), matching
// the reference format. Includes Maharashtrian-specific astrological fields
// (Kuldaivat, Nadi, Gan, Varna) that no other template in this catalog has.

export const schema = {
  id: "template_11",
  photo: {
    id: "photo",
    label: "फोटो",
    shape: "rect",
    required: true,
  },
  sections: [
    {
      id: "personal",
      title: "वैयक्तिक माहिती",
      fields: [
        { id: "naav", label: "नाव", type: "text", required: true },
        { id: "janmaTarikh", label: "जन्म तारीख", type: "date", required: true },
        { id: "janmaVel", label: "जन्म वेळ", type: "text" },
        { id: "janmaThikaan", label: "जन्म ठिकाण", type: "text" },
        { id: "dharmaJaat", label: "धर्म/जात", type: "text" },
        { id: "kuldaivat", label: "कुलदैवत", type: "text" },
        { id: "gotra", label: "गोत्र", type: "text" },
        { id: "nakshatra", label: "नक्षत्र", type: "text" },
        { id: "rashi", label: "राशी", type: "text" },
        { id: "naadi", label: "नाडी", type: "text" },
        { id: "gan", label: "गण", type: "text" },
        { id: "varna", label: "वर्ण", type: "text" },
        { id: "unchi", label: "उंची", type: "text" },
        { id: "raktagat", label: "रक्तगट", type: "text" },
        { id: "shikshan", label: "शिक्षण", type: "text" },
        { id: "naukri", label: "नोकरी", type: "text" },
        { id: "vetan", label: "वेतन", type: "text" },
      ],
    },
    {
      id: "family",
      title: "कौटुंबिक माहिती",
      fields: [
        { id: "vadilancheNaav", label: "वडिलांचे नाव", type: "text" },
        { id: "vadilanchaVyavasay", label: "वडिलांचा व्यवसाय", type: "text" },
        { id: "aaicheNaav", label: "आईचे नाव", type: "text" },
        { id: "bhau", label: "भाऊ", type: "text" },
        { id: "bahin", label: "बहीण", type: "text" },
        { id: "mama", label: "मामा", type: "text" },
        { id: "nateSambandh", label: "नातेसंबंध", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "संपर्क",
      fields: [
        { id: "mobile", label: "मोबाईल नंबर", type: "text", required: true },
        { id: "patta", label: "पत्ता", type: "text" },
      ],
    },
  ],
};

export function emptyFormData() {
  const data = { photo: null };
  schema.sections.forEach((section) => {
    section.fields.forEach((f) => { data[f.id] = ""; });
  });
  return data;
}