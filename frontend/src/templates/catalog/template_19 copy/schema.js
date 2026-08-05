// schema.js — template_19 (Charcoal Portfolio Grid)
export const schema = {
  id: "template_19",
  photo: { id: "photo", label: "Photo", shape: "rect", required: true },
  sections: [
    { id: "profile", title: "Profile", fields: [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "tagline", label: "Tagline (e.g. profession)", type: "text" },
    ]},
    { id: "about", title: "About Me", fields: [
      { id: "aboutMe", label: "About Me", type: "textarea" },
    ]},
    { id: "timeline", title: "Education & Career", fields: [
      { id: "timelineItem1", label: "Entry 1", type: "text", placeholder: "e.g. Senior Analyst — Company, 2023–Present" },
      { id: "timelineItem2", label: "Entry 2", type: "text" },
      { id: "timelineItem3", label: "Entry 3", type: "text" },
      { id: "timelineItem4", label: "Entry 4", type: "text" },
    ]},
    { id: "personal", title: "Personal Details", fields: [
      { id: "dob", label: "Date of Birth", type: "date", required: true },
      { id: "height", label: "Height", type: "text" },
      { id: "religion", label: "Religion", type: "text" },
      { id: "maritalStatus", label: "Marital Status", type: "text" },
    ]},
    { id: "family", title: "Family", fields: [
      { id: "fatherName", label: "Father", type: "text" },
      { id: "motherName", label: "Mother", type: "text" },
      { id: "siblings", label: "Siblings", type: "text" },
    ]},
    { id: "contact", title: "Contact", fields: [
      { id: "email", label: "Email", type: "text" },
      { id: "phone", label: "Phone", type: "text", required: true },
      { id: "location", label: "Location", type: "text" },
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