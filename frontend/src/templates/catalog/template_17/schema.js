// schema.js — template_17 (Noir Portrait Editorial)
// Independent of every other template. Adapted from a dark cinematic
// tribute-poster reference (big stacked name type, large portrait, numbered
// icon-list of traits, closing quote/byline) into biodata format: the
// icon-list becomes four fixed highlight rows (Personal / Family / Career /
// Beliefs) instead of free virtues, and the closing quote becomes the
// standard declaration line.

export const schema = {
  id: "template_17",
  photo: {
    id: "photo",
    label: "Photo",
    shape: "rect",
    required: true,
  },
  sections: [
    {
      id: "profile",
      title: "Profile",
      fields: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "tagline", label: "Tagline (e.g. community / profession)", type: "text" },
      ],
    },
    {
      id: "personalHighlight",
      title: "Personal",
      fields: [
        { id: "dob", label: "Date of Birth", type: "date", required: true },
        { id: "height", label: "Height", type: "text" },
        { id: "personalNote", label: "Note", type: "text", placeholder: "e.g. Non-smoker, teetotaller" },
      ],
    },
    {
      id: "familyHighlight",
      title: "Family",
      fields: [
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
        { id: "familyNote", label: "Note", type: "text", placeholder: "e.g. Joint family, settled in..." },
      ],
    },
    {
      id: "careerHighlight",
      title: "Career",
      fields: [
        { id: "occupation", label: "Occupation", type: "text" },
        { id: "education", label: "Education", type: "text" },
        { id: "careerNote", label: "Note", type: "text" },
      ],
    },
    {
      id: "beliefsHighlight",
      title: "Beliefs",
      fields: [
        { id: "religion", label: "Religion", type: "text" },
        { id: "caste", label: "Caste / Community", type: "text" },
        { id: "beliefsNote", label: "Note", type: "text" },
      ],
    },
    {
      id: "declaration",
      title: "Declaration",
      fields: [
        { id: "declarationText", label: "Closing line", type: "textarea", placeholder: "A short personal closing note or quote." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      fields: [
        { id: "phone", label: "Phone", type: "text", required: true },
        { id: "email", label: "Email", type: "text" },
        { id: "location", label: "Location", type: "text" },
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