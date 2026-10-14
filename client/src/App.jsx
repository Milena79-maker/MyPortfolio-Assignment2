import './App.css'
import profilePhoto from './assets/profile.jpg'
import salonEaseImage from './assets/salonease.png';
import reactPortfolioImage from './assets/reactportfolio.png';
import oracleSqlImage from './assets/oraclesql.png';
function App() {
  return (
    <div>
      <header>
        <h2>MH Portfolio</h2>

        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#education">Education</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="home">
        <h1>Welcome to My Portfolio</h1>

        <p>
          Hi, I'm Milena Harrison. I'm a Software Engineering Technician
          student with an interest in web development, programming,
          and software applications.
        </p>

        <a href="#about">Learn More About Me</a>
      </main>
      <section id="about">
  <div className="about-content">
    <h2>About Me</h2>
<img
  src={profilePhoto}
  alt="Milena Harrison"
  className="profile-photo"
/>
    <p>
  My name is Milena Harrison, and I am currently studying Software
  Engineering Technician at Centennial College. I enjoy learning how
  technology can be used to solve problems and create useful applications.
</p>

<p>
  Through my studies, I have gained experience with web development,
  Java programming, databases, Oracle SQL, and software development.
  I enjoy working on hands-on projects that allow me to continue building
  my technical skills and experience.
</p>

    <a href="/Milena-Harrison-Resume.pdf" target="_blank">
      View My Résumé
    </a>
  </div>
</section>
<section id="projects">
  <div className="projects-content">
    <h2>My Projects</h2>

    <div className="project-grid">

      <div className="project-card">
        <img
  src={salonEaseImage}
  alt="SalonEase Hair Salon Booking System"
  className="project-image"
/>
        <h3>SalonEase - Hair Salon Booking System</h3>
        <p>
          A software system designed to make salon appointment booking
          easier for customers and salon staff.
        </p>
        <p>
          <strong>My Role:</strong> Requirements analysis, system design,
          use cases, and documentation.
        </p>
        <p>
          <strong>Outcome:</strong> Created a structured system design
          including requirements, diagrams, and booking workflows.
        </p>
      </div>

      <div className="project-card">
        <img
  src={reactPortfolioImage}
  alt="React Portfolio Website"
  className="project-image"
/>
        <h3>React Portfolio Website</h3>
        <p>
          A personal portfolio website created with React to showcase
          my education, projects, skills, and development experience.
        </p>
        <p>
          <strong>My Role:</strong> Front-end developer and designer.
        </p>
        <p>
          <strong>Outcome:</strong> Built a responsive React application
          using JSX, CSS, reusable content, and navigation.
        </p>
      </div>

      <div className="project-card">
        <img
  src={oracleSqlImage}
  alt="Oracle SQL Database Project"
  className="project-image"
/>
        <h3>Oracle SQL Database Project</h3>
        <p>
          A database project demonstrating SQL queries and relational
          database concepts using Oracle SQL.
        </p>
        <p>
          <strong>My Role:</strong> Database developer.
        </p>
        <p>
          <strong>Outcome:</strong> Created and tested queries using joins,
          subqueries, functions, filtering, grouping, and aggregate functions.
        </p>
      </div>

    </div>
  </div>
</section>
<section id="education">
  <div className="education-content">
    <h2>Education</h2>

    <div className="education-card">
      <h3>Software Engineering Technician</h3>
      <p><strong>Centennial College</strong></p>
      <p>2-Year Software Engineering Diploma</p>
      <p><strong>2025 – 2026</strong></p>

      <h4>Relevant Coursework</h4>
      <p>
        Web Application Development, Java Programming, 
        Advanced Databases and Oracle SQL, Software Engineering,
        and Object-Oriented Programming.
      </p>
    </div>
    <div className="education-card">
  <h3>Police Foundations, Customs and Immigration</h3>
  <p><strong>Niagara College</strong></p>
  <p><strong>2006 – 2009</strong></p>
</div>
<div className="education-card">
  <h3>Social Service Worker</h3>
  <p><strong>Niagara College</strong></p>
  <p><strong>2003 – 2006</strong></p>
</div>
  </div>
</section>

<section id="services">
  <div className="services-content">
    <h2>Services & Skills</h2>

    <div className="services-grid">

      <div className="service-card">
        <h3>Web Development</h3>
        <p>
          Building responsive and user-friendly websites using
          HTML, CSS, JavaScript, and React.
        </p>
      </div>

      <div className="service-card">
        <h3>Database Development</h3>
        <p>
          Creating and working with databases using Oracle SQL,
          queries, joins, subqueries, and database functions.
        </p>
      </div>

      <div className="service-card">
        <h3>Software Development</h3>
        <p>
          Developing applications using Java and object-oriented
          programming concepts.
        </p>
      </div>

    </div>
  </div>
</section>
<section id="contact">
  <h2>Contact Me</h2>

  <form
  onSubmit={async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const contact = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact");
      }

      alert("Thank you! Your information has been submitted.");
      e.target.reset();
    } catch (error) {
      alert("There was a problem submitting your information.");
      console.error(error);
    }
  }}
>
    <div>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        required
      />
    </div>

    <div>
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        required
      />
    </div>

    <div>
      <label htmlFor="contactNumber">Contact Number</label>
      <input
        type="tel"
        id="contactNumber"
        name="contactNumber"
        required
      />
    </div>

    <div>
      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        required
      />
    </div>

    <button type="submit">Submit</button>
  </form>
</section>

</div>
  
  )
}

export default App