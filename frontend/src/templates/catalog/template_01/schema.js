// schema.js — template_01 (Classic Ivory)
// Defines exactly the fields this template needs, nothing shared with other templates.

export const schema = {
  id: "template_01",
  photo: {
    id: "photo",
    label: "Photo",
    shape: "circle",
    required: true,
  },
  sections: [
    {
      id: "personal",
      title: "Personal Details",
      fields: [
        { id: "name", label: "Name", type: "text", required: true },
        { id: "dob", label: "Date Of Birth", type: "date", required: true },
        { id: "village", label: "Village", type: "text" },
        { id: "weight", label: "Weight", type: "text", placeholder: "e.g. 67 Kg" },
        { id: "height", label: "Height", type: "text", placeholder: "e.g. 5 ft. 7 in." },
        { id: "education", label: "Education", type: "text", required: true },
        { id: "profession", label: "Profession", type: "text" },
        { id: "salary", label: "Salary", type: "text", placeholder: "e.g. 3.7 LPA" },
        { id: "hobby", label: "Hobby", type: "text" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "fatherOccupation", label: "Occupation", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
        { id: "motherOccupation", label: "Occupation", type: "text" },
        { id: "siblings", label: "Siblings", type: "text", placeholder: "e.g. 1 Sister / 1 Brother" },
      ],
    },
  ],
};

export function emptyFormData() {
  const data = { photo: null };
  schema.sections.forEach((section) => {
    section.fields.forEach((f) => {
      data[f.id] = "";
    });
  });
  return data;
}