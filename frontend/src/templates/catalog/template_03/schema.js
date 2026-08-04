// schema.js — template_03 (Royal Maroon)
// Independent of template_01/template_02. Reference image put Gotra/Caste
// and Income directly in Personal Details (not a separate astrological
// section), and kept a lean Family Details + separate Contact Details —
// matched here field-for-field.

export const schema = {
  id: "template_03",
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
        { id: "timeOfBirth", label: "Time Of Birth", type: "text", placeholder: "e.g. 10:10 AM" },
        { id: "placeOfBirth", label: "Place Of Birth", type: "text" },
        { id: "complexion", label: "Complexion", type: "text" },
        { id: "height", label: "Height", type: "text", placeholder: "e.g. 5ft 11'" },
        { id: "gotraCaste", label: "Gotra/Caste", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
        { id: "income", label: "Income", type: "text" },
        { id: "education", label: "Education", type: "text" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "fatherOccupation", label: "Father's Occupation", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "contactPerson", label: "Contact Person", type: "text" },
        { id: "contactNumber", label: "Contact Number", type: "text" },
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
