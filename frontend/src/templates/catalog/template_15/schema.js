// schema.js — template_15 (Noor Mahal Beliefs)
// Independent of every other template. Second narrative-style template
// (after template_10) but Muslim-specific, with a Beliefs section carrying
// fields no other template has — Namaz frequency, Hijab-after-marriage
// decision, and Caste preference — matching the modern matrimonial-site
// biodata format seen in the reference images.

export const schema = {
  id: "template_15",
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
        { id: "placeOfBirth", label: "Place of Birth", type: "text" },
        { id: "height", label: "Height", type: "text" },
        { id: "motherTongue", label: "Mother Tongue", type: "text" },
        { id: "contact", label: "Contact", type: "text", required: true },
      ],
    },
    {
      id: "overview",
      title: "Overview",
      fields: [
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
        { id: "sect", label: "Sect", type: "text" },
        { id: "namaz", label: "Namaz", type: "text" },
        { id: "hijabDecision", label: "Hijab after Marriage", type: "text" },
        { id: "castePreference", label: "Caste Preference", type: "text" },
      ],
    },
    {
      id: "expectations",
      title: "Expectations",
      fields: [
        { id: "expectations", label: "Expectations", type: "textarea" },
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