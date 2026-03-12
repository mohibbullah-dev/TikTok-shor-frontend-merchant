///////////////////////////// ================================ latest version (by gemeni with 2 fields adintion) =======================///////////////////
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";
import {
  Eye,
  EyeOff,
  // ArrowLeft,
  ChevronDown,
  Loader2,
  FileImage,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    storeAddress: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    storeName: "",
    invitationCode: "",
    nidFront: null,
    nidBack: null,
  });

  const [countryCode, setCountryCode] = useState("+86");
  const [language, setLanguage] = useState("US English");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();

  useState(() => {
    const code = searchParams.get("code");
    if (code) {
      setFormData((prev) => ({ ...prev, invitationCode: code }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });
      const objectUrl = URL.createObjectURL(file);
      if (e.target.name === "nidFront") setPreviewFront(objectUrl);
      if (e.target.name === "nidBack") setPreviewBack(objectUrl);
    }
  };

  const handleNextStep = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.storeAddress ||
      !formData.password ||
      !formData.mobile
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!formData.nidFront || !formData.nidBack) {
      toast.error("Please upload both front and back of your NID/Passport");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.storeName || !formData.invitationCode) {
      toast.error("Store name and invitation code are required");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);
      submitData.append("storeAddress", formData.storeAddress);
      submitData.append("mobile", `${countryCode} ${formData.mobile}`);
      submitData.append("password", formData.password);
      submitData.append("storeName", formData.storeName);
      submitData.append("invitationCode", formData.invitationCode);
      submitData.append("nidFront", formData.nidFront);
      submitData.append("nidBack", formData.nidBack);

      await API.post("/auth/register", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#121212",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "6px",
    display: "block",
  };

  const languages = ["US English", "Bangla", "Hindi"];

  return (
    <div className="min-h-screen w-full relative flex justify-center bg-gray-100">
      <div
        className="w-full flex flex-col bg-white overflow-x-hidden relative"
        style={{ maxWidth: "480px", minHeight: "100vh" }}
      >
        {/* ── Official Top Navigation Bar ── */}
        <div className="flex justify-between items-center px-5 py-4 relative z-20">
          <div className="flex items-center">
            {step === 2 && (
              <ChevronDown
                size={20}
                className="mr-3 cursor-pointer text-gray-800 hover:text-gray-600"
                onClick={() => setStep(1)}
              />
            )}
            {/* ✅ NEW: Using the exact uploaded logo image */}
            <img
              src="/logo_like_demo.png"
              alt="TikTok Shop"
              className="h-20 object-contain" // Adjusted height to match demo top bar
            />
          </div>

          <div className="relative">
            <div
              className="text-[13px] text-[#018784] font-medium cursor-pointer flex items-center gap-1"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {language} <span className="text-[9px]">▼</span>
            </div>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden z-50">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangDropdown(false);
                    }}
                    className="px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Centered Hero Illustration ── */}
        <div className="flex flex-col items-center justify-center mt-2 mb-6">
          {/* ✅ NEW: Using the exact uploaded hero illustration */}
          <img
            src="/hero_image_like_demo.png"
            alt="Hero Illustration"
            className="w-48 h-48 object-contain mb-2" // Slightly larger to match the demo's visual weight
          />
          <h1 className="text-[22px] font-bold text-[#121212]">
            {step === 1 ? "Create Account" : "Store Info"}
          </h1>
          <p className="text-[13px] text-gray-400 mt-1">Step {step} of 2</p>
        </div>

        {/* ── Form Container ── */}
        <div className="px-6 pb-12">
          {step === 1 ? (
            <div className="flex flex-col" style={{ gap: "4px" }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Physical Address</label>
                <input
                  type="text"
                  name="storeAddress"
                  value={formData.storeAddress}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Phone number</label>
                <div className="flex">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 border border-r-0 border-[#e5e7eb] rounded-l-[4px] bg-white text-[14px] text-gray-600 focus:outline-none cursor-pointer appearance-none"
                    style={{ minWidth: "80px", textAlign: "center" }}
                  >
                    <option value="+93">AF +93</option>
                    <option value="+355">AL +355</option>
                    <option value="+213">DZ +213</option>
                    <option value="+376">AD +376</option>
                    <option value="+244">AO +244</option>
                    <option value="+54">AR +54</option>
                    <option value="+374">AM +374</option>
                    <option value="+61">AU +61</option>
                    <option value="+43">AT +43</option>
                    <option value="+994">AZ +994</option>
                    <option value="+973">BH +973</option>
                    <option value="+880">BD +880</option>
                    <option value="+375">BY +375</option>
                    <option value="+32">BE +32</option>
                    <option value="+501">BZ +501</option>
                    <option value="+229">BJ +229</option>
                    <option value="+975">BT +975</option>
                    <option value="+591">BO +591</option>
                    <option value="+387">BA +387</option>
                    <option value="+267">BW +267</option>
                    <option value="+55">BR +55</option>
                    <option value="+673">BN +673</option>
                    <option value="+359">BG +359</option>
                    <option value="+226">BF +226</option>
                    <option value="+257">BI +257</option>
                    <option value="+855">KH +855</option>
                    <option value="+237">CM +237</option>
                    <option value="+1">CA +1</option>
                    <option value="+238">CV +238</option>
                    <option value="+236">CF +236</option>
                    <option value="+235">TD +235</option>
                    <option value="+56">CL +56</option>
                    <option value="+86">CN +86</option>
                    <option value="+57">CO +57</option>
                    <option value="+269">KM +269</option>
                    <option value="+242">CG +242</option>
                    <option value="+506">CR +506</option>
                    <option value="+385">HR +385</option>
                    <option value="+53">CU +53</option>
                    <option value="+357">CY +357</option>
                    <option value="+420">CZ +420</option>
                    <option value="+243">CD +243</option>
                    <option value="+45">DK +45</option>
                    <option value="+253">DJ +253</option>
                    <option value="+1809">DO +1809</option>
                    <option value="+593">EC +593</option>
                    <option value="+20">EG +20</option>
                    <option value="+503">SV +503</option>
                    <option value="+240">GQ +240</option>
                    <option value="+291">ER +291</option>
                    <option value="+372">EE +372</option>
                    <option value="+268">SZ +268</option>
                    <option value="+251">ET +251</option>
                    <option value="+679">FJ +679</option>
                    <option value="+358">FI +358</option>
                    <option value="+33">FR +33</option>
                    <option value="+241">GA +241</option>
                    <option value="+220">GM +220</option>
                    <option value="+995">GE +995</option>
                    <option value="+49">DE +49</option>
                    <option value="+233">GH +233</option>
                    <option value="+30">GR +30</option>
                    <option value="+502">GT +502</option>
                    <option value="+224">GN +224</option>
                    <option value="+245">GW +245</option>
                    <option value="+592">GY +592</option>
                    <option value="+509">HT +509</option>
                    <option value="+504">HN +504</option>
                    <option value="+36">HU +36</option>
                    <option value="+354">IS +354</option>
                    <option value="+91">IN +91</option>
                    <option value="+62">ID +62</option>
                    <option value="+98">IR +98</option>
                    <option value="+964">IQ +964</option>
                    <option value="+353">IE +353</option>
                    <option value="+972">IL +972</option>
                    <option value="+39">IT +39</option>
                    <option value="+1876">JM +1876</option>
                    <option value="+81">JP +81</option>
                    <option value="+962">JO +962</option>
                    <option value="+7">KZ +7</option>
                    <option value="+254">KE +254</option>
                    <option value="+686">KI +686</option>
                    <option value="+383">XK +383</option>
                    <option value="+965">KW +965</option>
                    <option value="+996">KG +996</option>
                    <option value="+856">LA +856</option>
                    <option value="+371">LV +371</option>
                    <option value="+961">LB +961</option>
                    <option value="+266">LS +266</option>
                    <option value="+231">LR +231</option>
                    <option value="+218">LY +218</option>
                    <option value="+423">LI +423</option>
                    <option value="+370">LT +370</option>
                    <option value="+352">LU +352</option>
                    <option value="+261">MG +261</option>
                    <option value="+265">MW +265</option>
                    <option value="+60">MY +60</option>
                    <option value="+960">MV +960</option>
                    <option value="+223">ML +223</option>
                    <option value="+356">MT +356</option>
                    <option value="+692">MH +692</option>
                    <option value="+222">MR +222</option>
                    <option value="+230">MU +230</option>
                    <option value="+52">MX +52</option>
                    <option value="+691">FM +691</option>
                    <option value="+373">MD +373</option>
                    <option value="+377">MC +377</option>
                    <option value="+976">MN +976</option>
                    <option value="+382">ME +382</option>
                    <option value="+212">MA +212</option>
                    <option value="+258">MZ +258</option>
                    <option value="+95">MM +95</option>
                    <option value="+264">NA +264</option>
                    <option value="+674">NR +674</option>
                    <option value="+977">NP +977</option>
                    <option value="+31">NL +31</option>
                    <option value="+64">NZ +64</option>
                    <option value="+505">NI +505</option>
                    <option value="+227">NE +227</option>
                    <option value="+234">NG +234</option>
                    <option value="+850">KP +850</option>
                    <option value="+389">MK +389</option>
                    <option value="+47">NO +47</option>
                    <option value="+968">OM +968</option>
                    <option value="+92">PK +92</option>
                    <option value="+680">PW +680</option>
                    <option value="+507">PA +507</option>
                    <option value="+675">PG +675</option>
                    <option value="+595">PY +595</option>
                    <option value="+51">PE +51</option>
                    <option value="+63">PH +63</option>
                    <option value="+48">PL +48</option>
                    <option value="+351">PT +351</option>
                    <option value="+974">QA +974</option>
                    <option value="+40">RO +40</option>
                    <option value="+7">RU +7</option>
                    <option value="+250">RW +250</option>
                    <option value="+685">WS +685</option>
                    <option value="+378">SM +378</option>
                    <option value="+239">ST +239</option>
                    <option value="+966">SA +966</option>
                    <option value="+221">SN +221</option>
                    <option value="+381">RS +381</option>
                    <option value="+248">SC +248</option>
                    <option value="+232">SL +232</option>
                    <option value="+65">SG +65</option>
                    <option value="+421">SK +421</option>
                    <option value="+386">SI +386</option>
                    <option value="+677">SB +677</option>
                    <option value="+252">SO +252</option>
                    <option value="+27">ZA +27</option>
                    <option value="+82">KR +82</option>
                    <option value="+211">SS +211</option>
                    <option value="+34">ES +34</option>
                    <option value="+94">LK +94</option>
                    <option value="+249">SD +249</option>
                    <option value="+597">SR +597</option>
                    <option value="+46">SE +46</option>
                    <option value="+41">CH +41</option>
                    <option value="+963">SY +963</option>
                    <option value="+886">TW +886</option>
                    <option value="+992">TJ +992</option>
                    <option value="+255">TZ +255</option>
                    <option value="+66">TH +66</option>
                    <option value="+670">TL +670</option>
                    <option value="+228">TG +228</option>
                    <option value="+676">TO +676</option>
                    <option value="+1868">TT +1868</option>
                    <option value="+216">TN +216</option>
                    <option value="+90">TR +90</option>
                    <option value="+993">TM +993</option>
                    <option value="+688">TV +688</option>
                    <option value="+256">UG +256</option>
                    <option value="+380">UA +380</option>
                    <option value="+971">AE +971</option>
                    <option value="+44">GB +44</option>
                    <option value="+1">US +1</option>
                    <option value="+598">UY +598</option>
                    <option value="+998">UZ +998</option>
                    <option value="+678">VU +678</option>
                    <option value="+379">VA +379</option>
                    <option value="+58">VE +58</option>
                    <option value="+84">VN +84</option>
                    <option value="+967">YE +967</option>
                    <option value="+260">ZM +260</option>
                    <option value="+263">ZW +263</option>
                  </select>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    style={{
                      ...inputStyle,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Government ID / Passport</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Front ID Box */}
                  <div className="relative h-24 bg-[#f9fafb] border border-dashed border-[#d1d5db] rounded-[6px] overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group">
                    {previewFront ? (
                      <>
                        <img
                          src={previewFront}
                          alt="Front ID"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[11px] font-bold">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileImage size={20} className="text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Front Side
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      name="nidFront"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Back ID Box */}
                  <div className="relative h-24 bg-[#f9fafb] border border-dashed border-[#d1d5db] rounded-[6px] overflow-hidden flex flex-col items-center justify-center hover:bg-gray-50 transition-colors group">
                    {previewBack ? (
                      <>
                        <img
                          src={previewBack}
                          alt="Back ID"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white text-[11px] font-bold">
                            Change
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FileImage size={20} className="text-gray-400 mb-1" />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Back Side
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      name="nidBack"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    style={{ ...inputStyle, paddingRight: "40px" }}
                    onFocus={(e) => (e.target.style.borderColor = "#018784")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute bg-transparent border-none cursor-pointer text-gray-400"
                    style={{
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: 0,
                    }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full text-white font-semibold border-none mt-2 transition-opacity hover:opacity-90"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: "#018784",
                  cursor: "pointer",
                }}
              >
                Next Step
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col"
              style={{ gap: "16px" }}
            >
              <div>
                <label style={labelStyle}>Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter your store name"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div>
                <label style={labelStyle}>Invitation Code</label>
                <input
                  type="text"
                  name="invitationCode"
                  value={formData.invitationCode}
                  onChange={handleChange}
                  placeholder="6-digit admin code"
                  maxLength={6}
                  className="tracking-widest font-bold uppercase"
                  style={{ ...inputStyle, color: "#018784", fontSize: "16px" }}
                  onFocus={(e) => (e.target.style.borderColor = "#018784")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div
                style={{
                  marginTop: "8px",
                  padding: "16px",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <p
                  className="font-bold flex items-center"
                  style={{
                    color: "#121212",
                    fontSize: "13px",
                    gap: "6px",
                    margin: "0 0 10px 0",
                  }}
                >
                  <ClipboardCheck size={16} className="text-[#018784]" />{" "}
                  Summary
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>User:</strong> {formData.username}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>Phone:</strong> {countryCode} {formData.mobile}
                </p>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "13px",
                    margin: "0 0 6px 0",
                  }}
                >
                  <strong>Address:</strong> {formData.storeAddress}
                </p>
                <p
                  className="flex items-center text-[#018784] font-medium"
                  style={{ fontSize: "13px", margin: "0" }}
                >
                  <CheckCircle2 size={14} className="mr-1" /> IDs Uploaded
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold border-none flex items-center justify-center transition-opacity mt-2"
                style={{
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "15px",
                  backgroundColor: loading ? "#d1d5db" : "#018784",
                  cursor: loading ? "not-allowed" : "pointer",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Creating...
                  </>
                ) : (
                  "Register Store"
                )}
              </button>
            </form>
          )}

          <div className="flex items-center justify-center mt-6 text-[13px] text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium ml-1"
              style={{ color: "#018784", textDecoration: "none" }}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
