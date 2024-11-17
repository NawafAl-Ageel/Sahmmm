import React, { useState } from 'react';
import Header from './Header'; // Import Header for navigation
import './FAQ.css';

const faqData = [
  {
    category: "عام",
    questions: [
      {
        question: "ما هي منصة ساهم؟",
        answer: ".ساهم هي منصة تهدف إلى تسهيل عملية التطوع وربط المتطوعين بالفرص المتاحة داخل وخارج السعودية وللمنظات تقديم فرص للتطوع",
      },
      {
        question: "من يمكنه استخدام منصة ساهم؟",
        answer: "المنصة مفتوحة للجميع، سواء كنت متطوعًا تبحث عن فرص أو منظمة تبحث عن متطوعين.",
      },
    ],
  },
  {
    category: "للمتطوعين",
    questions: [
      {
        question: "كيف يمكنني البحث عن فرصة تطوعية؟",
        answer: "يمكنك استخدام الصفحة الرئيسية للمتطوع والبحث عن الفرص باستخدام الفلاتر مثل الموقع، الفئة، والتاريخ.",
      },
      {
        question: "هل يمكنني التسجيل في أكثر من فرصة تطوعية؟",
        answer: "نعم، يمكنك التسجيل في عدة فرص، ولكن تأكد من التزامك بالفرص التي تسجل فيها.",
      },
      {
        question: "كيف أعرف حالة طلبي للمشاركة؟",
        answer: "يمكنك التحقق من حالة طلباتك من خلال صفحة الفرصة, وستصلك رسالة عبر البريد الإلكتروني حال قبولك في الفرصة.",
      },
    ],
  },
  {
    category: "للمنظمات",
    questions: [
      {
        question: "كيف أضيف فرصة تطوعية جديدة؟",
        answer: "يمكنك إضافة فرصة من خلال لوحة التحكم الخاصة بك بالنقر على 'نشر فرصة' وملء البيانات المطلوبة.",
      },
      {
        question: "كيف يمكنني إدارة طلبات المتطوعين؟",
        answer: "يمكنك إدارة طلبات المتطوعين من صفحة 'طلبات المشاركة' ومراجعة وقبول أو رفض الطلبات.",
      },
      {
        question: "هل يمكنني تعديل أو حذف فرصة تطوعية؟",
        answer: "نعم، يمكنك تعديل أو حذف الفرصة من خلال صفحة 'تعديل وحذف الفرص' في لوحة التحكم الخاصة بك.",
      },
    ],
  },
  {
    category: "الدعم الفني",
    questions: [
      {
        question: "نسيت كلمة المرور، كيف أستعيدها؟",
        answer: "يمكنك استخدام خيار 'نسيت كلمة المرور' على صفحة تسجيل الدخول لاستعادة حسابك.",
      },
      {
        question: "الصفحة لا تعمل بشكل صحيح، ماذا أفعل؟",
        answer: "حاول تحديث الصفحة أو التأكد من اتصالك بالإنترنت. إذا استمرت المشكلة، يمكنك التواصل مع الدعم الفني.",
      },
      {
        question: "كيف أبلغ عن مشكلة؟",
        answer: "sahmuserservices@gmail.com يمكنك الإبلاغ عن مشكلة من خلال مراسلتنا عبر البريد الإلكتروني المخصص للدعم.",
      },
    ],
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <>
    <Header /> {/* Add the Header for navigation */}
    <br></br>
    <div className="faq-container">
      {/* Import font style */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap');
        `}
      </style>
      
      <h1 className="faq-title">الأسئلة الشائعة</h1>
      {faqData.map((category, catIndex) => (
        <div key={catIndex} className="faq-category">
          <h2 className="faq-category-title">{category.category}</h2>
          {category.questions.map((item, index) => (
            <div key={index} className="faq-item">
              <div
                className={`faq-question ${expanded === `${catIndex}-${index}` ? 'active' : ''}`}
                onClick={() => handleToggle(`${catIndex}-${index}`)}
              >
                {item.question}
                <span className="arrow">{expanded === `${catIndex}-${index}` ? '▲' : '▼'}</span>
              </div>
              <div
                className={`faq-answer ${
                  expanded === `${catIndex}-${index}` ? 'faq-show' : 'faq-hide'
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
};

export default FAQ;
