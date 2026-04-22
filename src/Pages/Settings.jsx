import React, { useState, useEffect } from "react";
import Nav from "../TopNav/Nav";
import FormPreview from "../Settings_sub/FormPreview";
import FormTitleSettings from "../Settings_sub/FormTitleSettings";
import SubmitSettings from "../Settings_sub/SubmitSettings";
import FormDesc from "../Settings_sub/FormDesc";
import { useParams } from "react-router-dom";

const Settings = () => {
  const { formNumber } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [submitSettings, setSubmitSettings] = useState({
    label: "Submit",
    align: "center",
    bgColor: "#2563eb",
    textColor: "#ffffff",
    fontSize: "text-base",
  });

  useEffect(() => {
    // Always read latest localStorage (Build keeps it up to date)
    const savedFields = JSON.parse(localStorage.getItem("formFields") || "[]");
    const savedTitle = localStorage.getItem("formTitle") || "";
    const savedDesc = localStorage.getItem("formDesc") || "";
    const savedSubmitSettings = localStorage.getItem("submitSettings");

    setFormFields(savedFields);
    setFormTitle(savedTitle);
    setFormDesc(savedDesc);
    if (savedSubmitSettings) {
      setSubmitSettings(JSON.parse(savedSubmitSettings));
    }

    // If no fields in localStorage and we have a formNumber, fetch from backend
    if (savedFields.length === 0 && formNumber) {
      // fetch(`http://localhost/GR8_jotform/Backend/form_view/get_form_by_number.php?formNumber=${formNumber}`)
      fetch(
        `https://jotform.gr8.com.np/GR8_JOTFORM/Backend/form_view/get_form_by_number.php?formNumber=${formNumber}`,
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.form) {
            const fields = result.form.fields || [];
            setFormFields(fields);
            setFormTitle(result.form.title || "");
            setFormDesc(result.form.description || "");
            setSubmitSettings(
              result.form.submitSettings || {
                label: "Submit",
                align: "center",
                bgColor: "#2563eb",
                textColor: "#ffffff",
                fontSize: "text-base",
              },
            );
            // Populate localStorage for consistency
            localStorage.setItem("formFields", JSON.stringify(fields));
            localStorage.setItem("formTitle", result.form.title || "");
            localStorage.setItem("formDesc", result.form.description || "");
            localStorage.setItem(
              "submitSettings",
              JSON.stringify(result.form.submitSettings || {}),
            );
          }
        });
    }
  }, [formNumber]);

  useEffect(() => {
    localStorage.setItem("submitSettings", JSON.stringify(submitSettings));
  }, [submitSettings]);

  useEffect(() => {
    localStorage.setItem("formTitle", formTitle);
  }, [formTitle]);

  useEffect(() => {
    localStorage.setItem("formDesc", formDesc);
  }, [formDesc]);

  useEffect(() => {
    if (formNumber) {
      localStorage.setItem("formNumber", formNumber);
    }
  }, [formNumber]);

  return (
    <>
      <Nav />
      <div className="flex flex-col md:flex-row p-6 gap-6">
        <div className="flex-grow">
          <FormPreview
            formFields={formFields}
            formTitle={formTitle}
            formDesc={formDesc}
            submitSettings={submitSettings}
          />
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4 bg-white p-4 rounded-lg shadow border border-gray-100">
          <FormTitleSettings title={formTitle} setTitle={setFormTitle} />
          <FormDesc formDesc={formDesc} setFormDesc={setFormDesc} />
          <SubmitSettings
            submitSettings={submitSettings}
            onChange={setSubmitSettings}
          />
        </div>
      </div>
    </>
  );
};
export default Settings;
