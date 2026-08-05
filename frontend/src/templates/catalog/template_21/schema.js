// schema.js — template_21 (Vintage Parchment Scroll)
export const schema = {
  id: "template_21",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "invocation", label: "Invocation line (optional)", type: "text", placeholder: "e.g. || Shree Ganeshaya Namah ||" },
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "dobDisplay", label: "Date of Birth (display)", type: "text", placeholder: "e.g. 15th December 1995" },
    ]},
    { id: "personal", title: "Personal Details", fields: [
      { id: "birthDetails", label: "Birth Time & Place", type: "text" },
      { id: "heightWeight", label: "Height & Weight", type: "text" },
      { id: "diet", label: "Diet", type: "text" },
      { id: "religion", label: "Religion", type: "text" },
      { id: "nativePlace", label: "Native Place", type: "text" },
      { id: "hobbies", label: "Hobbies", type: "text" },
    ]},
    { id: "qualification", title: "Qualification and Profession", fields: [
      { id: "occupation", label: "Occupation", type: "text" },
      { id: "qualification", label: "Qualification", type: "text" },
    ]},
    { id: "family", title: "Family Details", fields: [
      { id: "father", label: "Father", type: "text" },
      { id: "mother", label: "Mother", type: "text" },
      { id: "sibling", label: "Sibling", type: "text" },
      { id: "mosal", label: "Mosal", type: "text" },
    ]},
    { id: "address", title: "Address Details", fields: [
      { id: "residence1", label: "Residence 1", type: "text" },
      { id: "residence2", label: "Residence 2", type: "text" },
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