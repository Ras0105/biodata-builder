// schema.js — template_18 (Ivory Editorial Bride)
export const schema = {
  id: "template_18",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "caption", label: "Caption (short italic line)", type: "textarea", placeholder: "A short personal line, e.g. a favourite quote or motto." },
    ]},
    { id: "personal", title: "Personal Details", fields: [
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "placeOfBirth", label: "Place of Birth", type: "text" },
      { id: "height", label: "Height", type: "text" },
      { id: "religion", label: "Religion", type: "text" },
      { id: "caste", label: "Caste / Community", type: "text" },
      { id: "education", label: "Education", type: "text" },
      { id: "occupation", label: "Occupation", type: "text" },
    ]},
    { id: "family", title: "Family Details", fields: [
      { id: "fatherName", label: "Father's Name", type: "text" },
      { id: "motherName", label: "Mother's Name", type: "text" },
      { id: "siblings", label: "Siblings", type: "text" },
    ]},
    { id: "contact", title: "Contact", fields: [
      { id: "phone", label: "Phone", type: "text", required: true },
      { id: "email", label: "Email", type: "text" },
      { id: "residence", label: "Residence", type: "text" },
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