// schema.js — template_24 (Coral Panel Profile)
export const schema = {
  id: "template_24",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "dob", label: "Birth Date", type: "date", required: true },
      { id: "height", label: "Height", type: "text" },
      { id: "religion", label: "Religion", type: "text" },
      { id: "language", label: "Language", type: "text" },
      { id: "placeOfBirth", label: "Born in", type: "text" },
    ]},
    { id: "occupation", title: "Occupation", fields: [
      { id: "occupation", label: "Occupation", type: "text" },
    ]},
    { id: "education", title: "Education", fields: [
      { id: "eduLine1", label: "Line 1", type: "text" },
      { id: "eduLine2", label: "Line 2", type: "text" },
      { id: "eduLine3", label: "Line 3", type: "text" },
    ]},
    { id: "family", title: "Family", fields: [
      { id: "father", label: "Father", type: "text" },
      { id: "mother", label: "Mother", type: "text" },
      { id: "sibling", label: "Sibling", type: "text" },
      { id: "grandparents", label: "Grandparents", type: "text" },
      { id: "mosal", label: "Mosal", type: "text" },
    ]},
    { id: "interests", title: "Interests", fields: [
      { id: "interests", label: "Interests", type: "text" },
    ]},
    { id: "address", title: "Address", fields: [
      { id: "address", label: "Address", type: "text" },
    ]},
  ],
};

export function emptyFormData() {
  const data = { photo: null };
  schema.sections.forEach((section) => {
    section.fields.forEach((f) => { data[f.id] = ""; });
  });
  return data;
}