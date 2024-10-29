import React from 'react';
import Header from './Header';
import './Home.css'; // Custom CSS for homepage
import "./style/ProjectStyle.css";

const Homepage = () => {
  return (
    <div>
      <Header />
      <header>
        
      </header>
      <div className="homepage-container">
        {/* Main Intro Section */}
        <div className="intro-section">
          <div className="intro-text">
            <h1>ابدأ رحلتك التطوعية الآن</h1>
            <p>
            فرص تطوعية متنوعة. اكتسب الأجر, وطور مهارات جديدة، وتواصل مع الآخرين،
             وكن جزءاً من تغيير إيجابي حقيقي. تعلّم من التجارب العملية في بيئة داعمة وملهمة
            </p>
            <button className="start-button">ابدأ</button>
          </div>
          <div className="intro-logo-section">
            <img src='public\homepage_plant.png' alt="Logos" />
          </div>
        </div>

        {/* Card Grid Section */}
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card">
            <div className="card-content">
              <h2>المزيد</h2>
              <div className="intro-logo-section" id="hjaj">
            <img src='public\more.png' alt="Logos" />
          </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="card-content">
              <h2>الصحية</h2>
              <p>كن شريكًا في نشر الوعي الصحي والمساهمة في تحسين الرعاية الصحية للمجتمع
              </p>
              <div className="intro-logo-section" id="hjaj">
            <img src='public\health.png' alt="Logos" />
          </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="card-content">
              <h2>البيئة</h2>
              <p>ساهم في الحفاظ على البيئة كن جزءًا من الجهود  لأجل مستقبل أكثر خضرة
              
              </p>
              <div className="intro-logo-section" id="hjaj">
            <img src='public\environment.png' alt="Logos" />
          </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card">
            <div className="card-content">
              <h2>ضيوف الرحمن</h2>
              <p>تشرف بخدمة ضيوف الرحمن اغتنم فرصة كسب الأجر والثواب من الله بخدمة ضيوف الرحمن
              </p>
              <div className="intro-logo-section" id="hjaj">
            <img src='public\hjaj.png' alt="Logos" />
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
