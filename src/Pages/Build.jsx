import React, { useState, useEffect } from "react";
import SideBar from "../Build_sub/SideBar";
import FormBuilder from "../Build_sub/FormBuilder";
import Nav from "../TopNav/Nav";
import { useParams } from "react-router-dom";

const defaultSettings = {
  fontSize: "text-base",
  align: "left",
  color: "#000000",
};

const Build = () => {
  const { formNumber } = useParams();
  const [fields, setFields] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitSettings, setSubmitSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load form data
  useEffect(() => {
    const loadFormData = async () => {
      setIsLoading(true);

      if (formNumber) {
        // Check if localStorage already has data for this formNumber (e.g. user navigated away and back)
        const storedFormNumber = localStorage.getItem("formNumber");
        const savedFields = JSON.parse(
          localStorage.getItem("formFields") || "null",
        );

        if (
          storedFormNumber === formNumber &&
          savedFields &&
          savedFields.length > 0
        ) {
          // Prefer localStorage data — user was editing this form in this session
          setFields(savedFields);
          setTitle(localStorage.getItem("formTitle") || "");
          setDescription(localStorage.getItem("formDesc") || "");
          setSubmitSettings(
            JSON.parse(localStorage.getItem("submitSettings") || "{}"),
          );
          setIsLoading(false);
          return;
        }

        // First time opening this form — fetch from DB
        try {
          const response = await fetch(
            `https://jotform.gr8.com.np/GR8_JOTFORM/Backend/form_view/get_form_by_number.php?formNumber=${formNumber}`,
            { credentials: 'include' }
          );
          const result = await response.json();

          if (result.success && result.form) {
            const formData = result.form;

            const normalizedFields =
              formData.fields?.map((field) => ({
                ...field,
                id: field.id?.toString().startsWith("field-")
                  ? field.id
                  : `field-${field.id}`,
                settings: field.settings || defaultSettings,
                options: field.options || undefined,
                question: field.question || undefined,
              })) || [];

            setFields(normalizedFields);
            setTitle(formData.title || "");
            setDescription(formData.description || "");
            setSubmitSettings(formData.submitSettings || {});

            localStorage.setItem(
              "formFields",
              JSON.stringify(normalizedFields),
            );
            localStorage.setItem("formTitle", formData.title || "");
            localStorage.setItem("formDesc", formData.description || "");
            localStorage.setItem(
              "submitSettings",
              JSON.stringify(formData.submitSettings || {}),
            );
            localStorage.setItem("formNumber", formNumber);
          } else {
            setFields([]);
            setTitle("");
            setDescription("");
            setSubmitSettings({});
            localStorage.setItem("formNumber", formNumber);
          }
        } catch (error) {
          console.error("Error loading form:", error);
          setFields([]);
          setTitle("");
          setDescription("");
          setSubmitSettings({});
        } finally {
          setIsLoading(false);
        }
      } else {
        setFields([]);
        setTitle("");
        setDescription("");
        setSubmitSettings({});
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [formNumber]);

  // Save fields to localStorage whenever they change (including removals)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("formFields", JSON.stringify(fields));
    }
  }, [fields, isLoading]);

  // Add new field
  const addField = (type) => {
    const id = `${Date.now()}-${Math.random()}`;

    const baseField = {
      id,
      type,
      value: "",
      settings: { ...defaultSettings },
    };

    if (type === "MCQ" || type === "MultipleAnswers") {
      baseField.options = [
        { value: "", correct: false },
        { value: "", correct: false },
      ];
    }

    if (type === "ImageChoice") {
      baseField.options = [{ label: "", imageUrl: "", isCorrect: true }];
      baseField.question = "";
    }

    if (type === "Image") {
      baseField.image = null;
    }

    setFields((prev) => [...prev, baseField]);
  };

  // Remove a field
  const removeField = (id) =>
    setFields((prev) => prev.filter((f) => f.id !== id));

  // Update a field
  const updateField = (id, updatedData) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === id) {
          // Keep actual image URL but also add hasImage flag
          const newSettings = {
            ...updatedData.settings,
            hasImage: !!updatedData.settings?.image,
          };
          return { ...field, ...updatedData, settings: newSettings };
        }
        return field;
      }),
    );
  };

  // Add/remove options
  const addOption = (id) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === id) {
          const newOption =
            field.type === "ImageChoice"
              ? { label: "", imageUrl: "", isCorrect: false }
              : { value: "", correct: false };
          return { ...field, options: [...(field.options || []), newOption] };
        }
        return field;
      }),
    );
  };

  const removeOption = (id, index) => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id === id && Array.isArray(field.options)) {
          const updatedOptions = [...field.options];
          updatedOptions.splice(index, 1);
          return { ...field, options: updatedOptions };
        }
        return field;
      }),
    );
  };

  // Reorder fields
  const reorderFields = (newFields) => setFields(newFields);

  // Clear all fields
  const clearAllFields = () => {
    if (window.confirm("Clear all fields?")) {
      setFields([]);
      localStorage.removeItem("formFields");
    }
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading form...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0 w-full lg:w-64">
              <SideBar onAddField={addField} />
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <FormBuilder
                  fields={fields}
                  setFields={setFields}
                  onRemoveField={removeField}
                  onUpdateField={updateField}
                  onAddOption={addOption}
                  onRemoveOption={removeOption}
                  onClearFields={clearAllFields}
                  onReorderFields={reorderFields}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Build;
