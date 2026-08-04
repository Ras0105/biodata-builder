// schema.js — template_09 (Sikh Sacred Gold)
// Independent of every other template. First Sikh-community template in the
// catalog. Includes Turban/Appearance note field distinct from Complexion,
// and a combined Siblings field (matches how Sikh biodata references list
// brothers/sisters together rather than as separate counts).

export const schema = {
  id: "template_09",
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
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "dob", label: "Date of Birth", type: "date", required: true },
        { id: "timeOfBirth", label: "Time of Birth", type: "text" },
        { id: "placeOfBirth", label: "Place of Birth", type: "text" },
        { id: "complexion", label: "Complexion", type: "text" },
        { id: "height", label: "Height", type: "text" },
        { id: "bloodGroup", label: "Blood Group", type: "text" },
        { id: "hobbies", label: "Hobbies", type: "text" },
        { id: "education", label: "Education", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
        { id: "work", label: "Work", type: "text", placeholder: "e.g. Company & city" },
        { id: "income", label: "Annual Income", type: "text" },
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
        { id: "siblings", label: "Siblings", type: "text", placeholder: "e.g. 1 Brother, 2 Sisters" },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "phoneNumber", label: "Phone Number", type: "text", required: true },
        { id: "email", label: "Email", type: "text" },
        { id: "address", label: "Address", type: "text" },
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