// schema.js — template_06 (Blossom Pink)
// Independent of every other template. Reference includes a "Birth Name"
// field (distinct from legal Full Name) that no other Muslim template here
// has, and omits Marital Status/Gender that template_04 includes.

export const schema = {
  id: "template_06",
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
        { id: "birthName", label: "Birth Name", type: "text" },
        { id: "motherTongue", label: "Mother Tongue", type: "text" },
        { id: "height", label: "Height", type: "text" },
        { id: "complexion", label: "Complexion", type: "text" },
        { id: "bloodGroup", label: "Blood Group", type: "text" },
        { id: "diet", label: "Diet", type: "text" },
        { id: "annualIncome", label: "Annual Income", type: "text" },
        { id: "hobbies", label: "Hobbies", type: "text" },
        { id: "education", label: "Education", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
      ],
    },
    {
      id: "religious",
      title: "Muslim Religious Details",
      fields: [
        { id: "sect", label: "Sect", type: "text", placeholder: "e.g. Sunni" },
        { id: "maslak", label: "Maslak / Madhab", type: "text", placeholder: "e.g. Hanafi" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
        { id: "familyType", label: "Family Type", type: "text" },
        { id: "fatherOccupation", label: "Father's Occupation", type: "text" },
        { id: "nativePlace", label: "Native Place", type: "text" },
        { id: "brothers", label: "Brothers", type: "text" },
        { id: "sisters", label: "Sisters", type: "text" },
      ],
    },
    {
      id: "contact",
      title: "Contact Details",
      fields: [
        { id: "mobileNumber", label: "Mobile Number", type: "text", required: true },
        { id: "email", label: "Email Address", type: "text" },
        { id: "currentAddress", label: "Current Address", type: "text" },
        { id: "permanentAddress", label: "Permanent Address", type: "text" },
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