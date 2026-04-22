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
    searchHistory: "Search History",
    clearHistory: "Clear",
    supportTitle: "Need help with your cargo?",
    supportText:
      "Our logistics team monitors every route, crossing, and handover point so you always know what happens next.",
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
    predefinedStatus: "Predefined Status",
    customArabicStatus: "Custom Arabic Status",
    customEnglishStatus: "Custom English Status",
    shipmentLocation: "Location",
    progressPercent: "Progress %",
    sendWhatsapp: "Send WhatsApp Notification",
    saveUpdate: "Save Update",
    allShipments: "All Shipments",
    liveShipmentList: "Live Shipment List",
    currentStatus: "Current Status",
    progressHeader: "Progress",
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
    notificationSent: "WhatsApp request processed.",
    whatsappOpened: "WhatsApp chat opened for the customer.",
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
    searchHistory: "سجل البحث",
    clearHistory: "مسح",
    supportTitle: "هل تحتاج مساعدة في شحنتك؟",
    supportText:
      "فريقنا اللوجستي يراقب كل مسار ونقطة عبور وتسليم حتى تكون على اطلاع دائم بما يحدث.",
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
    predefinedStatus: "حالة جاهزة",
    customArabicStatus: "حالة مخصصة بالعربية",
    customEnglishStatus: "حالة مخصصة بالإنجليزية",
    shipmentLocation: "الموقع",
    progressPercent: "نسبة التقدم",
    sendWhatsapp: "إرسال إشعار واتساب",
    saveUpdate: "حفظ التحديث",
    allShipments: "كل الشحنات",
    liveShipmentList: "قائمة الشحنات المباشرة",
    currentStatus: "الحالة الحالية",
    progressHeader: "التقدم",
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
    notificationSent: "تمت معالجة طلب واتساب.",
    whatsappOpened: "تم فتح محادثة واتساب للعميل.",
    themeLight: "☀",
    themeDark: "🌙"
  }
};

const PREDEFINED_STATUSES = {
  safaga: {
    ar: "وصلت ميناء سفاجا",
    en: "Arrived at Safaga Port",
    progress: 55
  },
  duba: {
    ar: "وصلت ميناء ضباء",
    en: "Arrived at Duba Port",
    progress: 60
  },
  hail: {
    ar: "داخل حائل - السعودية",
    en: "In Hail, Saudi Arabia",
    progress: 80
  },
  delivered: {
    ar: "تم التسليم",
    en: "Delivered",
    progress: 100
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

function getLatestShipmentLocation(shipment) {
  const history = Array.isArray(shipment.history) ? shipment.history : [];
  const lastEntry = history.length ? history[history.length - 1] : null;
  return String(lastEntry?.location || "").trim();
}

function buildAdminShipmentMessage(shipment, messageType = "update") {
  const isEnglish = (shipment.preferred_language || "ar") === "en";
  const location = getLatestShipmentLocation(shipment);
  const locationLineEn = location ? `Current Location: ${location}\n` : "";
  const locationLineAr = location ? `الموقع الحالي: ${location}\n` : "";

  if (isEnglish) {
    if (messageType === "create") {
      return `Tatweer Tracking System

Dear Customer,
We would like to inform you that a new shipment has been registered for you with Tatweer Truck Transport Company.

Tracking Number: ${shipment.tracking_number}
Current Status: ${shipment.english_status}
${locationLineEn}Estimated Delivery: ${formatDate(shipment.delivery_date)}

You can track your shipment here:
${shipment.tracking_link}

Thank you for choosing Tatweer.`;
    }

    return `Tatweer Tracking System

Dear Customer,
Your shipment status has been updated successfully by Tatweer Truck Transport Company.

Tracking Number: ${shipment.tracking_number}
Current Status: ${shipment.english_status}
${locationLineEn}Estimated Delivery: ${formatDate(shipment.delivery_date)}

Track your shipment here:
${shipment.tracking_link}

Thank you for choosing Tatweer.`;
  }

  if (messageType === "create") {
    return `نظام تتبع تطوير

عزيزنا العميل،
نفيدكم بأنه تم تسجيل شحنة جديدة لكم لدى شركة تطوير للنقل.

رقم الشحنة: ${shipment.tracking_number}
الحالة الحالية: ${shipment.arabic_status}
${locationLineAr}موعد التسليم المتوقع: ${formatDate(shipment.delivery_date)}

يمكنكم متابعة الشحنة من خلال الرابط التالي:
${shipment.tracking_link}

نشكر ثقتكم في تطوير.`;
  }

  return `نظام تتبع تطوير

عزيزنا العميل،
تم تحديث حالة شحنتكم بنجاح لدى شركة تطوير للنقل.

رقم الشحنة: ${shipment.tracking_number}
الحالة الحالية: ${shipment.arabic_status}
${locationLineAr}موعد التسليم المتوقع: ${formatDate(shipment.delivery_date)}

يمكنكم متابعة الشحنة من خلال الرابط التالي:
${shipment.tracking_link}

نشكر ثقتكم في تطوير.`;
}

function openCustomerUpdateWhatsapp(shipment, messageType = "update") {
  const customerPhone = normalizeWhatsappContactNumber(shipment.phone_number);
  if (!customerPhone) {
    return false;
  }

  const message = buildAdminShipmentMessage(shipment, messageType);
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
    const key = node.dataset.i18n;
    node.textContent = t(key);
  });

  const trackingInput = document.getElementById("trackingInput");
  if (trackingInput) {
    trackingInput.placeholder = t("trackingInputPlaceholder");
  }

  const languageToggle = document.getElementById("languageToggle");
  if (languageToggle) {
    languageToggle.textContent = currentLanguage === "ar" ? "EN" : "AR";
  }

  if (page === "tracking") {
    renderSearchHistory();
    syncSupportWhatsappLink(document.getElementById("trackingInput")?.value || "");
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
  const safeTrackingNumber = trackingNumber || (currentLanguage === "ar" ? "support" : "support");
  whatsappLink.href = buildCustomerWhatsappLink(safeTrackingNumber);
}

function renderShipment(shipment) {
  const headline = document.getElementById("trackingHeadline");
  const statusBadge = document.getElementById("statusBadge");
  const lastUpdateValue = document.getElementById("lastUpdateValue");
  const etaValue = document.getElementById("etaValue");
  const progressValue = document.getElementById("progressValue");
  const progressFill = document.getElementById("progressFill");
  const whatsappLink = document.getElementById("whatsappLink");

  if (!headline || !statusBadge) {
    return;
  }

  headline.textContent = `${t("trackingHeadlinePrefix")}: ${shipment.tracking_number}`;
  statusBadge.textContent =
    currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status;
  lastUpdateValue.textContent = formatDate(shipment.last_update_time);
  etaValue.textContent = formatDate(shipment.delivery_date);
  progressValue.textContent = `${shipment.progress}%`;
  progressFill.style.width = `${shipment.progress}%`;
  whatsappLink.href = buildCustomerWhatsappLink(shipment.tracking_number);

  renderTimeline(shipment.history || []);
}

async function fetchShipment(trackingNumber) {
  const shipment = await api(
    `/api/shipments/${encodeURIComponent(trackingNumber.trim().toUpperCase())}?lang=${currentLanguage}`
  );
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
      notify(error.message === "Shipment not found" ? t("shipmentNotFound") : error.message);
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
      notify(t("shipmentNotFound"));
    }
  });

  document.getElementById("clearHistoryBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.history);
    renderSearchHistory();
  });

  const params = new URLSearchParams(window.location.search);
  const trackingFromUrl = params.get("tracking");
  if (trackingFromUrl) {
    document.getElementById("trackingInput").value = trackingFromUrl;
    fetchShipment(trackingFromUrl).catch(() => {
      notify(t("shipmentNotFound"));
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
  if (!select) {
    return;
  }

  const activeShipments = shipments.filter((shipment) => !isCompletedShipment(shipment));

  if (!activeShipments.length) {
    select.innerHTML = `<option value="">${currentLanguage === "ar" ? "لا توجد شحنات متاحة للتحديث" : "No active shipments to update"}</option>`;
    return;
  }

  select.innerHTML = activeShipments
    .map(
      (shipment) =>
        `<option value="${shipment.tracking_number}">${shipment.tracking_number} - ${
          currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status
        }</option>`
    )
    .join("");
}

function renderAnalytics(shipments) {
  const delivered = shipments.filter((shipment) => shipment.progress >= 100).length;
  document.getElementById("analyticsTotal").textContent = shipments.length;
  document.getElementById("analyticsDelivered").textContent = delivered;
  document.getElementById("analyticsTransit").textContent = shipments.length - delivered;
}

function renderShipmentsTable(shipments) {
  const body = document.getElementById("shipmentsTableBody");
  if (!body) {
    return;
  }

  body.innerHTML = shipments
    .map((shipment) => {
      const currentStatus =
        currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status;
      return `
        <tr>
          <td>${shipment.tracking_number}</td>
          <td>${shipment.phone_number}</td>
          <td>${currentStatus}</td>
          <td>${formatDate(shipment.delivery_date)}</td>
          <td>${formatDate(shipment.last_update_time)}</td>
          <td>${shipment.progress}%</td>
        </tr>
      `;
    })
    .join("");
}

async function loadAdminShipments() {
  const shipments = (await api("/api/shipments")).sort((first, second) => {
    return new Date(second.last_update_time).getTime() - new Date(first.last_update_time).getTime();
  });
  renderShipmentOptions(shipments);
  renderAnalytics(shipments);
  renderShipmentsTable(shipments);
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
      await loadAdminShipments();
      notify(t("loginSuccess"));
    } catch (error) {
      notify(t("loginError"));
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.token);
    setAdminView(false);
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
      await loadAdminShipments();
      const creationWhatsappMessage = createdShipment && openCustomerUpdateWhatsapp(createdShipment, "create")
        ? ` ${t("whatsappOpened")}`
        : "";
      notify(`${t("addShipmentSuccess")}${creationWhatsappMessage}`);
    } catch (error) {
      notify(`${t("addShipmentError")} ${error.message}`);
    }
  });

  document.getElementById("predefinedStatusSelect")?.addEventListener("change", (event) => {
    const preset = PREDEFINED_STATUSES[event.target.value];
    if (!preset) {
      return;
    }
    document.getElementById("updateArabicStatusInput").value = preset.ar;
    document.getElementById("updateEnglishStatusInput").value = preset.en;
    document.getElementById("progressInput").value = preset.progress;
  });

  document.getElementById("updateForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const trackingNumber = document.getElementById("shipmentSelect").value;
    if (!trackingNumber) {
      notify(currentLanguage === "ar" ? "لا توجد شحنة متاحة للتحديث." : "There is no shipment available to update.");
      return;
    }
    const sendWhatsapp = document.getElementById("sendWhatsappCheckbox").checked;
    try {
      const result = await api(`/api/shipments/${encodeURIComponent(trackingNumber)}`, {
        method: "PUT",
        body: JSON.stringify({
          arabic_status: document.getElementById("updateArabicStatusInput").value,
          english_status: document.getElementById("updateEnglishStatusInput").value,
          location: document.getElementById("locationInput").value,
          progress: document.getElementById("progressInput").value,
          send_whatsapp: false
        })
      });
      await loadAdminShipments();
      const notificationMessage = sendWhatsapp && result.shipment && openCustomerUpdateWhatsapp(result.shipment, "update")
        ? ` ${t("whatsappOpened")}`
        : "";
      notify(`${t("updateShipmentSuccess")}${notificationMessage}`);
    } catch (error) {
      notify(`${t("updateShipmentError")} ${error.message}`);
    }
  });

  ensureAdminSession().then(async (loggedIn) => {
    setAdminView(loggedIn);
    if (loggedIn) {
      try {
        await loadAdminShipments();
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
