// schema.js — template_28 (Royal Amethyst Ganesh Invocation)
// Same field set/shape as the other Ganesh-invocation templates
// (template_25/26/27), on a deep amethyst-purple + gold palette instead of
// the golden-parchment one — independent of every other template.
export const schema = {
  id: "template_28",
  photos: [
    { id: "photo", label: "Photo", shape: "rect", required: true },
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
            { id: "name", label: "Name", type: "text", required: true },
            { id: "dob", label: "Date of Birth", type: "date", required: true },
            { id: "tob", label: "Time of Birth", type: "text", placeholder: "e.g. 06:45 AM" },
            { id: "pob", label: "Place of Birth", type: "text" },
            { id: "complexion", label: "Complexion", type: "text" },
            { id: "height", label: "Height", type: "text", placeholder: "e.g. 5 ft. 6 in." },
            { id: "gotraCaste", label: "Gotra/Caste", type: "text" },
            { id: "occupation", label: "Occupation", type: "text" },
            { id: "income", label: "Income", type: "text", placeholder: "e.g. 6 LPA" },
            { id: "education", label: "Education", type: "text" },
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
          ],
        },
        {
          id: "contact",
          title: "Contact Details",
          removable: true,
          custom: false,
          fields: [
            { id: "contactPerson", label: "Contact Person", type: "text" },
            { id: "contactNumber", label: "Contact Number", type: "text" },
            { id: "address", label: "Residential Address", type: "textarea" },
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
