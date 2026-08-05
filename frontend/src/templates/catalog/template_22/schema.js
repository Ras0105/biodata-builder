// schema.js — template_22 (Floral Botanical Sidebar)
export const schema = {
  id: "template_22",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
    ]},
    { id: "personal", title: "Personal Details", fields: [
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "placeOfBirth", label: "Place of Birth", type: "text" },
      { id: "birthTime", label: "Birth Time", type: "text" },
      { id: "height", label: "Height", type: "text" },
      { id: "complexion", label: "Complexion", type: "text" },
      { id: "hobbies", label: "Hobbies", type: "text" },
      { id: "caste", label: "Caste", type: "text" },
    ]},
    { id: "family", title: "Family Details", fields: [
      { id: "father", label: "Father", type: "text" },
      { id: "mother", label: "Mother", type: "text" },
      { id: "siblings", label: "Siblings", type: "text" },
      { id: "grandfather", label: "Grandfather", type: "text" },
      { id: "grandmother", label: "Grandmother", type: "text" },
      { id: "mosal", label: "Mosal", type: "text" },
    ]},
    { id: "qualification", title: "Qualification", fields: [
      { id: "qualification", label: "Qualification", type: "text" },
      { id: "profession", label: "Current Profession", type: "text" },
    ]},
    { id: "contact", title: "Contact", fields: [
      { id: "residentialAddress", label: "Residential Address", type: "text" },
      { id: "contactPrimary", label: "Contact", type: "text", required: true },
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