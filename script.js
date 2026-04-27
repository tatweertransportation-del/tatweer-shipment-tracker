const TRANSLATIONS = {
  en: {
    brandTag: "Global Freight Visibility",
    brandTitle: "Tatweer Shipment Tracking Portal",
    brandSubtitle: "Logistics Company",
    adminBrandTitle: "Tatweer Tracking System Admin",
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
    documentsPasswordAdminHint: "Leave empty to keep the current password. Type a new password only when you want to change it.",
    viewDocuments: "View Documents",
    documentsLoaded: "Shipment documents are ready. You can open or download each file below.",
    noDocuments: "No shipment documents are available yet.",
    documentsError: "Unable to load shipment documents.",
    downloadFile: "Open File",
    saveFile: "Download",
    adminDocumentsTitle: "Shipment Documents",
    adminDocumentsSubtitle: "Upload or replace customer shipment papers",
    shipmentFiles: "Shipment Files",
    sendFilesWhatsapp: "Open WhatsApp message with documents password",
    saveShipmentFiles: "Save Shipment Files",
    shipmentFilesSaved: "Shipment documents were added successfully. Existing files were kept.",
    shipmentFilesError: "Unable to save shipment files.",
    shipmentFilesWhatsappMissingPhone: "Documents were saved, but this shipment has no customer phone number for WhatsApp.",
    shipmentFilesWhatsappBlocked: "Documents were saved, but the browser blocked WhatsApp. Please allow pop-ups and try again.",
    shipmentFilesWhatsappReady: "Documents were saved. Click the WhatsApp button below to send the customer message.",
    openFilesWhatsapp: "Send documents message on WhatsApp",
    uploadProgress: "Uploading file {current} of {total}: {name}",
    uploadComplete: "Upload completed successfully.",
    fileTooLarge: "The file \"{name}\" is too large. Please upload files up to {size} MB each.",
    tabTracking: "Tracking",
    tabDocuments: "Documents",
    tabRating: "Rating",
    tabSuggestions: "Suggestions",
    messagePreview: "Message Preview",
    exportBackup: "Export Backup",
    importBackup: "Import Backup",
    backupExported: "Backup exported successfully.",
    backupImported: "Backup imported successfully.",
    backupImportConfirm: "Importing a backup will replace the current saved data. Continue?",
    filterAll: "All shipments",
    filterActive: "In transit",
    filterDelivered: "Delivered",
    filterFilesAll: "All files",
    filterWithFiles: "With files",
    filterWithoutFiles: "Without files",
    currentShipmentFiles: "Current Shipment Files",
    deleteShipmentFile: "Delete file",
    deleteShipmentFileConfirm: "Delete this file from the shipment documents?",
    deleteShipmentFileSuccess: "Shipment file deleted successfully.",
    deleteShipmentFileError: "Unable to delete shipment file.",
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
    whyTatweerEyebrow: "Why Tatweer",
    whyTatweerTitle: "A professional logistics experience from tracking to delivery",
    whyTatweerText:
      "Tatweer combines live shipment visibility, secure document access, responsive customer support, and disciplined logistics execution to give every shipment a professional flow.",
    whyTatweerLive: "Live visibility",
    whyTatweerLiveText: "Follow status changes, updates, and delivery progress in one place.",
    whyTatweerSecure: "Secure documents",
    whyTatweerSecureText: "Shipment papers stay protected with dedicated access for every shipment.",
    whyTatweerSupport: "Fast support",
    whyTatweerSupportText: "Reach our operations team quickly when you need help with your cargo.",
    whyTatweerFleet: "Trusted execution",
    whyTatweerFleetText: "A qualified team and organized logistics process from start to finish.",
    contactInfoEyebrow: "Connect With Tatweer",
    contactInfoTitle: "Stay close to our team on every route",
    contactInfoText:
      "Use the buttons below to open our official Facebook page, contact support on WhatsApp, or view our office location.",
    facebookButton: "tatweer for logistics",
    facebookButtonHint: "Open Facebook page",
    contactUsButton: "Contact Us",
    contactUsButtonHint: "Open WhatsApp support",
    addressButtonShort: "Our Location",
    addressButton: "10th of Ramadan, Al Ordonia, Shams Mall, 4th Floor",
    addressButtonHint: "Open location on map",
    footerCopyright: "© 2026 Tatweer Logistics Services. All rights reserved.",
    footerLegalNotice:
      "Tatweer name, logo, and brand assets are proprietary and may not be reused without written permission.",
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
    ratingTitle: "Shipment Rating",
    ratingHeadline: "Rate your shipment experience",
    ratingText: "Your feedback helps us improve our logistics service.",
    ratingComment: "Comment",
    ratingPlaceholder: "Write your comment about the shipment experience.",
    submitRating: "Submit Rating",
    ratingSuccess: "Thank you. Your rating was submitted successfully.",
    ratingError: "Unable to submit your rating.",
    ratingsInbox: "Shipment Ratings",
    ratingsInboxSubtitle: "Customer shipment experience ratings",
    ratingDate: "Date",
    ratingScore: "Rating",
    noRatings: "No shipment ratings yet.",
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
    dashboardOverviewEyebrow: "Operations Dashboard",
    dashboardOverviewTitle: "Professional control for every shipment movement",
    dashboardOverviewText:
      "Monitor live logistics performance, jump quickly to the action you need, and keep the operations flow organized from shipment creation to customer delivery.",
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
    withFilesCount: "With Files",
    withoutFilesCount: "Without Files",
    avgRatingMetric: "Average Rating",
    latestUpdateMetric: "Latest Update",
    latestActivity: "Latest Activity",
    latestActivitySubtitle: "Most recently updated shipments",
    noRecentActivity: "No recent shipment activity yet.",
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
    brandTitle: "بوابة تتبع شحنات تطوير",
    brandSubtitle: "شركة لوجستية",
    adminBrandTitle: "لوحة إدارة نظام تتبع تطوير",
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
    documentsPasswordAdminHint: "اتركها فارغة للإبقاء على كلمة المرور الحالية. اكتب كلمة مرور جديدة فقط عند تغييرها.",
    viewDocuments: "عرض الأوراق",
    documentsLoaded: "أوراق الشحنة جاهزة. يمكنك فتح أو تحميل كل ملف من القائمة التالية.",
    noDocuments: "لا توجد أوراق متاحة للشحنة حتى الآن.",
    documentsError: "تعذر تحميل أوراق الشحنة.",
    downloadFile: "فتح الملف",
    saveFile: "تحميل",
    adminDocumentsTitle: "أوراق الشحنة",
    adminDocumentsSubtitle: "رفع وإضافة أوراق الشحنة للعميل",
    shipmentFiles: "ملفات الشحنة",
    sendFilesWhatsapp: "فتح رسالة واتساب بكلمة مرور الأوراق",
    saveShipmentFiles: "حفظ ملفات الشحنة",
    shipmentFilesSaved: "تمت إضافة أوراق الشحنة بنجاح، والملفات القديمة ما زالت محفوظة.",
    shipmentFilesError: "تعذر حفظ ملفات الشحنة.",
    shipmentFilesWhatsappMissingPhone: "تم حفظ أوراق الشحنة، لكن هذه الشحنة ليس بها رقم هاتف للعميل لإرسال واتساب.",
    shipmentFilesWhatsappBlocked: "تم حفظ أوراق الشحنة، لكن المتصفح منع فتح واتساب. برجاء السماح بالنوافذ المنبثقة والمحاولة مرة أخرى.",
    shipmentFilesWhatsappReady: "تم حفظ أوراق الشحنة. اضغط على زر واتساب بالأسفل لإرسال الرسالة للعميل.",
    openFilesWhatsapp: "إرسال رسالة الأوراق على واتساب",
    uploadProgress: "جاري رفع الملف {current} من {total}: {name}",
    uploadComplete: "تم رفع الملفات بنجاح.",
    fileTooLarge: "الملف \"{name}\" حجمه كبير جدًا. برجاء رفع ملفات لا تتجاوز {size} ميجابايت لكل ملف.",
    tabTracking: "التتبع",
    tabDocuments: "الأوراق",
    tabRating: "التقييم",
    tabSuggestions: "الاقتراحات",
    messagePreview: "معاينة الرسالة",
    exportBackup: "تصدير نسخة احتياطية",
    importBackup: "استيراد نسخة احتياطية",
    backupExported: "تم تصدير النسخة الاحتياطية بنجاح.",
    backupImported: "تم استيراد النسخة الاحتياطية بنجاح.",
    backupImportConfirm: "استيراد نسخة احتياطية سيستبدل البيانات الحالية المحفوظة. هل تريد المتابعة؟",
    filterAll: "كل الشحنات",
    filterActive: "قيد الشحن",
    filterDelivered: "تم التسليم",
    filterFilesAll: "كل الملفات",
    filterWithFiles: "لها ملفات",
    filterWithoutFiles: "بدون ملفات",
    currentShipmentFiles: "ملفات الشحنة الحالية",
    deleteShipmentFile: "حذف الملف",
    deleteShipmentFileConfirm: "هل تريد حذف هذا الملف من أوراق الشحنة؟",
    deleteShipmentFileSuccess: "تم حذف ملف الشحنة بنجاح.",
    deleteShipmentFileError: "تعذر حذف ملف الشحنة.",
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
    whyTatweerEyebrow: "لماذا تطوير",
    whyTatweerTitle: "تجربة لوجستية احترافية من التتبع حتى التسليم",
    whyTatweerText:
      "تجمع تطوير بين متابعة مباشرة للشحنة، ووصول آمن إلى المستندات، ودعم سريع، وتنفيذ لوجستي منظم لتقديم تجربة احترافية في كل شحنة.",
    whyTatweerLive: "متابعة مباشرة",
    whyTatweerLiveText: "تابع تغيرات الحالة والتحديثات ونسبة التقدم من مكان واحد.",
    whyTatweerSecure: "مستندات آمنة",
    whyTatweerSecureText: "أوراق الشحنة محمية بصلاحية مخصصة لكل شحنة.",
    whyTatweerSupport: "دعم سريع",
    whyTatweerSupportText: "تواصل بسرعة مع فريق التشغيل عند الحاجة لأي مساعدة.",
    whyTatweerFleet: "تنفيذ موثوق",
    whyTatweerFleetText: "فريق مؤهل وعملية لوجستية منظمة من البداية للنهاية.",
    contactInfoEyebrow: "تواصل مع تطوير",
    contactInfoTitle: "ابق قريبًا من فريقنا في كل مرحلة",
    contactInfoText:
      "استخدم الأزرار التالية لفتح صفحتنا الرسمية على فيسبوك أو التواصل مع الدعم عبر واتساب أو الوصول إلى عنوان المكتب.",
    facebookButton: "tatweer for logistics",
    facebookButtonHint: "افتح صفحة فيسبوك",
    contactUsButton: "تواصل معنا",
    contactUsButtonHint: "افتح واتساب الدعم",
    addressButtonShort: "العنوان",
    addressButton: "العاشر من رمضان ,الاردنيه , مول شمس , الدور الرابع",
    addressButtonHint: "افتح الموقع على الخريطة",
    footerCopyright: "© 2026 تطوير للخدمات اللوجستية. جميع الحقوق محفوظة.",
    footerLegalNotice:
      "اسم تطوير والشعار والهوية التجارية الخاصة بها مملوكة للشركة، ولا يجوز إعادة استخدامها أو نسخها دون إذن كتابي مسبق.",
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
    ratingTitle: "تقييم الشحنة",
    ratingHeadline: "قيّم تجربة الشحنة",
    ratingText: "تقييمك يساعدنا على تحسين خدماتنا اللوجستية.",
    ratingComment: "التعليق",
    ratingPlaceholder: "اكتب تعليقك عن تجربة الشحنة.",
    submitRating: "إرسال التقييم",
    ratingSuccess: "شكرًا لك. تم إرسال تقييمك بنجاح.",
    ratingError: "تعذر إرسال التقييم.",
    ratingsInbox: "تقييمات الشحنات",
    ratingsInboxSubtitle: "تقييمات العملاء لتجربة الشحن",
    ratingDate: "التاريخ",
    ratingScore: "التقييم",
    noRatings: "لا توجد تقييمات حتى الآن.",
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
    dashboardOverviewEyebrow: "لوحة تشغيل الشحنات",
    dashboardOverviewTitle: "تحكم احترافي في كل حركة داخل دورة الشحنة",
    dashboardOverviewText:
      "تابع أداء التشغيل بشكل مباشر، وانتقل بسرعة إلى المهمة التي تريدها، وحافظ على تنظيم سير الشحنات من الإنشاء وحتى التسليم للعميل.",
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
    withFilesCount: "شحنات بها ملفات",
    withoutFilesCount: "شحنات بدون ملفات",
    avgRatingMetric: "متوسط التقييم",
    latestUpdateMetric: "أحدث تحديث",
    latestActivity: "آخر النشاطات",
    latestActivitySubtitle: "أحدث الشحنات التي تم تحديثها",
    noRecentActivity: "لا توجد نشاطات حديثة للشحنات حتى الآن.",
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
  history: "shipment-search-history"
};
const APP_CONFIG = window.APP_CONFIG || {};
const MAX_SHIPMENT_FILE_SIZE_MB = 18;
const MAX_SHIPMENT_FILE_SIZE_BYTES = MAX_SHIPMENT_FILE_SIZE_MB * 1024 * 1024;

let currentLanguage = localStorage.getItem(storageKeys.language) || "en";
let currentTheme = localStorage.getItem(storageKeys.theme) || "dark";
let adminCsrfToken = "";
let lastViewedShipment = null;
let adminState = {
  shipments: [],
  suggestions: [],
  ratings: []
};

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function resolveApiBaseUrl() {
  return normalizeBaseUrl(APP_CONFIG.API_BASE_URL) || window.location.origin;
}

function getCookieValue(name) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length) || "";
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
  let cleaned = normalizeLocalizedDigits(phoneNumber).replace(/[^\d+]/g, "").trim();
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.slice(2);
  }
  cleaned = cleaned.replace(/[^\d]/g, "");
  if (!cleaned) {
    return "";
  }

  // Local mobile numbers are treated as Egypt numbers when no country code is present.
  if (/^0\d+$/.test(cleaned)) {
    return `2${cleaned}`;
  }
  return cleaned;
}

function normalizePhoneWithCountryCode(countryCode, phoneNumber) {
  const code = normalizeLocalizedDigits(countryCode).replace(/[^\d]/g, "");
  let phone = normalizeLocalizedDigits(phoneNumber).replace(/[^\d+]/g, "");
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

function normalizeLocalizedDigits(value) {
  return String(value || "").replace(/[٠-٩۰-۹]/g, (digit) => {
    const arabicIndicDigits = "٠١٢٣٤٥٦٧٨٩";
    const easternArabicIndicDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicIndicIndex = arabicIndicDigits.indexOf(digit);
    if (arabicIndicIndex !== -1) {
      return String(arabicIndicIndex);
    }
    const easternArabicIndicIndex = easternArabicIndicDigits.indexOf(digit);
    if (easternArabicIndicIndex !== -1) {
      return String(easternArabicIndicIndex);
    }
    return digit;
  });
}

function getLatestShipmentLocation(shipment) {
  const history = Array.isArray(shipment.history) ? shipment.history : [];
  const lastEntry = history.length ? history[history.length - 1] : null;
  return String(lastEntry?.location || "").trim();
}

function buildAdminShipmentMessage(shipment, messageType = "update", language = shipment.preferred_language || "ar") {
  const isEnglish = language === "en";
  const messageLocale = isEnglish ? "en-US" : "ar-EG";
  const location = getLatestShipmentLocation(shipment);
  const locationLine = location
    ? isEnglish
      ? `Current Location: ${location}\n`
      : `الموقع الحالي: ${location}\n`
    : "";
  const messageCopy = isEnglish
    ? {
        company: "Tatweer Logistics",
        greeting: "Dear customer,",
        title: messageType === "create" ? "Your shipment has been registered." : "Your shipment has a new update.",
        trackingLabel: "Tracking Number",
        statusLabel: "Current Status",
        deliveryLabel: "Estimated Delivery",
        linkLabel: "Track your shipment here:",
        closing: "At Tatweer, we deliver with care, accuracy, and commitment.",
        thanks: "Thank you for choosing us."
      }
    : {
        company: "تطوير للخدمات اللوجستية",
        greeting: "عزيزنا العميل،",
        title: messageType === "create" ? "تم تسجيل شحنتكم بنجاح." : "يوجد تحديث جديد على شحنتكم.",
        trackingLabel: "رقم الشحنة",
        statusLabel: "الحالة الحالية",
        deliveryLabel: "موعد التسليم المتوقع",
        linkLabel: "رابط التتبع:",
        closing: "في تطوير، نلتزم بالدقة والسرعة والاهتمام بكل تفاصيل شحنتكم.",
        thanks: "نشكركم على ثقتكم بنا."
      };
  const statusText = isEnglish ? shipment.english_status : shipment.arabic_status;
  const deliveryText = formatDate(shipment.delivery_date, messageLocale);

  return `${messageCopy.company}

${messageCopy.greeting}
${messageCopy.title}

${messageCopy.trackingLabel}: ${shipment.tracking_number}
${messageCopy.statusLabel}: ${statusText}
${locationLine}${messageCopy.deliveryLabel}: ${deliveryText}

${messageCopy.linkLabel}
${shipment.tracking_link}

${messageCopy.closing}
${messageCopy.thanks}`;
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

function interpolate(template, values = {}) {
  return Object.entries(values).reduce((text, [key, value]) => {
    return text.replaceAll(`{${key}}`, String(value));
  }, template);
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
    renderAnalytics(adminState.shipments, adminState.suggestions, adminState.ratings);
    renderShipmentsTable(adminState.shipments);
    renderSuggestionsTable(adminState.suggestions);
    renderRatingsTable(adminState.ratings);
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

function formatDate(dateString, localeOverride = "") {
  if (!dateString) {
    return "--";
  }
  const locale = localeOverride || (currentLanguage === "ar" ? "ar-EG" : "en-US");
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
        <div class="history-entry" data-history-item="${escapeHtml(item)}" role="button" tabindex="0">
          <span class="history-code">${escapeHtml(item)}</span>
          <span aria-hidden="true">📦</span>
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
  const method = String(options.method || "GET").toUpperCase();
  const csrfToken = adminCsrfToken || getCookieValue("tatweer_admin_csrf");
  if (!["GET", "HEAD", "OPTIONS"].includes(method) && csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
    credentials: "include"
  });

  const data = await response.json().catch(() => ({}));
  if (data.csrf_token) {
    adminCsrfToken = data.csrf_token;
  }
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
  if (!phone || !message) {
    return "";
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildDocumentsLink(trackingNumber, password) {
  const params = new URLSearchParams({ documents: trackingNumber });
  if (password) {
    params.set("password", password);
  }
  return `${window.location.origin}/?${params.toString()}`;
}

function buildShipmentFilesWhatsappMessage(trackingNumber, password) {
  const documentsLink = buildDocumentsLink(trackingNumber, password);
  if (currentLanguage === "en") {
    return `Tatweer Logistics Services

Dear customer,

Your shipment documents are now available on Tatweer Tracking System.

Shipment Number: ${trackingNumber}
Documents Password: ${password}

Open this secure link to view or download your shipment documents:
${documentsLink}

Important: This password is your responsibility. Please do not share it with anyone to protect your shipment papers and keep your personal data confidential.

Thank you for choosing Tatweer Logistics Services.`;
  }

  return `تطوير للخدمات اللوجستية

عزيزنا العميل،

نود إبلاغكم بأن أوراق الشحنة أصبحت متاحة الآن على نظام Tatweer Tracking System.

رقم الشحنة: ${trackingNumber}
كلمة مرور الأوراق: ${password}

افتح هذا الرابط الآمن لعرض أو تحميل أوراق الشحنة:
${documentsLink}

هام: كلمة المرور هي مسؤوليتك، يرجى عدم مشاركتها مع أي شخص حفاظًا على أوراقك وسرية بياناتك.

شكرًا لاختياركم تطوير للخدمات اللوجستية.`;
}

function renderShipmentFilesWhatsappAction(whatsappUrl = "") {
  const container = document.getElementById("shipmentFilesWhatsappAction");
  if (!container) {
    return;
  }

  if (!whatsappUrl) {
    container.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = `
    <p>${t("shipmentFilesWhatsappReady")}</p>
    <a class="whatsapp-btn" href="${whatsappUrl}" target="_blank" rel="noopener">
      ${t("openFilesWhatsapp")}
    </a>
  `;
}

function renderShipmentFilesMessagePreview(message = "") {
  const preview = document.getElementById("shipmentFilesMessagePreview");
  if (!preview) {
    return;
  }
  if (!message) {
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }
  preview.classList.remove("hidden");
  preview.innerHTML = `
    <strong>${t("messagePreview")}</strong>
    <textarea readonly rows="8">${escapeHtml(message)}</textarea>
  `;
}

function setShipmentFilesUploadStatus(message = "") {
  const status = document.getElementById("shipmentFilesUploadStatus");
  if (!status) {
    return;
  }
  status.textContent = message;
  status.classList.toggle("hidden", !message);
}

function renderAdminShipmentFiles(files = []) {
  const container = document.getElementById("adminShipmentFilesPreview");
  if (!container) {
    return;
  }

  if (!files.length) {
    container.innerHTML = `<div class="empty-state">${t("noDocuments")}</div>`;
    return;
  }

  container.innerHTML = `
    <h4>${t("currentShipmentFiles")}</h4>
    <div class="documents-list">
      ${files
        .map(
          (file) => `
            <article class="document-item">
              <div>
                <strong>${escapeHtml(file.file_name)}</strong>
                <p>${formatDate(file.uploaded_at)}</p>
                <p>${escapeHtml(file.mime_type)} • ${Math.ceil(Number(file.file_size || 0) / 1024)} KB</p>
              </div>
              <button
                class="danger-text-btn compact-btn"
                type="button"
                data-delete-shipment-file="${escapeHtml(file.id)}"
                data-file-name="${escapeHtml(file.file_name)}"
              >
                ${t("deleteShipmentFile")}
              </button>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

async function loadAdminShipmentFiles() {
  const trackingNumber = document.getElementById("filesShipmentSelect")?.value;
  if (!trackingNumber) {
    renderAdminShipmentFiles([]);
    return;
  }

  try {
    const result = await api(`/api/admin/shipment-files/${encodeURIComponent(trackingNumber)}`);
    renderAdminShipmentFiles(result.files || []);
  } catch (error) {
    renderAdminShipmentFiles([]);
  }
}

async function deleteShipmentFileFromAdmin(fileId) {
  const trackingNumber = document.getElementById("filesShipmentSelect")?.value;
  if (!trackingNumber || !fileId) {
    return;
  }

  const result = await api(
    `/api/admin/shipment-files/${encodeURIComponent(trackingNumber)}/${encodeURIComponent(fileId)}`,
    { method: "DELETE" }
  );
  renderAdminShipmentFiles(result.files || []);
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

function syncPublicContactLinks() {
  const facebookUrl =
    APP_CONFIG.FACEBOOK_PAGE_URL || "https://www.facebook.com/profile.php?id=61578351116421";
  const mapUrl =
    APP_CONFIG.OFFICE_MAP_URL || "https://maps.app.goo.gl/eyDLE6YMAkQst1qK8?g_st=iw";
  const supportUrl = buildCustomerWhatsappLink("support");

  const facebookLink = document.getElementById("facebookPageLink");
  if (facebookLink) {
    facebookLink.href = facebookUrl;
  }

  const supportLink = document.getElementById("supportContactLink");
  if (supportLink) {
    supportLink.href = supportUrl;
  }

  const officeLink = document.getElementById("officeLocationLink");
  if (officeLink) {
    officeLink.href = mapUrl;
  }
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
      const downloadHref = `${href}&download=1`;
      return `
        <article class="document-item">
          <div>
            <strong>${escapeHtml(file.file_name)}</strong>
            <p>${formatDate(file.uploaded_at)}</p>
            <p>${escapeHtml(file.mime_type)} • ${Math.ceil(Number(file.file_size || 0) / 1024)} KB</p>
          </div>
          <div class="document-actions">
            <a class="ghost-outline-btn" href="${href}" target="_blank" rel="noopener">${t("downloadFile")}</a>
            <a class="primary-btn" href="${downloadHref}">${t("saveFile")}</a>
          </div>
        </article>
      `;
    })
    .join("");

  container.insertAdjacentHTML("afterbegin", `<div class="feedback-box">${t("documentsLoaded")}</div>`);
}

function setRatingStars(value) {
  const rating = Math.max(1, Math.min(5, Number(value || 5)));
  const input = document.getElementById("ratingValueInput");
  if (input) {
    input.value = String(rating);
  }

  document.querySelectorAll("#ratingStars [data-rating]").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.rating) <= rating);
  });
}

async function submitRating() {
  return api("/api/ratings", {
    method: "POST",
    body: JSON.stringify({
      tracking_number: document.getElementById("ratingTrackingInput")?.value || "",
      rating: Number(document.getElementById("ratingValueInput")?.value || 5),
      comment: document.getElementById("ratingCommentInput")?.value || "",
      language: currentLanguage
    })
  });
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
  const response = await fetch(
    buildApiUrl(`/api/shipments/export.xls?lang=${encodeURIComponent(currentLanguage)}`),
    {
      credentials: "include"
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

async function downloadBackup() {
  const response = await fetch(buildApiUrl("/api/backup"), {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Unable to export backup.");
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `tatweer-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

async function importBackupFile(file) {
  const text = await file.text();
  const backup = JSON.parse(text);
  await api("/api/backup/import", {
    method: "POST",
    body: JSON.stringify(backup)
  });
}

function setupTrackingPage() {
  renderSearchHistory();
  renderTimeline([]);
  syncSupportWhatsappLink();
  syncPublicContactLinks();

  const customerTabs = Array.from(document.querySelectorAll("[data-customer-tab]"));
  const customerPanels = Array.from(document.querySelectorAll("[data-customer-panel]"));

  const setActiveCustomerTab = (selectedTab) => {
    customerTabs.forEach((tabButton) => {
      tabButton.classList.toggle("active", tabButton.dataset.customerTab === selectedTab);
    });
  };

  customerTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.customerTab;
      const selectedPanel = customerPanels.find((panel) => panel.dataset.customerPanel === selectedTab);
      setActiveCustomerTab(selectedTab);
      selectedPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const customerSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleEntry?.target?.dataset?.customerPanel) {
        setActiveCustomerTab(visibleEntry.target.dataset.customerPanel);
      }
    },
    {
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0.2, 0.4, 0.6]
    }
  );

  customerPanels.forEach((panel) => {
    customerSectionObserver.observe(panel);
  });

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

  setRatingStars(5);

  document.getElementById("ratingStars")?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-rating]");
    if (target) {
      setRatingStars(target.dataset.rating);
    }
  });

  document.getElementById("ratingForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await submitRating();
      event.target.reset();
      setRatingStars(5);
      notify(t("ratingSuccess"));
    } catch (error) {
      notify(`${t("ratingError")} ${error.message}`);
    }
  });

  document.getElementById("copyTrackingLinkBtn")?.addEventListener("click", (event) => {
    const trackingNumber = event.currentTarget.dataset.trackingNumber;
    if (trackingNumber) {
      copyTrackingLink(trackingNumber);
    }
  });

  const openHistoryShipment = async (target) => {
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
  };

  const historyList = document.getElementById("searchHistoryList");
  historyList?.addEventListener("click", async (event) => {
    const target = event.target.closest(".history-entry[data-history-item]");
    await openHistoryShipment(target);
  });

  historyList?.addEventListener("keydown", async (event) => {
    if (!["Enter", " "].includes(event.key)) {
      return;
    }
    const target = event.target.closest(".history-entry[data-history-item]");
    if (!target) {
      return;
    }
    event.preventDefault();
    await openHistoryShipment(target);
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
  const documentsFromUrl = params.get("documents");
  const documentsPasswordFromUrl = params.get("password") || params.get("documents_password");
  const trackingFromUrl = params.get("tracking") || documentsFromUrl;
  if (trackingFromUrl) {
    document.getElementById("trackingInput").value = trackingFromUrl;
    const documentsTrackingInput = document.getElementById("documentsTrackingInput");
    if (documentsTrackingInput) {
      documentsTrackingInput.value = trackingFromUrl;
    }
    const ratingTrackingInput = document.getElementById("ratingTrackingInput");
    if (ratingTrackingInput) {
      ratingTrackingInput.value = trackingFromUrl;
    }
    const suggestionTrackingInput = document.getElementById("suggestionTrackingInput");
    if (suggestionTrackingInput) {
      suggestionTrackingInput.value = trackingFromUrl;
    }
    fetchShipment(trackingFromUrl).catch(() => {
      renderShipmentNotFound(trackingFromUrl);
    });
  }

  if (documentsFromUrl) {
    setActiveCustomerTab("documents");
    document.querySelector('[data-customer-panel="documents"]')?.scrollIntoView({ behavior: "smooth", block: "start" });
    const documentsTrackingInput = document.getElementById("documentsTrackingInput");
    const documentsPasswordInput = document.getElementById("documentsPasswordInput");
    if (documentsTrackingInput) {
      documentsTrackingInput.value = documentsFromUrl;
    }
    if (documentsPasswordInput && documentsPasswordFromUrl) {
      documentsPasswordInput.value = documentsPasswordFromUrl;
    }
    if (documentsPasswordFromUrl) {
      lookupDocuments(documentsFromUrl, documentsPasswordFromUrl).catch(() => {
        document.getElementById("documentsResult").innerHTML = `<div class="empty-state">${t("documentsError")}</div>`;
      });
    }
  }
}

async function ensureAdminSession() {
  try {
    const session = await api("/api/session");
    adminCsrfToken = session.csrf_token || getCookieValue("tatweer_admin_csrf");
    return true;
  } catch (error) {
    adminCsrfToken = "";
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
    loadAdminShipmentFiles();
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

function renderAnalytics(shipments, suggestions, ratings = []) {
  const delivered = shipments.filter((shipment) => shipment.progress >= 100).length;
  const withFiles = shipments.filter((shipment) => Number(shipment.files_count || 0) > 0).length;
  const withoutFiles = shipments.length - withFiles;
  const suggestionsCount = Array.isArray(suggestions) ? suggestions.length : 0;
  const avgRating = ratings.length
    ? (ratings.reduce((sum, rating) => sum + Number(rating.rating || 0), 0) / ratings.length).toFixed(1)
    : "0.0";
  const latestShipment = shipments
    .slice()
    .sort((first, second) => new Date(second.last_update_time).getTime() - new Date(first.last_update_time).getTime())[0];
  document.getElementById("analyticsTotal").textContent = shipments.length;
  document.getElementById("analyticsDelivered").textContent = delivered;
  document.getElementById("analyticsTransit").textContent = shipments.length - delivered;
  const withFilesNode = document.getElementById("analyticsWithFiles");
  if (withFilesNode) withFilesNode.textContent = withFiles;
  const withoutFilesNode = document.getElementById("analyticsWithoutFiles");
  if (withoutFilesNode) withoutFilesNode.textContent = withoutFiles;
  const avgRatingNode = document.getElementById("analyticsAvgRating");
  if (avgRatingNode) avgRatingNode.textContent = avgRating;
  const latestUpdateNode = document.getElementById("analyticsLatestUpdate");
  if (latestUpdateNode) latestUpdateNode.textContent = latestShipment ? formatDate(latestShipment.last_update_time) : "--";
  const suggestionsNode = document.getElementById("analyticsSuggestions");
  if (suggestionsNode) {
    suggestionsNode.textContent = suggestionsCount;
  }
  const activityNode = document.getElementById("analyticsRecentList");
  if (activityNode) {
    const recentShipments = shipments
      .slice()
      .sort((first, second) => new Date(second.last_update_time).getTime() - new Date(first.last_update_time).getTime())
      .slice(0, 5);
    activityNode.innerHTML = recentShipments.length
      ? recentShipments
          .map(
            (shipment) => `
              <article class="activity-item">
                <div>
                  <strong>${escapeHtml(shipment.tracking_number)}</strong>
                  <p>${escapeHtml(currentLanguage === "ar" ? shipment.arabic_status : shipment.english_status)}</p>
                </div>
                <div class="activity-meta">
                  <span>${shipment.progress}%</span>
                  <small>${formatDate(shipment.last_update_time)}</small>
                </div>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">${t("noRecentActivity")}</div>`;
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
  const statusFilter = document.getElementById("shipmentStatusFilter")?.value || "all";
  const filesFilter = document.getElementById("shipmentFilesFilter")?.value || "all";
  const visibleShipments = shipments
    .filter((shipment) => {
      if (statusFilter === "active" && isCompletedShipment(shipment)) return false;
      if (statusFilter === "delivered" && !isCompletedShipment(shipment)) return false;
      if (filesFilter === "with-files" && !Number(shipment.files_count || 0)) return false;
      if (filesFilter === "without-files" && Number(shipment.files_count || 0)) return false;
      return true;
    })
    .filter((shipment) => {
      if (!searchValue) return true;
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
      });

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

function renderRatingsTable(ratings) {
  const body = document.getElementById("ratingsTableBody");
  if (!body) {
    return;
  }

  if (!ratings.length) {
    body.innerHTML = `
      <tr>
        <td colspan="4" class="empty-table">${t("noRatings")}</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = ratings
    .map(
      (item) => `
        <tr>
          <td>${formatDate(item.created_at)}</td>
          <td>${escapeHtml(item.tracking_number)}</td>
          <td><span class="rating-readonly">${"★".repeat(Number(item.rating || 0))}${"☆".repeat(5 - Number(item.rating || 0))}</span></td>
          <td>${escapeHtml(item.comment || "--")}</td>
        </tr>
      `
    )
    .join("");
}

async function loadAdminData() {
  const [shipments, suggestions, ratings] = await Promise.all([
    api("/api/shipments"),
    api("/api/suggestions"),
    api("/api/ratings")
  ]);

  const sortedShipments = shipments.sort((first, second) => {
    return new Date(second.last_update_time).getTime() - new Date(first.last_update_time).getTime();
  });

  const sortedSuggestions = suggestions.sort((first, second) => {
    return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
  });

  adminState = {
    shipments: sortedShipments,
    suggestions: sortedSuggestions,
    ratings
  };

  renderShipmentOptions(sortedShipments);
  syncSelectedShipmentNotes();
  renderAnalytics(sortedShipments, sortedSuggestions, ratings);
  renderShipmentsTable(sortedShipments);
  renderSuggestionsTable(sortedSuggestions);
  renderRatingsTable(ratings);
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
  const shouldOpenWhatsapp = Boolean(document.getElementById("sendFilesWhatsappCheckbox")?.checked);

  if (!trackingNumber || !files.length) {
    throw new Error("Missing files data");
  }

  const oversizedFile = files.find((file) => file.size > MAX_SHIPMENT_FILE_SIZE_BYTES);
  if (oversizedFile) {
    throw new Error(
      interpolate(t("fileTooLarge"), {
        name: oversizedFile.name,
        size: MAX_SHIPMENT_FILE_SIZE_MB
      })
    );
  }

  let result = null;
  for (const [index, file] of files.entries()) {
    setShipmentFilesUploadStatus(
      interpolate(t("uploadProgress"), {
        current: index + 1,
        total: files.length,
        name: file.name
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    const payloadFile = await fileToPayload(file);
    result = await api(`/api/admin/shipment-files/${encodeURIComponent(trackingNumber)}`, {
      method: "POST",
      body: JSON.stringify({
        password,
        files: [payloadFile]
      })
    });
  }

  if (shouldOpenWhatsapp) {
    const whatsappMessage = buildShipmentFilesWhatsappMessage(
      trackingNumber,
      result.documents_password || password
    );
    renderShipmentFilesMessagePreview(whatsappMessage);
    const whatsappUrl = buildCustomerFilesWhatsappLink(result.phone_number, whatsappMessage);
    if (!whatsappUrl) {
      result.whatsapp_warning = t("shipmentFilesWhatsappMissingPhone");
    } else {
      result.whatsapp_url = whatsappUrl;
      result.whatsapp_ready = true;
    }
  }

  return result;
}

function setupAdminPage() {
  localStorage.removeItem("shipment-admin-token");

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
      adminCsrfToken = data.csrf_token || getCookieValue("tatweer_admin_csrf");
      setAdminView(true);
      await loadAdminData();
      notify(t("loginSuccess"));
    } catch (error) {
      notify(t("loginError"));
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
      await api("/api/logout", {
        method: "POST",
        body: JSON.stringify({})
      });
    } catch (error) {
      // Ignore logout transport errors and still clear the local admin view.
    }
    adminCsrfToken = "";
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
  document.getElementById("exportBackupBtn")?.addEventListener("click", async () => {
    try {
      await downloadBackup();
      notify(t("backupExported"));
    } catch (error) {
      notify(error.message || t("loadShipmentsError"));
    }
  });
  document.getElementById("importBackupInput")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file || !window.confirm(t("backupImportConfirm"))) {
      event.target.value = "";
      return;
    }
    try {
      await importBackupFile(file);
      await loadAdminData();
      notify(t("backupImported"));
    } catch (error) {
      notify(error.message || t("loadShipmentsError"));
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("shipmentSearchInput")?.addEventListener("input", () => {
    renderShipmentsTable(adminState.shipments);
  });
  document.getElementById("shipmentStatusFilter")?.addEventListener("change", () => {
    renderShipmentsTable(adminState.shipments);
  });
  document.getElementById("shipmentFilesFilter")?.addEventListener("change", () => {
    renderShipmentsTable(adminState.shipments);
  });

  document.getElementById("shipmentSelect")?.addEventListener("change", () => {
    syncSelectedShipmentNotes();
  });

  document.getElementById("filesShipmentSelect")?.addEventListener("change", () => {
    renderShipmentFilesWhatsappAction();
    loadAdminShipmentFiles();
  });

  document.getElementById("adminShipmentFilesPreview")?.addEventListener("click", async (event) => {
    const deleteButton = event.target.closest("[data-delete-shipment-file]");
    if (!deleteButton) {
      return;
    }

    const confirmed = window.confirm(t("deleteShipmentFileConfirm"));
    if (!confirmed) {
      return;
    }

    try {
      await deleteShipmentFileFromAdmin(deleteButton.dataset.deleteShipmentFile);
      notify(t("deleteShipmentFileSuccess"));
    } catch (error) {
      notify(`${t("deleteShipmentFileError")} ${error.message}`);
    }
  });

  document.getElementById("shipmentFilesForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    renderShipmentFilesWhatsappAction();
    renderShipmentFilesMessagePreview();
    const submitButton = document.getElementById("saveShipmentFilesBtn");
    if (submitButton) {
      submitButton.disabled = true;
    }
    try {
      const result = await saveShipmentFilesFromAdmin();
      event.target.reset();
      renderShipmentOptions(adminState.shipments);
      renderAdminShipmentFiles(result.files || []);
      renderShipmentFilesWhatsappAction(result.whatsapp_url);
      const whatsappNote = result.whatsapp_warning || (result.whatsapp_ready ? ` ${t("shipmentFilesWhatsappReady")}` : "");
      setShipmentFilesUploadStatus(t("uploadComplete"));
      notify(`${t("shipmentFilesSaved")}${whatsappNote ? ` ${whatsappNote}` : ""}`);
    } catch (error) {
      setShipmentFilesUploadStatus("");
      notify(`${t("shipmentFilesError")} ${error.message}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
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
      const createBilingualWhatsapp = document.getElementById("createBilingualWhatsappCheckbox").checked;
      const createdShipment = await api("/api/shipments", {
        method: "POST",
        body: JSON.stringify({
          tracking_number: normalizeLocalizedDigits(document.getElementById("trackingNumberInput").value).trim(),
          phone_number: normalizeLocalizedDigits(document.getElementById("customerPhoneInput").value).trim(),
          arabic_status: document.getElementById("arabicStatusInput").value,
          english_status: document.getElementById("englishStatusInput").value,
          preferred_language: document.getElementById("preferredLanguageInput").value,
          delivery_date: normalizeLocalizedDigits(document.getElementById("deliveryDateInput").value).trim(),
          progress: document.getElementById("createProgressInput").value
        })
      });

      event.target.reset();
      document.getElementById("preferredLanguageInput").value = "ar";
      document.getElementById("createProgressInput").value = "25";
      await loadAdminData();

      const opened =
        createdShipment && openCustomerUpdateWhatsapp(createdShipment, "create", createBilingualWhatsapp);
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
