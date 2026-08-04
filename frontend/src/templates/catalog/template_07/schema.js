// schema.js — template_07 (Sacred Minimal)
// Independent of every other template. Reference is deliberately spare —
// black & white, no religious-details section at all (unlike template_08),
// and includes a "Work" field distinct from Occupation.

export const schema = {
  id: "template_07",
  photo: {
    id: "photo",
    label: "Photo",
    shape: "rect",
    required: true,
  },
  sections: [
    {
      id: "personal",
      title: "Personal Details",
      fields: [
        { id: "name", label: "Name", type: "text", required: true },
        { id: "dob", label: "Date Of Birth", type: "date", required: true },
        { id: "timeOfBirth", label: "Time Of Birth", type: "text" },
        { id: "placeOfBirth", label: "Place Of Birth", type: "text" },
        { id: "complexion", label: "Complexion", type: "text" },
        { id: "height", label: "Height", type: "text" },
        { id: "hobbies", label: "Hobbies", type: "text" },
        { id: "education", label: "Education", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
        { id: "work", label: "Work", type: "text", placeholder: "e.g. Company / Firm name & city" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "fatherOccupation", label: "Father's Occupation", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
        { id: "motherOccupation", label: "Mother's Occupation", type: "text" },
        { id: "brothers", label: "Brother(s)", type: "text" },
        { id: "sisters", label: "Sister(s)", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "contactPerson", label: "Contact Person", type: "text" },
        { id: "contactNumber", label: "Contact Number", type: "text", required: true },
        { id: "residentialAddress", label: "Residential Address", type: "text" },
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