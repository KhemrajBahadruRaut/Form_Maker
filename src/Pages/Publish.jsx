import React, { useEffect, useState } from "react";
import Nav from "../TopNav/Nav";
import { FiCopy, FiCheck, FiExternalLink, FiSend } from "react-icons/fi";

const Publish = () => {
  const [formNumber, setFormNumber] = useState("");
  const [formLink, setFormLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let storedFormNumber = localStorage.getItem("formNumber");

    if (!storedFormNumber || storedFormNumber === "null") {
      storedFormNumber = Date.now().toString();
      localStorage.setItem("formNumber", storedFormNumber);
    }

    setFormNumber(storedFormNumber);
  }, []);

  const formFields = JSON.parse(localStorage.getItem("formFields") || "[]");
  const isFormEmpty = !formFields || formFields.length === 0;

  const publishForm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = JSON.parse(localStorage.getItem("formFields") || "[]");

      const submitSettings = JSON.parse(
        localStorage.getItem("submitSettings") ||
          JSON.stringify({
            label: "Submit",
            align: "center",
            bgColor: "#2563eb",
            textColor: "#ffffff",
            fontSize: "text-base",
          }),
      );

      const formToSave = {
        formNumber,
        title: localStorage.getItem("formTitle") || "Untitled Form",
        description: localStorage.getItem("formDesc") || "",
        fields: formData.map((field) => ({
          ...field,
          value: field.value || "",
        })),
        submitSettings,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        "https://jotform.gr8.com.np/GR8_JOTFORM/Backend/save_form.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formToSave),
        },
      );

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned invalid JSON: ${text}`);
      }

      if (!response.ok) {
        throw new Error(
          result?.details || result?.message || "Failed to save form",
        );
      }

      const finalFormNumber = result?.formNumber || formNumber;

      if (!finalFormNumber) {
        throw new Error("Form number missing from server response");
      }

      setFormNumber(finalFormNumber);

      setFormLink(
        result?.formLink ||
          `https://form-maker-nine-eta.vercel.app/form/${finalFormNumber}`,
      );

      localStorage.setItem("formNumber", finalFormNumber);
    } catch (err) {
      setError(err.message);
      console.error("Publish error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Publish Your Form
          </h1>

          <div className="space-y-6">
            {/* Publish Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiSend className="text-blue-600" size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Ready to Publish
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Publish your form and get a shareable link.
                    </p>
                  </div>
                </div>

                <button
                  onClick={publishForm}
                  disabled={isLoading || isFormEmpty}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Publish Form
                    </>
                  )}
                </button>

                {isFormEmpty && (
                  <p className="mt-3 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01"
                      />
                    </svg>
                    Please add at least one field to your form before
                    publishing.
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-red-700">
                      Publication failed
                    </p>
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Make sure your PHP server is running and CORS headers are
                      set.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success */}
            {formLink && (
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <FiCheck className="text-emerald-600" size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-emerald-800">
                        Published Successfully!
                      </h2>
                      <p className="text-emerald-600 text-sm">
                        Your form is live and ready to collect responses.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                        copied
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <a
                    href={formLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <FiExternalLink size={14} />
                    Open form in new tab
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Publish;
