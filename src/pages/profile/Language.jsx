import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import API from "../../api/axios";
import TopBar from "../../components/TopBar";

const Language = () => {
  const dispatch = useDispatch();
  const { user, merchant, token } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(user?.language || "English");

  const languages = [
    { code: "English", label: "English", flag: "🇺🇸" },
    { code: "বাংলা", label: "বাংলা", flag: "🇧🇩" },
    { code: "简体中文", label: "简体中文", flag: "🇨🇳" },
    { code: "Indonesia", label: "Indonesia", flag: "🇮🇩" },
    { code: "Tiếng Việt", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "Português", label: "Português", flag: "🇧🇷" },
    { code: "แบบไทย", label: "แบบไทย", flag: "🇹🇭" },
    { code: "हिंदी", label: "हिंदी", flag: "🇮🇳" },
    { code: "Türkçe", label: "Türkçe", flag: "🇹🇷" },
    { code: "عربي", label: "عربي", flag: "🇸🇦" },
    { code: "Italiano", label: "Italiano", flag: "🇮🇹" },
    { code: "Français", label: "Français", flag: "🇫🇷" },
    { code: "Deutsch", label: "Deutsch", flag: "🇩🇪" },
    { code: "Bahasa Melayu", label: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "Español", label: "Español", flag: "🇪🇸" },
  ];

  const saveMutation = useMutation({
    mutationFn: async () => {
      await API.put("/auth/language", { language: selected });
    },
    onSuccess: () => {
      dispatch(
        loginSuccess({
          user: { ...user, language: selected },
          token,
          merchant,
        }),
      );
      toast.success(`Language set to ${selected}`);
    },
    onError: () => {
      toast.error("Failed to update language");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Language" />

      <div
        className="mx-4 mt-4 bg-white rounded-2xl shadow-sm
        overflow-hidden"
      >
        {languages.map((lang, i) => (
          <button
            key={lang.code}
            onClick={() => setSelected(lang.code)}
            className="w-full flex items-center gap-3 px-4 py-3.5
              border-b border-gray-50 last:border-0
              active:bg-gray-50 transition-all"
          >
            <span className="text-2xl">{lang.flag}</span>
            <span
              className="flex-1 text-gray-700 text-sm
              font-medium text-left"
            >
              {lang.label}
            </span>
            {selected === lang.code && (
              <span style={{ color: "#f02d65" }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="mx-4 mt-4">
        <button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="w-full py-4 rounded-xl text-white font-bold
            text-base shadow-lg active:scale-95 transition-all
            disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #f02d65 0%, #ff6b35 100%)",
          }}
        >
          {saveMutation.isPending ? "Saving..." : "SAVE LANGUAGE"}
        </button>
      </div>
    </div>
  );
};

export default Language;
