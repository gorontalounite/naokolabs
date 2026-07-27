const services = [
  {
    number: "01",
    title: "Social Media Management",
    description:
      "Sistem konten yang membuat brand Anda hadir dengan ritme dan arah yang lebih jelas.",
    items: ["Strategi konten", "Kalender editorial", "Desain & caption", "Laporan ringan"],
  },
  {
    number: "02",
    title: "Brand Identity",
    description:
      "Fondasi visual dan verbal yang membuat bisnis Anda lebih mudah dikenali dan dipercaya.",
    items: ["Positioning", "Logo & visual system", "Warna & tipografi", "Brand guidelines"],
  },
  {
    number: "03",
    title: "Content & Video Editing",
    description:
      "Konten pendek yang terasa native untuk platform, tanpa kehilangan karakter brand.",
    items: ["Short-form video", "Reels & social cutdowns", "Motion sederhana", "Adaptasi lintas platform"],
  },
];

const process = [
  ["01", "Discover", "Memahami bisnis, tujuan, dan orang yang ingin Anda jangkau."],
  ["02", "Define", "Menyusun arah kreatif, scope, dan prioritas yang paling relevan."],
  ["03", "Create", "Mengembangkan identitas dan konten dengan pertimbangan yang matang."],
  ["04", "Deliver", "Merapikan, menerbitkan, dan menyiapkan langkah berikutnya."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav" aria-label="Navigasi utama">
        <a className="brand brand-logo-lockup" href="#top" aria-label="NAOKOLABS, kembali ke atas">
          <Image src="/brand/naokolabs-lockup.png" alt="NAOKOLABS" className="brand-logo" width={1965} height={481} priority />
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
        </div>
        <a className="nav-cta" href="#contact">Mulai Proyek <span>→</span></a>
      </nav>

      <section id="top" className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Brand · Content · Social</p>
          <h1>Brand yang jelas.<br />Konten yang hidup<span className="accent">.</span></h1>
          <p className="hero-lede">
            NAOKOLABS membantu bisnis lokal dan growing brands membangun identitas,
            konten, dan kehadiran sosial yang lebih matang.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="https://wa.me/62818966884?text=Halo%20NAOKOLABS%2C%20saya%20ingin%20mendiskusikan%20proyek." target="_blank" rel="noreferrer">Diskusikan proyek <span>→</span></a>
            <a className="text-link" href="#work">Lihat arah kerja <span>↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Emblem NAOKOLABS">
          <div className="art-frame art-frame-one" />
          <div className="art-frame art-frame-two" />
          <div className="art-label">尚子<br /><em>creative lab</em></div>
          <Image src="/brand/emblem.png" alt="Emblem NAOKOLABS" className="emblem" width={338} height={318} priority />
          <div className="art-note">Clarity<br />with character</div>
          <span className="art-orb" />
        </div>
      </section>

      <div className="marquee" aria-label="Keahlian NAOKOLABS">
        <div className="marquee-track">
          <span>Brand Identity</span><b>✦</b><span>Social Media</span><b>✦</b><span>Content</span><b>✦</b><span>Video Editing</span><b>✦</b>
          <span>Brand Identity</span><b>✦</b><span>Social Media</span><b>✦</b><span>Content</span><b>✦</b><span>Video Editing</span><b>✦</b>
        </div>
      </div>

      <section id="work" className="section section-shell work-section">
        <div className="section-intro">
          <p className="eyebrow"><span /> What we make</p>
          <h2>Arah kerja untuk<br />brand yang bertumbuh.</h2>
          <p>Portfolio sedang kami siapkan. Sementara ini, berikut tiga jenis hasil kerja yang dapat dibangun bersama.</p>
        </div>
        <div className="work-grid">
          <Link className="work-card brand-card" href="/work/brand-system" aria-label="Buka detail eksplorasi Brand Identity">
            <div className="card-art"><span className="card-ring" /><strong>Make<br />it<br /><i>clear.</i></strong><small>01 / Brand systems</small></div>
            <div className="work-copy"><p>Brand Identity</p><h3>Identitas yang terasa konsisten, bukan sekadar menarik.</h3><span>Positioning · Visual system · Guidelines</span></div>
          </Link>
          <Link className="work-card social-card" href="/work/social-presence" aria-label="Buka detail eksplorasi Social Media">
            <div className="card-art"><div className="social-window"><span className="window-top">NAOKO / notes</span><b>Simple ideas.<br />Strong presence.</b><i>●</i></div><small>02 / Social presence</small></div>
            <div className="work-copy"><p>Social Media</p><h3>Kehadiran sosial yang punya sistem dan suara sendiri.</h3><span>Strategy · Editorial · Design</span></div>
          </Link>
          <Link className="work-card motion-card" href="/work/moving-image" aria-label="Buka detail eksplorasi Content dan Video">
            <div className="card-art"><div className="motion-screen"><span>PLAY</span><b>Every<br />frame<br />counts.</b></div><small>03 / Moving image</small></div>
            <div className="work-copy"><p>Content & Video</p><h3>Potongan konten yang dirancang untuk terus dilihat.</h3><span>Reels · Editing · Motion</span></div>
          </Link>
        </div>
      </section>

      <section id="services" className="section section-shell services-section">
        <div className="section-intro service-heading"><p className="eyebrow"><span /> Services</p><h2>Rapi di strategi.<br />Hidup di eksekusi.</h2></div>
        <div className="service-list">
          {services.map((service, index) => <details className="service" key={service.title} open={index === 0}>
            <summary><span>{service.number}</span><h3>{service.title}</h3><i>+</i></summary>
            <div className="service-body"><p>{service.description}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </details>)}
        </div>
        <p className="service-note">Layanan dapat diambil terpisah atau dirangkai menjadi satu sistem brand dan konten.</p>
      </section>

      <section id="process" className="section section-shell process-section">
        <div className="section-intro"><p className="eyebrow"><span /> How we work</p><h2>Proses yang<br />membuat ruang.</h2><p>Untuk berpikir lebih jernih, bekerja lebih dekat, dan menghasilkan hal yang tepat untuk brand Anda.</p></div>
        <div className="process-grid">{process.map(([number, title, text]) => <article className="process-card" key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section id="about" className="section about-section">
        <div className="section-shell about-grid"><div><p className="eyebrow eyebrow-light"><span /> About NAOKOLABS</p><h2>Small studio.<br /><i>Thoughtful work.</i></h2></div><div className="about-copy"><p>NAOKOLABS adalah independent creative lab yang membantu bisnis lokal dan growing brands berkomunikasi dengan lebih jelas.</p><p>Setiap proyek ditangani langsung oleh founder—dari arah awal sampai hasil akhir. Ketika kebutuhan bertambah, tim freelance yang tepat dapat dibentuk sesuai scope.</p><a className="text-link text-link-light" href="#contact">Mulai percakapan</a></div></div>
      </section>

      <section className="section section-shell why-section"><p className="eyebrow"><span /> Why NAOKOLABS</p><div className="why-grid"><article><b>01</b><h3>Direct collaboration</h3><p>Anda bekerja langsung dengan founder, bukan berpindah-pindah account manager.</p></article><article><b>02</b><h3>Built around context</h3><p>Strategi disusun berdasarkan kondisi bisnis, bukan sekadar mengikuti template.</p></article><article><b>03</b><h3>Small and adaptable</h3><p>Struktur kecil membuat proses lebih gesit serta mudah menyesuaikan scope.</p></article></div></section>

      <section id="contact" className="contact section-shell"><div><p className="eyebrow eyebrow-light"><span /> Start a project</p><h2>Punya brand yang<br />perlu diperjelas<span className="accent">?</span></h2></div><div className="contact-copy"><p>Ceritakan bisnis, kebutuhan, atau ide yang sedang Anda bangun. Kita mulai dari percakapan sederhana.</p><div className="contact-actions"><a className="button button-light" href="https://wa.me/62818966884?text=Halo%20NAOKOLABS%2C%20saya%20ingin%20mendiskusikan%20proyek." target="_blank" rel="noreferrer">Chat via WhatsApp</a><a className="text-link text-link-light" href="mailto:naokolabs@gmail.com?subject=Project%20Inquiry%20NAOKOLABS">Kirim project brief</a></div><p className="contact-note">WhatsApp 0818 966 884 · naokolabs@gmail.com</p></div></section>

      <footer className="footer section-shell"><a className="brand brand-light" href="#top">NAOKOLABS</a><p>Brand · Content · Social<br />Indonesia</p><p>© {new Date().getFullYear()} NAOKOLABS</p></footer>
    </main>
  );
}
import Image from "next/image";
import Link from "next/link";
