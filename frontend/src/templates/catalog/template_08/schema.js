// schema.js — template_08 (Sky Blue Faith)
// Independent of every other template. Reference has by far the most
// detailed religious section of any template so far (Church, Denomination,
// Diocese, Parish, Confirmation, Community, Sacraments, Baptism Date) —
// kept in full since sacramental record detail is often expected in
// Catholic/Christian biodata specifically.

export const schema = {
  id: "template_08",
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
      title: "Religious Details",
      fields: [
        { id: "religion", label: "Religion", type: "text", placeholder: "Christian" },
        { id: "church", label: "Church", type: "text" },
        { id: "denomination", label: "Denomination", type: "text" },
        { id: "diocese", label: "Diocese", type: "text" },
        { id: "parish", label: "Parish", type: "text" },
        { id: "confirmation", label: "Confirmation", type: "text" },
        { id: "community", label: "Community", type: "text" },
        { id: "sacraments", label: "Sacraments", type: "text" },
        { id: "baptismDate", label: "Baptism Date", type: "date" },
      ],
    },
    {
      id: "family",
      title: "Family Details",
      fields: [
        { id: "familyType", label: "Family Type", type: "text" },
        { id: "motherName", label: "Mother's Name", type: "text" },
        { id: "fatherName", label: "Father's Name", type: "text" },
        { id: "motherOccupation", label: "Mother's Occupation", type: "text" },
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