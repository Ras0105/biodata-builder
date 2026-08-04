// schema.js — template_10 (Modern Narrative)
// Independent of every other template. Structurally different from every
// other template in the catalog: instead of one long list of label:value
// rows, this one is built around short card sections plus two free-text
// narrative fields (About Myself, Expectations) — matching the
// "personality-led" biodata style seen in modern matrimonial sites, as
// opposed to the pure-facts style of templates 01-09.

export const schema = {
  id: "template_10",
  photo: {
    id: "photo",
    label: "Photo",
    shape: "circle",
    required: true,
  },
  sections: [
    {
      id: "profile",
      title: "Profile",
      fields: [
        { id: "fullName", label: "Full Name", type: "text", required: true },
        { id: "dob", label: "Date of Birth", type: "date", required: true },
        { id: "location", label: "Location", type: "text" },
        { id: "motherTongue", label: "Mother Tongue", type: "text" },
        { id: "email", label: "Email", type: "text" },
        { id: "phone", label: "Phone", type: "text", required: true },
      ],
    },
    {
      id: "overview",
      title: "Overview",
      fields: [
        { id: "religion", label: "Religion", type: "text" },
        { id: "occupation", label: "Occupation", type: "text" },
        { id: "education", label: "Education", type: "text" },
        { id: "diet", label: "Diet", type: "text" },
        { id: "hobbies", label: "Hobbies", type: "text" },
      ],
    },
    {
      id: "aboutMe",
      title: "About Myself",
      fields: [
        { id: "aboutMe", label: "About Myself", type: "textarea" },
      ],
    },
    {
      id: "expectations",
      title: "Expectations",
      fields: [
        { id: "expectations", label: "Expectations", type: "textarea" },
      ],
    },
    {
      id: "family",
      title: "Family",
      fields: [
        { id: "fatherName", label: "Father", type: "text" },
        { id: "motherName", label: "Mother", type: "text" },
        { id: "siblings", label: "Siblings", type: "text" },
      ],
    },
    {
      id: "beliefs",
      title: "Beliefs",
      fields: [
        { id: "gotra", label: "Gotra", type: "text" },
        { id: "rashi", label: "Rashi", type: "text" },
        { id: "mangalik", label: "Mangalik", type: "text" },
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