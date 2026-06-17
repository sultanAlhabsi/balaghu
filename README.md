# بلغوا عني ولو آية

تطبيق موبايل مبني باستخدام **React Native + Expo** لعرض آيات قرآنية جاهزة للنسخ والمشاركة والنشر على منصة X.

التطبيق يدعم الوضعين الفاتح والداكن، خطوط عربية مخصصة، بطاقات أنيقة للآيات، وسحب للأسفل لتحديث الآيات.

---

## المميزات

- عرض 3 آيات قرآنية في الشاشة الرئيسية.
- كل آية داخل بطاقة مستقلة بتصميم حديث وخفيف.
- نسخ الآية بتنسيق جاهز للنشر.
- مشاركة الآية عبر نافذة المشاركة الافتراضية في الهاتف.
- فتح شاشة إنشاء منشور في X مع إدراج نص الآية تلقائياً.
- دعم Light Mode و Dark Mode مع زر تبديل داخل التطبيق.
- أنميشن ناعم عند تغيير الثيم.
- Pull to Refresh لتحديث الآيات واستبدالها بآيات مختلفة.
- مساحة آمنة أسفل المحتوى لتجنب تداخل البطاقات مع شريط التنقل.
- خطوط محلية:
  - `Amiri Quran` للآيات.
  - `IBM Plex Sans Arabic` للواجهة.

---

## تنسيق النص عند النسخ أو النشر

يتم تجهيز نص الآية بهذا الشكل:

```text
يقول النبي ﷺ : «بلغوا عني ولو آية»

﴿ نص الآية ۝رقم الآية﴾

#بلغوا_عنّي_ولو_آية
#سورة_اسم_السورة
```

---

## المتطلبات

- Node.js >= 18.0.0
- npm
- Expo Go على الهاتف، أو بيئة Expo للتطوير

---

## التثبيت

```bash
npm install
```

---

## تشغيل التطبيق

```bash
# تشغيل Expo
npm start

# تشغيل على Android
npm run android

# تشغيل على iOS
npm run ios

# تشغيل على Web
npm run web
```

بعد تشغيل `npm start`، امسح QR باستخدام Expo Go.

---

## هيكل واجهة الموبايل

```text
App.js
app.json
assets/
└── fonts/
    ├── AmiriQuran-Regular.ttf
    ├── IBMPlexSansArabic-Regular.ttf
    ├── IBMPlexSansArabic-SemiBold.ttf
    └── IBMPlexSansArabic-Bold.ttf
src/mobile/
├── components/
│   ├── ActionButton.js
│   ├── AyahCard.js
│   ├── Snackbar.js
│   └── XLogo.js
├── data/
│   └── ayahs.js
├── screens/
│   └── HomeScreen.js
├── theme/
│   ├── colors.js
│   └── typography.js
└── utils/
    └── openXCompose.js
```

---

## البيانات والتحديث

توجد الآيات حالياً في ملف محلي:

```text
src/mobile/data/ayahs.js
```

يحتوي الملف على:

- قائمة آيات مناسبة للنشر على X.
- تنسيق نص التغريدة.
- دالة `selectRandomAyahs` لاختيار 3 آيات.
- محاولة تجنب تكرار نفس الآيات مباشرة بعد Pull to Refresh.

يمكن لاحقاً استبدال المصدر المحلي بـ API مع الحفاظ على نفس واجهة الاختيار.

## التحقق

يمكن التأكد من أن التطبيق يتجمع بنجاح عبر:

```bash
npx expo export --platform android --output-dir .expo-check
```

بعد الاختبار يمكن حذف مجلد `.expo-check`.

---

## الترخيص

MIT
