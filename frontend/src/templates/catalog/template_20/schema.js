// schema.js — template_20 (Slate Traditional Detailed)
export const schema = {
  id: "template_20",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "intro", label: "Short Intro", type: "textarea", placeholder: "A short 2-3 line introduction about yourself." },
    ]},
    { id: "contact", title: "Contact", fields: [
      { id: "email", label: "Email", type: "text" },
      { id: "phone", label: "Phone", type: "text", required: true },
      { id: "residence", label: "Residence Address", type: "text" },
      { id: "officeAddress", label: "Office / Other Address", type: "text" },
    ]},
    { id: "personal", title: "Personal Details", fields: [
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "birthTime", label: "Time", type: "text" },
      { id: "birthPlace", label: "Birth Place", type: "text" },
      { id: "height", label: "Height", type: "text" },
      { id: "weight", label: "Weight", type: "text" },
      { id: "complexion", label: "Complexion", type: "text" },
      { id: "caste", label: "Caste", type: "text" },
      { id: "profession", label: "Profession", type: "text" },
      { id: "hobbies", label: "Hobbies", type: "text" },
    ]},
    { id: "education", title: "Education", fields: [
      { id: "eduLine1", label: "Qualification 1", type: "text" },
      { id: "eduLine2", label: "Qualification 2", type: "text" },
      { id: "eduLine3", label: "Qualification 3", type: "text" },
    ]},
    { id: "parents", title: "Parents", fields: [
      { id: "fatherName", label: "Father", type: "text" },
      { id: "fatherOccupation", label: "Father's Occupation", type: "text" },
      { id: "fatherPhone", label: "Father's Phone", type: "text" },
      { id: "motherName", label: "Mother", type: "text" },
      { id: "motherOccupation", label: "Mother's Occupation", type: "text" },
      { id: "motherPhone", label: "Mother's Phone", type: "text" },
      { id: "sibling", label: "Sibling(s)", type: "text" },
    ]},
    { id: "mosal", title: "Mosal", fields: [
      { id: "mosalGrandparents", label: "Grandparents", type: "text" },
      { id: "mosalPlace", label: "Place", type: "text" },
      { id: "maternalUncle", label: "Maternal Uncle", type: "text" },
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