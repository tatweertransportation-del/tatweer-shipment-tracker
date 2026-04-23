const TRANSLATIONS = {
  en: {
    brandTag: "Global Freight Visibility",
    adminLink: "Admin",
    heroBadge: "Live Shipment Intelligence",
    heroTitle: "Track Every Milestone with Confidence",
    heroText:
      "Follow your shipment in real time, check the latest port and transit updates, and contact support instantly through WhatsApp.",
    trackingLabel: "Enter Tracking Number",
    trackButton: "Track Shipment",
    currentShipment: "Current Shipment",
    searchPrompt: "Enter a tracking number to begin.",
    lastUpdate: "Last Update",
    eta: "Estimated Delivery",
    deliveryProgress: "Delivery Progress",
    timeline: "Shipment Timeline",
    latestMilestones: "Latest milestones",
    contactWhatsapp: "Contact via WhatsApp",
    copyTrackingLink: "Copy Tracking Link",
    copyLinkSuccess: "Tracking link copied.",
    copyLinkError: "Unable to copy the tracking link.",
    deleteShipment: "Delete",
    deleteShipmentConfirm: "Delete this shipment permanently? This action cannot be undone.",
    deleteShipmentSuccess: "Shipment deleted successfully.",
    deleteShipmentError: "Unable to delete shipment.",
    trackingNotFoundTitle: "We could not find this shipment.",
    trackingNotFoundText: "Please check the tracking number or contact our support team on WhatsApp for help.",
    contactSupportNow: "Contact support now",
    documentsTitle: "Shipment Documents",
    documentsHeadline: "View your shipment papers securely",
    documentsText:
      "Enter your tracking number and the documents password sent by Tatweer to view shipment files.",
    documentsPassword: "Documents Password",
    viewDocuments: "View Documents",
    noDocuments: "No shipment documents are available yet.",
    documentsError: "Unable to load shipment documents.",
    downloadFile: "Open File",
    adminDocumentsTitle: "Shipment Documents",
    adminDocumentsSubtitle: "Upload or replace customer shipment papers",
    shipmentFiles: "Shipment Files",
    sendFilesWhatsapp: "Open WhatsApp message with documents password",
    saveShipmentFiles: "Save Shipment Files",
    shipmentFilesSaved: "Shipment files saved successfully.",
    shipmentFilesError: "Unable to save shipment files.",
    promoFastDelivery: "⚡ Fast delivery",
    promoLiveTracking: "📍 Live shipment tracking",
    promoSafeTransport: "🛡️ Safe transport",
    promoWhatsappSupport: "💬 WhatsApp support",
    aboutEyebrow: "About Tatweer",
    aboutTitle: "Reliable logistics solutions",
    aboutText:
      "Tatweer Logistics Services specializes in transport and logistics solutions, delivering professional services with quality, commitment, strong heavy-transport experience, equipped fleet, and a qualified team focused on trusted long-term partnerships.",
    trustQuality: "✅ Quality commitment",
    trustFleet: "🚚 Equipped fleet",
    trustTeam: "👷 Qualified team",
    trustPartnerships: "🤝 Trusted partnerships",
    searchHistory: "Search History",
    clearHistory: "Clear",
    supportTitle: "Need help with your cargo?",
    supportText:
      "Our logistics team monitors every route, crossing, and handover point so you always know what happens next.",
    suggestionsTitle: "Suggestions and Feedback",
    suggestionsHeadline: "Help us make tracking better for you",
    suggestionsText:
      "Share any ideas that can improve the tracking experience. Your feedback goes directly to the admin dashboard for review.",
    suggestionsPolicy:
      "We welcome your suggestions and feedback. Please keep your message respectful and constructive.",
    suggestionBenefitDirect: "📬 Direct to operations",
    suggestionBenefitFast: "⚡ Fast review",
    suggestionBenefitBetter: "✨ Better customer experience",
    suggestionName: "Your Name",
    suggestionPhone: "Phone Number",
    suggestionTracking: "Tracking Number (Optional)",
    suggestionMessage: "Your Suggestion",
    suggestionPlaceholder:
      "Write your suggestion, note, or improvement idea here.",
    submitSuggestion: "Send Suggestion",
    suggestionSuccess: "Your suggestion was sent successfully.",
    suggestionError: "Unable to send your suggestion.",
    updateTimeOnly: "Updates daily at {time} your local time, equivalent to 2:00 PM Egypt time",
    exportExcel: "Export Excel",
    exportReady: "Excel file downloaded successfully.",
    adminBadge: "Operations Control Center",
    trackingHome: "Tracking Page",
    secureLogin: "Secure Login",
    adminLoginTitle: "Administrator Sign In",
    username: "Username",
    password: "Password",
    loginButton: "Login",
    totalShipments: "Total Shipments",
    deliveredCount: "Delivered",
    inTransitCount: "In Transit",
    logout: "Logout",
    shipmentManagement: "Shipment Management",
    createShipment: "Add New Shipment",
    trackingNumber: "Tracking Number",
    customerPhone: "Customer Phone Number",
    arabicStatus: "Arabic Status",
    englishStatus: "English Status",
    preferredLanguage: "Preferred Language",
    deliveryDate: "Estimated Delivery Date",
    addShipment: "Add Shipment",
    statusUpdates: "Status Updates",
    updateShipment: "Update Shipment Status",
    selectShipment: "Select Shipment",
    manualTrackingNumber: "Or Type Tracking Number",
    manualTrackingPlaceholder: "Leave empty to use the selected shipment",
    customArabicStatus: "Custom Arabic Status",
    customEnglishStatus: "Custom English Status",
    shipmentLocation: "Location",
    progressPercent: "Progress %",
    internalNotes: "Internal Notes",
    internalNotesPlaceholder: "Private notes for the operations team only.",
    sendWhatsapp: "Send WhatsApp Notification",
    sendBilingualWhatsapp: "Send Arabic and English in one message",
    saveUpdate: "Save Update",
    allShipments: "All Shipments",
    liveShipmentList: "Live Shipment List",
    shipmentSearchPlaceholder: "Search by tracking number, phone, status, or notes",
    currentStatus: "Current Status",
    progressHeader: "Progress",
    actions: "Actions",
    trackingInputPlaceholder: "Enter Tracking Number",
    trackingHeadlinePrefix: "Tracking Number",
    loginSuccess: "Login successful.",
    loginError: "Incorrect username or password.",
    addShipmentSuccess: "Shipment added successfully.",
    addShipmentError: "Unable to add shipment.",
    updateShipmentSuccess: "Shipment updated successfully.",
    updateShipmentError: "Unable to update shipment.",
    loadShipmentsError: "Unable to load shipments.",
    shipmentNotFound: "Shipment not found.",
    historyEmpty: "No searches yet.",
    noTimeline: "Timeline will appear here after a shipment is found.",
    whatsappOpened: "WhatsApp chat opened for the customer.",
    noShipmentsToUpdate: "No active shipments to update",
    noShipmentSelected: "There is no shipment available to update.",
    suggestionsInbox: "Customer Suggestions",
    suggestionsInboxSubtitle: "Messages submitted from the public tracking page",
    suggestionsCount: "Suggestions",
    noSuggestions: "No suggestions have been submitted yet.",
    suggestionDate: "Date",
    suggestionSender: "Sender",
    suggestionDetails: "Details",
    suggestionMessageColumn: "Suggestion",
    anonymousSender: "Anonymous",
    themeLight: "☀",
    themeDark: "🌙"
  },
  ar: {
    brandTag: "متابعة عالمية للشحنات",
    adminLink: "لوحة الإدارة",
    heroBadge: "معلومات فورية للشحنة",
    heroTitle: "تابع كل مرحلة بثقة ووضوح",
    heroText:
      "راقب شحنتك لحظة بلحظة، وتحقق من آخر تحديثات الموانئ والتنقل، وتواصل مباشرة عبر واتساب.",
    trackingLabel: "أدخل رقم الشحنة",
    trackButton: "تتبع الشحنة",
    currentShipment: "الشحنة الحالية",
    searchPrompt: "أدخل رقم الشحنة للبدء.",
    lastUpdate: "آخر تحديث",
    eta: "موعد التسليم المتوقع",
    deliveryProgress: "نسبة التقدم",
    timeline: "مراحل الشحنة",
    latestMilestones: "أحدث المحطات",
    contactWhatsapp: "تواصل واتساب",
    copyTrackingLink: "نسخ رابط التتبع",
    copyLinkSuccess: "تم نسخ رابط التتبع.",
    copyLinkError: "تعذر نسخ رابط التتبع.",
    deleteShipment: "حذف",
    deleteShipmentConfirm: "هل تريد حذف هذه الشحنة نهائيًا؟ لا يمكن التراجع عن هذا الإجراء.",
    deleteShipmentSuccess: "تم حذف الشحنة بنجاح.",
    deleteShipmentError: "تعذر حذف الشحنة.",
    trackingNotFoundTitle: "لم نتمكن من العثور على هذه الشحنة.",
    trackingNotFoundText: "يرجى التأكد من رقم الشحنة أو التواصل مع فريق الدعم عبر واتساب للمساعدة.",
    contactSupportNow: "تواصل مع الدعم الآن",
    documentsTitle: "أوراق الشحنة",
    documentsHeadline: "اطلع على أوراق شحنتك بأمان",
    documentsText: "أدخل رقم الشحنة وكلمة مرور الأوراق المرسلة من تطوير لعرض الملفات.",
    documentsPassword: "كلمة مرور الأوراق",
    viewDocuments: "عرض الأوراق",
    noDocuments: "لا توجد أوراق متاحة للشحنة حتى الآن.",
    documentsError: "تعذر تحميل أوراق الشحنة.",
    downloadFile: "فتح الملف",
    adminDocumentsTitle: "أوراق الشحنة",
    adminDocumentsSubtitle: "رفع أو استبدال أوراق الشحنة للعميل",
    shipmentFiles: "ملفات الشحنة",
    sendFilesWhatsapp: "فتح رسالة واتساب بكلمة مرور الأوراق",
    saveShipmentFiles: "حفظ ملفات الشحنة",
    shipmentFilesSaved: "تم حفظ ملفات الشحنة بنجاح.",
    shipmentFilesError: "تعذر حفظ ملفات الشحنة.",
    promoFastDelivery: "⚡ سرعة في التسليم",
    promoLiveTracking: "📍 متابعة مباشرة للشحنة",
    promoSafeTransport: "🛡️ نقل آمن وموثوق",
    promoWhatsappSupport: "💬 دعم عبر واتساب",
    aboutEyebrow: "نبذة عن تطوير",
    aboutTitle: "حلول لوجستية موثوقة",
    aboutText:
      "تطوير للخدمات اللوجستية هي شركة متخصصة في حلول النقل والخدمات اللوجستية، تقدم خدماتها باحترافية عالية وفق أعلى معايير الجودة والالتزام. تعتمد الشركة على خبرة قوية في مجال النقل الثقيل وإدارة العمليات اللوجستية، بما يضمن سرعة التنفيذ ودقة المواعيد وكفاءة التشغيل. وتسعى تطوير إلى تقديم خدمات موثوقة تلبي احتياجات العملاء في مختلف القطاعات، من خلال أسطول مجهز وفريق عمل مؤهل، مع التركيز على بناء شراكات طويلة الأمد قائمة على الثقة والتميز.",
    trustQuality: "✅ التزام بالجودة",
    trustFleet: "🚚 أسطول مجهز",
    trustTeam: "👷 فريق مؤهل",
    trustPartnerships: "🤝 شراكات طويلة الأمد",
    searchHistory: "سجل البحث",
    clearHistory: "مسح",
    supportTitle: "هل تحتاج مساعدة في شحنتك؟",
    supportText:
      "فريقنا اللوجستي يراقب كل مسار ونقطة عبور وتسليم حتى تكون على اطلاع دائم بما يحدث.",
    suggestionsTitle: "الاقتراحات والملاحظات",
    suggestionsHeadline: "ساعدنا نخلي تجربة التتبع أفضل",
    suggestionsText:
      "اكتب أي فكرة أو اقتراح يمكن أن يحسن تجربة التتبع، وسيظهر مباشرة داخل لوحة الإدارة للمراجعة.",
    suggestionsPolicy:
      "يسعدنا استقبال اقتراحاتكم وملاحظاتكم، ونرجو أن تكون الرسائل بلغة محترمة وبنّاءة.",
    suggestionBenefitDirect: "📬 تصل مباشرة لفريق التشغيل",
    suggestionBenefitFast: "⚡ مراجعة سريعة",
    suggestionBenefitBetter: "✨ تجربة أفضل للعملاء",
    suggestionName: "الاسم",
    suggestionPhone: "رقم الهاتف",
    suggestionTracking: "رقم الشحنة (اختياري)",
    suggestionMessage: "اقتراحك",
    suggestionPlaceholder: "اكتب هنا اقتراحك أو ملاحظتك أو الفكرة التي تريد مشاركتها.",
    submitSuggestion: "إرسال الاقتراح",
    suggestionSuccess: "تم إرسال اقتراحك بنجاح.",
    suggestionError: "تعذر إرسال الاقتراح.",
    updateTimeOnly: "يتم التحديث يوميًا الساعة {time} بتوقيتك المحلي، بما يعادل 2:00 ظهرًا بتوقيت مصر",
    exportExcel: "استخراج إكسل",
    exportReady: "تم تنزيل ملف الإكسل بنجاح.",
    adminBadge: "مركز التحكم التشغيلي",
    trackingHome: "صفحة التتبع",
    secureLogin: "تسجيل دخول آمن",
    adminLoginTitle: "دخول المدير",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginButton: "دخول",
    totalShipments: "عدد الشحنات",
    deliveredCount: "تم التسليم",
    inTransitCount: "قيد الشحن",
    logout: "تسجيل الخروج",
    shipmentManagement: "إدارة الشحنات",
    createShipment: "إضافة شحنة جديدة",
    trackingNumber: "رقم الشحنة",
    customerPhone: "رقم هاتف العميل",
    arabicStatus: "الحالة بالعربية",
    englishStatus: "الحالة بالإنجليزية",
    preferredLanguage: "اللغة المفضلة",
    deliveryDate: "تاريخ التسليم المتوقع",
    addShipment: "إضافة الشحنة",
    statusUpdates: "تحديثات الحالة",
    updateShipment: "تحديث حالة الشحنة",
    selectShipment: "اختر الشحنة",
    manualTrackingNumber: "أو اكتب رقم الشحنة",
    manualTrackingPlaceholder: "اتركها فارغة لاستخدام الشحنة المختارة من القائمة",
    customArabicStatus: "حالة مخصصة بالعربية",
    customEnglishStatus: "حالة مخصصة بالإنجليزية",
    shipmentLocation: "الموقع",
    progressPercent: "نسبة التقدم",
    internalNotes: "ملاحظات داخلية",
    internalNotesPlaceholder: "ملاحظات خاصة بفريق التشغيل فقط ولا تظهر للعميل.",
    sendWhatsapp: "إرسال إشعار واتساب",
    sendBilingualWhatsapp: "إرسال الرسالة بالعربي والإنجليزي معًا",
    saveUpdate: "حفظ التحديث",
    allShipments: "كل الشحنات",
    liveShipmentList: "قائمة الشحنات المباشرة",
    shipmentSearchPlaceholder: "ابحث برقم الشحنة أو الهاتف أو الحالة أو الملاحظات",
    currentStatus: "الحالة الحالية",
    progressHeader: "التقدم",
    actions: "إجراءات",
    trackingInputPlaceholder: "أدخل رقم الشحنة",
    trackingHeadlinePrefix: "رقم الشحنة",
    loginSuccess: "تم تسجيل الدخول بنجاح.",
    loginError: "اسم المستخدم أو كلمة المرور غير صحيحين.",
    addShipmentSuccess: "تمت إضافة الشحنة بنجاح.",
    addShipmentError: "تعذر إضافة الشحنة.",
    updateShipmentSuccess: "تم تحديث الشحنة بنجاح.",
    updateShipmentError: "تعذر تحديث الشحنة.",
    loadShipmentsError: "تعذر تحميل الشحنات.",
    shipmentNotFound: "لم يتم العثور على الشحنة.",
    historyEmpty: "لا يوجد سجل بحث بعد.",
    noTimeline: "سيظهر خط سير الشحنة هنا بعد العثور عليها.",
    whatsappOpened: "تم فتح محادثة واتساب للعميل.",
    noShipmentsToUpdate: "لا توجد شحنات متاحة للتحديث",
    noShipmentSelected: "لا توجد شحنة متاحة للتحديث.",
    suggestionsInbox: "اقتراحات العملاء",
    suggestionsInboxSubtitle: "الرسائل المرسلة من صفحة التتبع العامة",
    suggestionsCount: "عدد الاقتراحات",
    noSuggestions: "لا توجد اقتراحات مرسلة حتى الآن.",
    suggestionDate: "التاريخ",
    suggestionSender: "المرسل",
    suggestionDetails: "البيانات",
    suggestionMessageColumn: "الاقتراح",
    anonymousSender: "مرسل بدون اسم",
    themeLight: "☀",
    themeDark: "🌙"
  }
};

const page = document.body.dataset.page;
const storageKeys = {
  language: "shipment-language",
  theme: "shipment-theme",
  history: "shipment-search-history",
  token: "shipment-admin-token"
};
const APP_CONFIG = window.APP_CONFIG || {};

let currentLanguage = localStorage.getItem(storageKeys.language) || "en";
let currentTheme = localStorage.getItem(storageKeys.theme) || "dark";
let lastViewedShipment = null;
let adminState = {
  shipments: [],
  suggestions: []
};

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  return normalizeBaseUrl(APP_CONFIG.API_BASE_URL) || window.location.origin;
}

function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

function buildFileUrl(path) {
  return buildApiUrl(path);
}

function buildTrackingPageLink(trackingNumber) {
  const baseUrl = normalizeBaseUrl(APP_CONFIG.APP_BASE_URL) || window.location.origin;
  return `${baseUrl}/?tracking=${encodeURIComponent(trackingNumber)}`;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

async function copyTrackingLink(trackingNumber) {
  try {
    await copyTextToClipboard(buildTrackingPageLink(trackingNumber));
    notify(t("copyLinkSuccess"));
  } catch (error) {
    notify(t("copyLinkError"));
  }
}

function normalizeWhatsappContactNumber(phoneNumber) {
  const cleaned = String(phoneNumber || "").replace(/[^\d]/g, "");
  if (!cleaned) {
    return "";
  }
  if (cleaned.startsWith("0")) {
    return `2${cleaned}`;
  }
  return cleaned;
}

function normalizePhoneWithCountryCode(countryCode, phoneNumber) {
  const code = String(countryCode || "").replace(/[^\d]/g, "");
  let phone = String(phoneNumber || "").replace(/[^\d]/g, "");
  if (!phone) {
    return "";
  }

  if (phone.startsWith("00")) {
    phone = phone.slice(2);
  }

  if (phone.startsWith("+")) {
    return phone.replace(/[^\d]/g, "");
  }

  if (code && phone.startsWith(code)) {
    return phone;
  }

  if (phone.startsWith("0")) {
    phone = phone.slice(1);
  }

  return `${code}${phone}`;
}

function getLatestShipmentLocation(shipment) {
  const history = Array.isArray(shipment.history) ? shipment.history : [];
  const lastEntry = history.length ? history[history.length - 1] : null;
  return String(lastEntry?.location || "").trim();
}

function buildAdminShipmentMessage(shipment, messageType = "update", language = shipment.preferred_language || "ar") {
  const isEnglish = language === "en";
  const location = getLatestShipmentLocation(shipment);
  const locationLineEn = location ? `Current Location: ${location}\n` : "";
  const locationLineAr = location ? `الموقع الحالي: ${location}\n` : "";

  if (isEnglish) {
    const title = messageType === "create" ? "Your shipment has been registered." : "Your shipment has a new update.";
    return `Tatweer Logistics

Dear customer,
${title}

Tracking Number: ${shipment.tracking_number}
Current Status: ${shipment.english_status}
${locationLineEn}Estimated Delivery: ${formatDate(shipment.delivery_date)}

Track your shipment here:
${shipment.tracking_link}

At Tatweer, we deliver with care, accuracy, and commitment.
Thank you for choosing us.`;
  }

  const title = messageType === "create" ? "تم تسجيل شحنتكم بنجاح." : "يوجد تحديث جديد على شحنتكم.";
  return `تطوير للخدمات اللوجستية

عزيزنا العميل،
${title}

رقم الشحنة: ${shipment.tracking_number}
الحالة الحالية: ${shipment.arabic_status}
${locationLineAr}موعد التسليم المتوقع: ${formatDate(shipment.delivery_date)}

رابط التتبع:
${shipment.tracking_link}

في تطوير، نلتزم بالدقة والسرعة والاهتمام بكل تفاصيل شحنتكم.
نشكركم على ثقتكم بنا.`;
}

function buildBilingualAdminShipmentMessage(shipment, messageType = "update") {
  const arabicMessage = buildAdminShipmentMessage(shipment, messageType, "ar");
  const englishMessage = buildAdminShipmentMessage(shipment, messageType, "en");
  return `${arabicMessage}

----------------------------------------
----------------------------------------

${englishMessage}`;
}

function openCustomerUpdateWhatsapp(shipment, messageType = "update", bilingual = false) {
  const customerPhone = normalizeWhatsappContactNumber(shipment.phone_number);
  if (!customerPhone) {
    return false;
  }

  const message = bilingual
    ? buildBilingualAdminShipmentMessage(shipment, messageType)
    : buildAdminShipmentMessage(shipment, messageType);
  const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener");
  return true;
}

function t(key) {
  return TRANSLATIONS[currentLanguage][key] || key;
}

function setLanguage(language) {
  currentLanguage = language === "ar" ? "ar" : "en";
  localStorage.setItem(storageKeys.language, currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.body.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });

  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.textContent = currentLanguage === "ar" ? "EN" : "AR";
  }

  if (page === "tracking") {
    renderSearchHistory();
    syncSupportWhatsappLink(document.getElementById("trackingInput")?.value || "");
    if (lastViewedShipment) {
      renderShipment(lastViewedShipment);
    }
  }

  if (page === "admin" && (adminState.shipments.length || adminState.suggestions.length)) {
    renderShipmentOptions(adminState.shipments);
    syncSelectedShipmentNotes();
    renderAnalytics(adminState.shipments, adminState.suggestions);
    renderShipmentsTable(adminState.shipments);
    renderSuggestionsTable(adminState.suggestions);
  }
}

function setTheme(theme) {
  currentTheme = theme === "light" ? "light" : "dark";
  localStorage.setItem(storageKeys.theme, currentTheme);
  document.body.classList.toggle("light-mode", currentTheme === "light");

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.textContent = currentTheme === "light" ? t("themeDark") : t("themeLight");
  }
}

function notify(message) {
  window.alert(message);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateString) {
  if (!dateString) {
    return "--";
  }
  const locale = currentLanguage === "ar" ? "ar-EG" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: dateString.includes("T") ? "short" : undefined
  }).format(new Date(dateString));
}

function formatTimeOnly(dateString) {
  if (!dateString) {
    return "--";
  }
  const locale = currentLanguage === "ar" ? "ar-EG" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    timeStyle: "short"
  }).format(new Date(dateString));
}

function getTimeZoneDateParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );
}

function getTimeZoneOffsetMs(timeZone, date) {
  const parts = getTimeZoneDateParts(date, timeZone);
  const hour = parts.hour === 24 ? 0 : parts.hour;
  const zonedTime = Date.UTC(parts.year, parts.month - 1, parts.day, hour, parts.minute, parts.second);
  return zonedTime - date.getTime();
}

function getEgyptUpdateInstant() {
  const egyptTimeZone = "Africa/Cairo";
  const nowInEgypt = getTimeZoneDateParts(new Date(), egyptTimeZone);
  let utcTime = Date.UTC(nowInEgypt.year, nowInEgypt.month - 1, nowInEgypt.day, 14, 0, 0);

  for (let index = 0; index < 2; index += 1) {
    utcTime = Date.UTC(nowInEgypt.year, nowInEgypt.month - 1, nowInEgypt.day, 14, 0, 0) -
      getTimeZoneOffsetMs(egyptTimeZone, new Date(utcTime));
  }

  return new Date(utcTime);
}

function getLocalizedUpdateTimeText() {
  const locale = currentLanguage === "ar" ? "ar-EG" : undefined;
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const time = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: clientTimeZone,
    timeZoneName: "short"
  }).format(getEgyptUpdateInstant());
  return t("updateTimeOnly").replace("{time}", time);
}

function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(storageKeys.history) || "[]");
  } catch (error) {
    return [];
  }
}

function saveSearchHistory(trackingNumber) {
  const cleaned = trackingNumber.trim().toUpperCase();
  if (!cleaned) {
    return;
  }
  const updated = [cleaned, ...getSearchHistory().filter((item) => item !== cleaned)].slice(0, 6);
  localStorage.setItem(storageKeys.history, JSON.stringify(updated));
  renderSearchHistory();
}

function renderSearchHistory() {
  const container = document.getElementById("searchHistoryList");
  if (!container) {
    return;
  }

  const history = getSearchHistory();
  if (!history.length) {
    container.innerHTML = `<div class="empty-state">${t("historyEmpty")}</div>`;
    return;
  }

  container.innerHTML = history
    .map(
      (item) => `
        <div class="history-entry">
          <button type="button" data-history-item="${item}">${item}</button>
          <span>📦</span>
        </div>
      `
    )
    .join("");
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = localStorage.getItem(storageKeys.token);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

async function fileToPayload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve({
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        content_base64: result.split(",")[1] || ""
      });
    };
    reader.onerror = () => reject(reader.error || new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function buildCustomerFilesWhatsappLink(phoneNumber, message) {
  const phone = normalizeWhatsappContactNumber(phoneNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function renderTimeline(history = []) {
  const container = document.getElementById("timelineContainer");
  if (!container) {
    return;
  }

  if (!history.length) {
    container.innerHTML = `<div class="empty-state">${t("noTimeline")}</div>`;
    return;
  }

  container.innerHTML = history
    .slice()
    .map((item) => {
      const title = currentLanguage === "ar" ? item.arabic_status : item.english_status;
      const location = item.location ? ` • ${item.location}` : "";
      return `
        <div class="timeline-item">
          <h5>${title}</h5>
          <p>${formatDate(item.timestamp)}${location}</p>
        </div>
      `;
    })
    .join("");
}

function isCompletedShipment(shipment) {
  const arabicStatus = String(shipment.arabic_status || "").trim();
  const englishStatus = String(shipment.english_status || "").trim().toLowerCase();
  return Number(shipment.progress) >= 100 || arabicStatus === "تم التسليم" || englishStatus === "delivered";
}

function buildCustomerWhatsappLink(trackingNumber) {
  const localeMessage =
    currentLanguage === "ar"
      ? `مرحبًا، أحتاج مساعدة بخصوص الشحنة ${trackingNumber}`
      : `Hello, I need help with shipment ${trackingNumber}`;
  const supportPhone = APP_CONFIG.SUPPORT_WHATSAPP_NUMBER || "01019552952";
  const phone = normalizeWhatsappContactNumber(supportPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(localeMessage)}`;
}

function syncSupportWhatsappLink(trackingNumber = "") {
  const whatsappLink = document.getElementById("whatsappLink");
  if (!whatsappLink) {
    return;
  }
  whatsappLink.href = buildCustomerWhatsappLink(trackingNumber || "support");
}

function renderShipment(shipment) {
  const headline = document.getElementById("trackingHeadline");
  const statusBadge = document.getElementById("statusBadge");
  const lastUpdateValue = document.getElementById("lastUpdateValue");
  const lastUpdateTimeValue = document.getElementById("lastUpdateTimeValue");
  const etaValue = document.getElementById("etaValue");
  const progressValue = document.getElementById("progressValue");
  const progressFill = document.getElementById("progressFill");
  const whatsappLink = document.getElementById("whatsappLink");
  const copyTrackingLinkBtn = document.getElementById("copyTrackingLinkBtn");
  const trackingFeedback = document.getElementById("trackingFeedback");

  if (!headline || !statusBadge) {
    return;
  }

  trackingFeedback?.classList.add("hidden");
  headline.textContent = `${t("trackingHeadlinePrefix")}: ${shipment.tracking_number}`;
  statusBadge.textContent =
    currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status;
  lastUpdateValue.textContent = formatDate(shipment.last_update_time);
  if (lastUpdateTimeValue) {
    lastUpdateTimeValue.textContent = getLocalizedUpdateTimeText();
  }
  etaValue.textContent = formatDate(shipment.delivery_date);
  progressValue.textContent = `${shipment.progress}%`;
  progressFill.style.width = `${shipment.progress}%`;
  if (whatsappLink) {
    whatsappLink.href = buildCustomerWhatsappLink(shipment.tracking_number);
  }
  if (copyTrackingLinkBtn) {
    copyTrackingLinkBtn.classList.remove("hidden");
    copyTrackingLinkBtn.dataset.trackingNumber = shipment.tracking_number;
  }

  renderTimeline(shipment.history || []);
}

function renderDocuments(files, trackingNumber, password) {
  const container = document.getElementById("documentsResult");
  if (!container) {
    return;
  }

  if (!files.length) {
    container.innerHTML = `<div class="empty-state">${t("noDocuments")}</div>`;
    return;
  }

  container.innerHTML = files
    .map((file) => {
      const href = buildFileUrl(
        `/api/shipment-files/${encodeURIComponent(trackingNumber)}/${encodeURIComponent(file.id)}?password=${encodeURIComponent(password)}`
      );
      return `
        <article class="document-item">
          <div>
            <strong>${escapeHtml(file.file_name)}</strong>
            <p>${escapeHtml(file.mime_type)} • ${Math.ceil(Number(file.file_size || 0) / 1024)} KB</p>
          </div>
          <a class="ghost-outline-btn" href="${href}" target="_blank" rel="noopener">${t("downloadFile")}</a>
        </article>
      `;
    })
    .join("");
}

async function lookupDocuments(trackingNumber, password) {
  const result = await api("/api/shipment-files/lookup", {
    method: "POST",
    body: JSON.stringify({
      tracking_number: trackingNumber,
      password
    })
  });
  renderDocuments(result.files || [], result.tracking_number, password);
}

function renderShipmentNotFound(trackingNumber) {
  const headline = document.getElementById("trackingHeadline");
  const statusBadge = document.getElementById("statusBadge");
  const trackingFeedback = document.getElementById("trackingFeedback");
  const copyTrackingLinkBtn = document.getElementById("copyTrackingLinkBtn");
  if (!trackingFeedback) {
    notify(t("shipmentNotFound"));
    return;
  }

  lastViewedShipment = null;
  if (headline) {
    headline.textContent = t("trackingNotFoundTitle");
  }
  if (statusBadge) {
    statusBadge.textContent = "--";
  }
  copyTrackingLinkBtn?.classList.add("hidden");
  trackingFeedback.classList.remove("hidden");
  trackingFeedback.innerHTML = `
    <strong>${t("trackingNotFoundTitle")}</strong>
    <p>${t("trackingNotFoundText")}</p>
    <a class="whatsapp-btn" href="${buildCustomerWhatsappLink(trackingNumber || "support")}" target="_blank" rel="noopener">
      ${t("contactSupportNow")}
    </a>
  `;
  renderTimeline([]);
}

async function fetchShipment(trackingNumber) {
  const shipment = await api(
    `/api/shipments/${encodeURIComponent(trackingNumber.trim().toUpperCase())}?lang=${currentLanguage}`
  );
  lastViewedShipment = shipment;
  saveSearchHistory(trackingNumber);
  renderShipment(shipment);
}

function bindGlobalControls() {
  document.getElementById("languageToggle")?.addEventListener("click", () => {
    setLanguage(currentLanguage === "ar" ? "en" : "ar");
  });

  document.getElementById("themeToggle")?.addEventListener("click", () => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  });
}

async function submitSuggestion(form) {
  const payload = {
    name: document.getElementById("suggestionNameInput")?.value || "",
    phone_number: normalizePhoneWithCountryCode(
      document.getElementById("suggestionCountryCodeInput")?.value || "",
      document.getElementById("suggestionPhoneInput")?.value || ""
    ),
    tracking_number: document.getElementById("suggestionTrackingInput")?.value || "",
    message: document.getElementById("suggestionMessageInput")?.value || "",
    language: currentLanguage
  };

  await api("/api/suggestions", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  form.reset();
}

async function downloadExcelReport() {
  const token = localStorage.getItem(storageKeys.token);
  if (!token) {
    throw new Error("Unauthorized");
  }

  const response = await fetch(
    buildApiUrl(`/api/shipments/export.xls?lang=${encodeURIComponent(currentLanguage)}`),
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    let message = "Unable to export Excel.";
    try {
      const data = await response.json();
      message = data.error || message;
    } catch (error) {
      // Ignore parse failure and keep default message.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = downloadUrl;
  link.download = `tatweer-shipments-${dateStamp}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

function setupTrackingPage() {
  renderSearchHistory();
  renderTimeline([]);
  syncSupportWhatsappLink();

  document.getElementById("trackingForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("trackingInput");
    try {
      await fetchShipment(input.value);
    } catch (error) {
      if (error.message === "Shipment not found") {
        renderShipmentNotFound(input.value);
      } else {
        notify(error.message);
      }
    }
  });

  document.getElementById("documentsLookupForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await lookupDocuments(
        document.getElementById("documentsTrackingInput").value,
        document.getElementById("documentsPasswordInput").value
      );
    } catch (error) {
      document.getElementById("documentsResult").innerHTML = `<div class="empty-state">${t("documentsError")}</div>`;
    }
  });

  document.getElementById("copyTrackingLinkBtn")?.addEventListener("click", (event) => {
    const trackingNumber = event.currentTarget.dataset.trackingNumber;
    if (trackingNumber) {
      copyTrackingLink(trackingNumber);
    }
  });

  document.getElementById("searchHistoryList")?.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-history-item]");
    if (!target) {
      return;
    }
    const trackingNumber = target.dataset.historyItem;
    document.getElementById("trackingInput").value = trackingNumber;
    try {
      await fetchShipment(trackingNumber);
    } catch (error) {
      renderShipmentNotFound(trackingNumber);
    }
  });

  document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.history);
    renderSearchHistory();
  });

  document.getElementById("suggestionForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await submitSuggestion(event.target);
      notify(t("suggestionSuccess"));
    } catch (error) {
      notify(`${t("suggestionError")} ${error.message}`);
    }
  });

  const params = new URLSearchParams(window.location.search);
  const trackingFromUrl = params.get("tracking");
  if (trackingFromUrl) {
    document.getElementById("trackingInput").value = trackingFromUrl;
    const documentsTrackingInput = document.getElementById("documentsTrackingInput");
    if (documentsTrackingInput) {
      documentsTrackingInput.value = trackingFromUrl;
    }
    const suggestionTrackingInput = document.getElementById("suggestionTrackingInput");
    if (suggestionTrackingInput) {
      suggestionTrackingInput.value = trackingFromUrl;
    }
    fetchShipment(trackingFromUrl).catch(() => {
      renderShipmentNotFound(trackingFromUrl);
    });
  }
}

async function ensureAdminSession() {
  const token = localStorage.getItem(storageKeys.token);
  if (!token) {
    return false;
  }

  try {
    await api("/api/session");
    return true;
  } catch (error) {
    localStorage.removeItem(storageKeys.token);
    return false;
  }
}

function setAdminView(isLoggedIn) {
  document.getElementById("loginSection")?.classList.toggle("hidden", isLoggedIn);
  document.getElementById("dashboardSection")?.classList.toggle("hidden", !isLoggedIn);
}

function renderShipmentOptions(shipments) {
  const select = document.getElementById("shipmentSelect");
  const filesSelect = document.getElementById("filesShipmentSelect");

  const activeShipments = shipments.filter((shipment) => !isCompletedShipment(shipment));

  if (select) {
    if (!activeShipments.length) {
      select.innerHTML = `<option value="">${t("noShipmentsToUpdate")}</option>`;
    } else {
      select.innerHTML = activeShipments
        .map(
          (shipment) =>
            `<option value="${shipment.tracking_number}">${shipment.tracking_number} - ${
              currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status
            }</option>`
        )
        .join("");
    }
  }

  if (filesSelect) {
    filesSelect.innerHTML = shipments
      .map(
        (shipment) =>
          `<option value="${shipment.tracking_number}">${shipment.tracking_number} - ${
            currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status
          }</option>`
      )
      .join("");
  }
}

function getSelectedShipment() {
  const trackingNumber = document.getElementById("shipmentSelect")?.value;
  return adminState.shipments.find((shipment) => shipment.tracking_number === trackingNumber) || null;
}

function syncSelectedShipmentNotes() {
  const notesInput = document.getElementById("internalNotesInput");
  if (!notesInput) {
    return;
  }
  notesInput.value = getSelectedShipment()?.internal_notes || "";
}

function renderAnalytics(shipments, suggestions) {
  const delivered = shipments.filter((shipment) => shipment.progress >= 100).length;
  const suggestionsCount = Array.isArray(suggestions) ? suggestions.length : 0;
  document.getElementById("analyticsTotal").textContent = shipments.length;
  document.getElementById("analyticsDelivered").textContent = delivered;
  document.getElementById("analyticsTransit").textContent = shipments.length - delivered;
  const suggestionsNode = document.getElementById("analyticsSuggestions");
  if (suggestionsNode) {
    suggestionsNode.textContent = suggestionsCount;
  }
}

function renderShipmentsTable(shipments) {
  const body = document.getElementById("shipmentsTableBody");
  if (!body) {
    return;
  }

  const searchValue = String(document.getElementById("shipmentSearchInput")?.value || "")
    .trim()
    .toLowerCase();
  const visibleShipments = searchValue
    ? shipments.filter((shipment) => {
        const searchable = [
          shipment.tracking_number,
          shipment.phone_number,
          shipment.arabic_status,
          shipment.english_status,
          shipment.internal_notes
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(searchValue);
      })
    : shipments;

  body.innerHTML = visibleShipments
    .map((shipment) => {
      const currentStatus =
        currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status;
      return `
        <tr>
          <td>${escapeHtml(shipment.tracking_number)}</td>
          <td>${escapeHtml(shipment.phone_number)}</td>
          <td>${escapeHtml(currentStatus)}</td>
          <td>${escapeHtml(shipment.internal_notes || "--")}</td>
          <td>${formatDate(shipment.delivery_date)}</td>
          <td>${formatDate(shipment.last_update_time)}</td>
          <td>${shipment.progress}%</td>
          <td>
            <button class="text-btn" type="button" data-copy-tracking="${escapeHtml(shipment.tracking_number)}">
              ${t("copyTrackingLink")}
            </button>
            <button class="text-btn danger-text-btn" type="button" data-delete-tracking="${escapeHtml(shipment.tracking_number)}">
              ${t("deleteShipment")}
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function renderSuggestionsTable(suggestions) {
  const body = document.getElementById("suggestionsTableBody");
  if (!body) {
    return;
  }

  if (!suggestions.length) {
    body.innerHTML = `
      <tr>
        <td colspan="4" class="empty-table">${t("noSuggestions")}</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = suggestions
    .map((item) => {
      const sender = item.name || t("anonymousSender");
      const phone = item.phone_number ? `<div>${item.phone_number}</div>` : "";
      const tracking = item.tracking_number ? `<div>${item.tracking_number}</div>` : "";
      return `
        <tr>
          <td>${formatDate(item.created_at)}</td>
          <td>${sender}${phone}</td>
          <td>${tracking || "--"}</td>
          <td>${item.message}</td>
        </tr>
      `;
    })
    .join("");
}

async function loadAdminData() {
  const [shipments, suggestions] = await Promise.all([
    api("/api/shipments"),
    api("/api/suggestions")
  ]);

  const sortedShipments = shipments.sort((first, second) => {
    return new Date(second.last_update_time).getTime() - new Date(first.last_update_time).getTime();
  });

  const sortedSuggestions = suggestions.sort((first, second) => {
    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
  });

  adminState = {
    shipments: sortedShipments,
    suggestions: sortedSuggestions
  };

  renderShipmentOptions(sortedShipments);
  syncSelectedShipmentNotes();
  renderAnalytics(sortedShipments, sortedSuggestions);
  renderShipmentsTable(sortedShipments);
  renderSuggestionsTable(sortedSuggestions);
}

async function deleteShipmentFromAdmin(trackingNumber) {
  if (!trackingNumber || !window.confirm(t("deleteShipmentConfirm"))) {
    return;
  }

  try {
    await api(`/api/shipments/${encodeURIComponent(trackingNumber)}`, {
      method: "DELETE"
    });
    await loadAdminData();
    notify(t("deleteShipmentSuccess"));
  } catch (error) {
    notify(`${t("deleteShipmentError")} ${error.message}`);
  }
}

async function saveShipmentFilesFromAdmin() {
  const trackingNumber = document.getElementById("filesShipmentSelect").value;
  const password = document.getElementById("filesPasswordInput").value.trim();
  const input = document.getElementById("shipmentFilesInput");
  const files = Array.from(input.files || []);

  if (!trackingNumber || !password || !files.length) {
    throw new Error("Missing files data");
  }

  const payloadFiles = await Promise.all(files.map(fileToPayload));
  const result = await api(`/api/admin/shipment-files/${encodeURIComponent(trackingNumber)}`, {
    method: "POST",
    body: JSON.stringify({
      password,
      files: payloadFiles
    })
  });

  if (document.getElementById("sendFilesWhatsappCheckbox")?.checked && result.phone_number) {
    window.open(
      buildCustomerFilesWhatsappLink(result.phone_number, result.whatsapp_message),
      "_blank",
      "noopener"
    );
  }

  return result;
}

function setupAdminPage() {
  document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const data = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({
          username: document.getElementById("usernameInput").value.trim(),
          password: document.getElementById("passwordInput").value
        })
      });
      localStorage.setItem(storageKeys.token, data.token);
      setAdminView(true);
      await loadAdminData();
      notify(t("loginSuccess"));
    } catch (error) {
      notify(t("loginError"));
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.token);
    setAdminView(false);
  });

  document.getElementById("exportExcelBtn")?.addEventListener("click", async () => {
    try {
      await downloadExcelReport();
      notify(t("exportReady"));
    } catch (error) {
      notify(error.message || t("loadShipmentsError"));
    }
  });

  document.getElementById("shipmentSearchInput")?.addEventListener("input", () => {
    renderShipmentsTable(adminState.shipments);
  });

  document.getElementById("shipmentSelect")?.addEventListener("change", () => {
    syncSelectedShipmentNotes();
  });

  document.getElementById("shipmentFilesForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await saveShipmentFilesFromAdmin();
      event.target.reset();
      renderShipmentOptions(adminState.shipments);
      notify(t("shipmentFilesSaved"));
    } catch (error) {
      notify(`${t("shipmentFilesError")} ${error.message}`);
    }
  });

  document.getElementById("shipmentsTableBody")?.addEventListener("click", (event) => {
    const copyTarget = event.target.closest("[data-copy-tracking]");
    if (copyTarget) {
      copyTrackingLink(copyTarget.dataset.copyTracking);
      return;
    }

    const deleteTarget = event.target.closest("[data-delete-tracking]");
    if (deleteTarget) {
      deleteShipmentFromAdmin(deleteTarget.dataset.deleteTracking);
    }
  });

  document.getElementById("shipmentForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const createdShipment = await api("/api/shipments", {
        method: "POST",
        body: JSON.stringify({
          tracking_number: document.getElementById("trackingNumberInput").value,
          phone_number: document.getElementById("customerPhoneInput").value,
          arabic_status: document.getElementById("arabicStatusInput").value,
          english_status: document.getElementById("englishStatusInput").value,
          preferred_language: document.getElementById("preferredLanguageInput").value,
          delivery_date: document.getElementById("deliveryDateInput").value
        })
      });

      event.target.reset();
      document.getElementById("preferredLanguageInput").value = "ar";
      await loadAdminData();

      const opened = createdShipment && openCustomerUpdateWhatsapp(createdShipment, "create", false);
      notify(`${t("addShipmentSuccess")}${opened ? ` ${t("whatsappOpened")}` : ""}`);
    } catch (error) {
      notify(`${t("addShipmentError")} ${error.message}`);
    }
  });

  document.getElementById("updateForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const manualTrackingNumber = document.getElementById("manualUpdateTrackingInput").value.trim();
    const trackingNumber = manualTrackingNumber || document.getElementById("shipmentSelect").value;
    if (!trackingNumber) {
      notify(t("noShipmentSelected"));
      return;
    }

    const sendWhatsapp = document.getElementById("sendWhatsappCheckbox").checked;
    const sendBilingualWhatsapp = document.getElementById("bilingualWhatsappCheckbox").checked;

    try {
      const result = await api(`/api/shipments/${encodeURIComponent(trackingNumber)}`, {
        method: "PUT",
        body: JSON.stringify({
          arabic_status: document.getElementById("updateArabicStatusInput").value,
          english_status: document.getElementById("updateEnglishStatusInput").value,
          location: document.getElementById("locationInput").value,
          internal_notes: document.getElementById("internalNotesInput").value,
          progress: document.getElementById("progressInput").value,
          send_whatsapp: false
        })
      });

      await loadAdminData();
      const opened =
        sendWhatsapp && result.shipment && openCustomerUpdateWhatsapp(result.shipment, "update", sendBilingualWhatsapp);
      notify(`${t("updateShipmentSuccess")}${opened ? ` ${t("whatsappOpened")}` : ""}`);
    } catch (error) {
      notify(`${t("updateShipmentError")} ${error.message}`);
    }
  });

  ensureAdminSession().then(async (loggedIn) => {
    setAdminView(loggedIn);
    if (loggedIn) {
      try {
        await loadAdminData();
      } catch (error) {
        notify(t("loadShipmentsError"));
      }
    }
  });
}

bindGlobalControls();
setTheme(currentTheme);
setLanguage(currentLanguage);

if (page === "tracking") {
  setupTrackingPage();
}

if (page === "admin") {
  setupAdminPage();
}
