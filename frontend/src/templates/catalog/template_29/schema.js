// schema.js — template_29 (Emerald Bismillah Arch)
export const schema = {
  id: "template_29",
  photos: [
    { id: "photo", label: "Photo", shape: "circle", required: true },
  ],
  pages: [
    {
      id: "page1",
      sections: [
        {
          id: "personal",
          title: "Personal Details",
          removable: false,
          custom: false,
          fields: [
            { id: "fullName", label: "Name", type: "text", required: true },
            { id: "dob", label: "Date of Birth", type: "date", required: true },
            { id: "timeOfBirth", label: "Time of Birth", type: "text", placeholder: "e.g. 06:45 AM" },
            { id: "placeOfBirth", label: "Place of Birth", type: "text" },
            { id: "complexion", label: "Complexion", type: "text" },
            { id: "height", label: "Height", type: "text", placeholder: "e.g. 5 ft. 6 in." },
            { id: "weight", label: "Weight", type: "text" },
            { id: "bloodGroup", label: "Blood Group", type: "text" },
            { id: "nationality", label: "Nationality", type: "text" },
            { id: "maritalStatus", label: "Marital Status", type: "text" },
          ],
        },
        {
          id: "religious",
          title: "Religious Details",
          removable: true,
          custom: false,
          fields: [
            { id: "religion", label: "Religion", type: "text" },
            { id: "sect", label: "Sect", type: "text", placeholder: "e.g. Sunni" },
            { id: "maslak", label: "Maslak", type: "text", placeholder: "e.g. Hanafi" },
            { id: "hafizQuran", label: "Hafiz e Quran", type: "text" },
            { id: "namaz", label: "Namaz", type: "text" },
            { id: "roza", label: "Roza", type: "text" },
            { id: "zakat", label: "Zakat", type: "text" },
            { id: "religiousOther", label: "Any Other", type: "text" },
          ],
        },
        {
          id: "family",
          title: "Family Details",
          removable: true,
          custom: false,
          fields: [
            { id: "fatherName", label: "Father's Name", type: "text" },
            { id: "fatherOccupation", label: "Father's Occupation", type: "text" },
            { id: "motherName", label: "Mother's Name", type: "text" },
            { id: "motherOccupation", label: "Mother's Occupation", type: "text" },
            { id: "brothers", label: "Brothers", type: "text" },
            { id: "sisters", label: "Sisters", type: "text" },
            { id: "familyType", label: "Family Type", type: "text" },
          ],
        },
        {
          id: "education",
          title: "Education & Career",
          removable: true,
          custom: false,
          fields: [
            { id: "education", label: "Education", type: "text" },
            { id: "highestQualification", label: "Qualification", type: "text" },
            { id: "occupation", label: "Occupation", type: "text" },
            { id: "organization", label: "Organization", type: "text" },
            { id: "designation", label: "Designation", type: "text" },
            { id: "annualIncome", label: "Income", type: "text", placeholder: "e.g. 6 LPA" },
            { id: "workLocation", label: "Work Location", type: "text" },
          ],
        },
        {
          id: "contact",
          title: "Contact Details",
          removable: true,
          custom: false,
          fields: [
            { id: "phone", label: "Phone", type: "text" },
            { id: "whatsapp", label: "WhatsApp", type: "text" },
            { id: "email", label: "Email", type: "text" },
          ],
        },
      ],
    },
  ],
};

// --- temporary back-compat shim for layout.js (removed once layout.js is
// migrated to the generic pages-aware renderer) ---
Object.defineProperty(schema, "sections", {
  get() { return schema.pages.flatMap((p) => p.sections); },
  enumerable: false,
});
Object.defineProperty(schema, "photo", {
  get() { return schema.photos[0]; },
  enumerable: false,
});