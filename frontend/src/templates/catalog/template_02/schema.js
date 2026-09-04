// schema.js — template_02 (Vedic Sage)
// Independent of template_01. Fields chosen to match the Sanskrit/Vedic
// reference: astrological details get their own section (Gotra), family
// section includes residence + phone since the reference merges contact
// details into it rather than a separate Contact section.
export const schema = {
  id: "template_02",
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
            { id: "name", label: "Name", type: "text", required: true, icon: "person" },
            { id: "dob", label: "Date of Birth", type: "date", required: true, icon: "calendar" },
            { id: "height", label: "Height", type: "text", placeholder: "e.g. 5 Feet 9 Inches", icon: "height" },
            { id: "education", label: "Education", type: "text", icon: "education" },
            { id: "occupation", label: "Occupation", type: "text", icon: "briefcase" },
          ],
        },
        {
          id: "astro",
          title: "Astrological Details",
          removable: true,
          custom: false,
          fields: [
            { id: "gotra", label: "Gotra", type: "text", icon: "gotra" },
          ],
        },
        {
          id: "family",
          title: "Family Details",
          removable: true,
          custom: false,
          fields: [
            { id: "fatherName", label: "Father's Name", type: "text", icon: "person" },
            { id: "motherName", label: "Mother's Name", type: "text", icon: "person" },
            { id: "siblings", label: "Siblings", type: "text", placeholder: "e.g. One Younger Sister (Unmarried)", icon: "people" },
            { id: "residence", label: "Residence", type: "text", placeholder: "e.g. Varanasi, Uttar Pradesh, India", icon: "home" },
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
