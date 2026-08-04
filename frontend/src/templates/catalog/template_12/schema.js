// schema.js — template_12 (Extended Family Tree)
// Independent of every other template. Built for the dense, multi-generation
// family section common in Gujarati/Vaishnav biodata references — includes
// Paternal Uncle/Aunt and separate Paternal/Maternal Grandparents fields,
// which no other template in this catalog carries. Two-column layout:
// birth/education details on the left, family tree on the right.

export const schema = {
  id: "template_12",
  photo: {
    id: "photo",
    label: "Photo",
    shape: "rect",
    required: true,
  },
  sections: [
    {
      id: "birth",
      title: "Birth Details",
      fields: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "dob", label: "DOB", type: "date", required: true },
        { id: "placeOfBirth", label: "Place", type: "text" },
        { id: "timeOfBirth", label: "Time", type: "text" },
        { id: "height", label: "Height", type: "text" },
        { id: "religion", label: "Religion", type: "text" },
        { id: "caste", label: "Caste", type: "text" },
        { id: "gotra", label: "Gotra", type: "text" },
        { id: "nativePlace", label: "Native Place", type: "text" },
      ],
    },
    {
      id: "education",
      title: "Education & Profession",
      fields: [
        { id: "education", label: "Education", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "fatherName", label: "Father", type: "text" },
        { id: "fatherPhone", label: "Father's Contact", type: "text" },
        { id: "motherName", label: "Mother", type: "text" },
        { id: "motherPhone", label: "Mother's Contact", type: "text" },
        { id: "sibling", label: "Sibling", type: "text" },
        { id: "siblingInLaw", label: "Sibling-in-law", type: "text" },
        { id: "paternalUncle", label: "Paternal Uncle", type: "text" },
        { id: "paternalAunt", label: "Paternal Aunt", type: "text" },
        { id: "paternalGrandparents", label: "Paternal Grandparents", type: "text" },
        { id: "maternalGrandparents", label: "Maternal Grandparents", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "Address",
      fields: [
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