
const welcomeEmail = (name) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            direction: rtl;
            text-align: right;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            direction: rtl;
            text-align: right;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 150px;
            height: auto;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #eee;
        }
        .content {
            padding: 20px 0;
            direction: rtl;
            text-align: right;
        }
        .features {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            direction: rtl;
            text-align: right;
        }
        .features ul {
            padding-right: 20px;
            padding-left: 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo">
            <img src="./SahmLogo_hamad.png" alt="Sahm Logo">
        </div>
        
        <div class="header">
            <h1>مرحباً بك في منصة ساهم!</h1>
        </div>
        
        <div class="content">
            <p>عزيزي ${name}،</p>
            
            <p>شكراً لانضمامك إلينا! يسعدنا أن نرحب بك في منصتنا.</p>
            
            <p>تم تأكيد تسجيلك بنجاح، ويمكنك الآن الاستفادة من جميع خدماتنا ومميزاتنا.</p>
            
            <div class="features">
                <h3>للبدء:</h3>
                <ul>
                    <li>قم بتسجيل الدخول إلى حسابك</li>
                    <li>استكشف منصتنا</li>
                </ul>
            </div>
            
            <p>إذا كان لديك أي استفسار، فريق خدمة العملاء لدينا جاهز لمساعدتك على مدار الساعة.</p>
        </div>
        
        <div class="footer">
            <p>مع أطيب التحيات،<br>منصة ساهم</p>
        </div>
    </div>
</body>
</html>`;

const acceptEmail = (name, opportunityName) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            direction: rtl;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: right;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #eee;
            color: #28a745;
        }
        
        .content {
            padding: 20px 0;
        }
        
        .important-info {
            background: #f8f9fa;
            padding: 15px 20px;
            border-radius: 5px;
            margin: 15px 0;
            border-right: 4px solid #28a745;
        }
        
        .important-info ul {
            margin: 0;
            padding-right: 20px;
            list-style-position: inside;
        }
        
        .important-info li {
            margin: 8px 0;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
        
        p, h1, h2, h3, li {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>تم قبول طلبك!</h1>
        </div>
        
        <div class="content">
            <p>مرحباً ${name}،</p>
            
            <p>يسعدنا إخبارك بأنه تم قبول طلبك للمشاركة في الفرصة التطوعية "${opportunityName}".</p>
            
            <div class="important-info">
                <h3>الخطوات القادمة:</h3>
                <ul>
                    <li>سيتم التواصل معك قريباً لتزويدك بالتفاصيل الكاملة</li>
                    <li>يرجى الاطلاع على تفاصيل الفرصة التطوعية في حسابك</li>
                    <li>تأكد من الالتزام بالمواعيد المحددة</li>
                </ul>
            </div>
            
            <p>نتطلع إلى مساهمتك معنا!</p>
        </div>
        
        <div class="footer">
            <p>مع أطيب التحيات،<br>فريق منصة ساهم</p>
        </div>
    </div>
</body>
</html>`;

const rejectEmail = (name, opportunityName) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            direction: rtl;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: right;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #eee;
            color: #dc3545;
        }
        
        .content {
            padding: 20px 0;
        }
        
        .alternative-options {
            background: #f8f9fa;
            padding: 15px 20px;
            border-radius: 5px;
            margin: 15px 0;
            border-right: 4px solid #17a2b8;
        }
        
        .alternative-options ul {
            margin: 0;
            padding-right: 20px;
            list-style-position: inside;
        }
        
        .alternative-options li {
            margin: 8px 0;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
        
        p, h1, h2, h3, li {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>إشعار بخصوص طلب التطوع</h1>
        </div>
        
        <div class="content">
            <p>مرحباً ${name}،</p>
            
            <p>نشكر اهتمامك بالتطوع في "${opportunityName}". نود إعلامك أنه للأسف لم يتم قبول طلبك في هذه الفرصة.</p>
            
            <div class="alternative-options">
                <h3>لا تدع هذا يثبط عزيمتك!</h3>
                <ul>
                    <li>هناك العديد من الفرص التطوعية الأخرى المتاحة</li>
                    <li>يمكنك استكشاف فرص جديدة من خلال منصتنا</li>
                    <li>نشجعك على التقدم لفرص أخرى تناسب مهاراتك واهتماماتك</li>
                </ul>
            </div>
            
            <p>نقدر اهتمامك بالعمل التطوعي ونتمنى أن نراك في فرص قادمة.</p>
        </div>
        
        <div class="footer">
            <p>مع أطيب التحيات،<br>فريق منصة ساهم</p>
        </div>
    </div>
</body>
</html>`;
const resetPasswordEmail = (name, otp) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
            direction: rtl;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: right;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #eee;
            color: #007bff;
        }
        
        .content {
            padding: 20px 0;
        }
        
        .otp-container {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #007bff;
            padding: 10px 20px;
            background: #ffffff;
            border: 2px dashed #007bff;
            border-radius: 5px;
            margin: 10px 0;
        }
        
        .warning-info {
            background: #fff3cd;
            padding: 15px 20px;
            border-radius: 5px;
            margin: 15px 0;
            border-right: 4px solid #ffc107;
        }
        
        .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
        }
        
        p, h1, h2, h3, li {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>رمز التحقق لإعادة تعيين كلمة المرور</h1>
        </div>
        
        <div class="content">
            <p>مرحباً ${name}،</p>
            
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة ساهم. استخدم رمز التحقق التالي لإكمال العملية:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="warning-info">
                <h3>ملاحظات مهمة:</h3>
                <p>• سينتهي رمز التحقق خلال ساعة واحدة من الآن</p>
                <p>• إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني</p>
                <p>• لا تشارك رمز التحقق مع أي شخص لحماية حسابك</p>
            </div>
            
            <p>إذا واجهت أي مشكلة، لا تتردد في التواصل مع فريق الدعم.</p>
        </div>
        
        <div class="footer">
            <p>مع أطيب التحيات،<br>فريق منصة ساهم</p>
        </div>
    </div>
</body>
</html>`;
module.exports = { 
    welcomeEmail,
    acceptEmail,
    rejectEmail,
    resetPasswordEmail
};