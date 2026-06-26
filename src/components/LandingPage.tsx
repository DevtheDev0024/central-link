import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PublicSiteNav from './PublicSiteNav';
import ContactSection from './ContactSection';
import '../styles/landing.css';
import '../styles/contact.css';

type DashboardSource = {
  label: string;
  title: string;
};

type LandingPageProps<DashboardKey extends string> = {
  dashboardOptions: Array<[DashboardKey, DashboardSource]>;
};

const ribbonImages = [
  { src: '/pictures/492487826_1290803413046383_2498529566007376313_n.jpg', position: 'center center' },
  { src: '/pictures/493276258_1289159009877490_4038752308956934739_n.jpg', position: 'center center' },
  { src: '/pictures/494125330_1290133243113400_7223398631508328006_n.jpg', position: 'center center' },
  { src: '/pictures/494281368_1292717866188271_6147720348600170476_n.jpg', position: 'center center' },
  { src: '/pictures/495581005_1301008862025838_1033883361729731855_n.jpg', position: 'center center' },
  { src: '/pictures/503657528_1319865356806855_7631391879947826567_n.jpg', position: 'center center' },
  { src: '/pictures/503708463_1319871236806267_2088305264481860955_n.jpg', position: 'center center' },
  { src: '/pictures/503793010_1319866943473363_294982211459343410_n.jpg', position: 'center center' },
  { src: '/pictures/527464575_1373841848075872_7330956676515475587_n.jpg', position: 'center center' },
  { src: '/pictures/528179631_1373837934742930_7709409244503632850_n.jpg', position: 'center center' },
  { src: '/pictures/572378420_1451606873632702_2493893711414680161_n.jpg', position: 'center center' },
  { src: '/pictures/573882467_1451611673632222_5772695783812924339_n.jpg', position: 'center center' },
];

const shuffleImages = <ImageType,>(images: ImageType[]) => {
  const shuffledImages = [...images];

  for (let index = shuffledImages.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledImages[index], shuffledImages[randomIndex]] = [shuffledImages[randomIndex], shuffledImages[index]];
  }

  return shuffledImages;
};

export default function LandingPage<DashboardKey extends string>({
  dashboardOptions,
}: LandingPageProps<DashboardKey>) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const landingPageRef = useRef<HTMLDivElement>(null);
  const [randomizedRibbonImages] = useState(() => shuffleImages(ribbonImages));
  const [randomizedSlideshowImages] = useState(() => shuffleImages(ribbonImages));

  useEffect(() => {
    const page = landingPageRef.current;

    if (!page) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealElements = page.querySelectorAll<HTMLElement>('[data-landing-reveal]');
    const ribbon = page.querySelector<HTMLElement>('.landing-ribbon');
    const story = page.querySelector<HTMLElement>('.landing-story');

    if (reducedMotion) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
    }

    let animationFrame = 0;
    let scrollRange = 1;
    let ribbonTop = 0;
    let ribbonTravel = 1;
    let storyTop = 0;

    const measureLayout = () => {
      const scrollY = window.scrollY;

      scrollRange = Math.max(page.scrollHeight - window.innerHeight, 1);
      ribbonTop = (ribbon?.getBoundingClientRect().top ?? window.innerHeight * 1.5) + scrollY;
      ribbonTravel = Math.max((ribbon?.offsetHeight ?? window.innerHeight) + window.innerHeight * 0.5, 1);
      storyTop = (story?.getBoundingClientRect().top ?? window.innerHeight) + scrollY;
    };

    const updateBackgroundScale = () => {
      const scrollY = window.scrollY;
      const navProgress = reducedMotion
        ? scrollY > 80
          ? 1
          : 0
        : Math.min(Math.max(scrollY / 140, 0), 1);
      const progress = Math.min(scrollY / scrollRange, 1);
      const ribbonProgress = Math.min(Math.max((scrollY + window.innerHeight * 1.5 - ribbonTop) / ribbonTravel, 0), 1);
      const storyViewportTop = storyTop - scrollY;
      const closingProgress = Math.min(Math.max((window.innerHeight * 1.4 - storyViewportTop) / (window.innerHeight * 1.5), 0), 1);
      const heroOverlayOpacity = Math.max(1 - scrollY / (window.innerHeight * 0.85), 0);

      page.style.setProperty('--landing-nav-progress', navProgress.toFixed(3));
      page.style.setProperty('--landing-background-scale', reducedMotion ? '1.015' : (1.015 + progress * 0.16).toFixed(4));
      page.style.setProperty('--landing-hero-overlay-opacity', heroOverlayOpacity.toFixed(3));
      page.style.setProperty('--landing-ribbon-offset', `${(-ribbonProgress * 92).toFixed(2)}vw`);
      page.style.setProperty('--landing-closing-opacity', closingProgress.toFixed(3));
      animationFrame = 0;
    };

    const handleScroll = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateBackgroundScale);
      }
    };

    const handleResize = () => {
      measureLayout();
      handleScroll();
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));
    measureLayout();
    updateBackgroundScale();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      revealObserver.disconnect();

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace('#', '');
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <div ref={landingPageRef} id="top" className="landing-page">
      <div className="landing-background" aria-hidden="true" />
      <div className="landing-hero-overlay" aria-hidden="true" />
      <div className="landing-closing-overlay" aria-hidden="true" />

      <PublicSiteNav activeLabel="Home" />

      <main className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <h1
            id="landing-title"
            className="landing-title animate-fade-rise-delay"
            aria-label="Welcome to Central Link Toastmasters"
          >
            <span aria-hidden="true" className="landing-title-light">
              Welcome to
            </span>
            <em aria-hidden="true">Central Link Toastmasters</em>
          </h1>

          <p className="landing-description animate-fade-rise-delay-2">
            Discover our club, connect with our community, and explore the meetings, stories, and
            opportunities that make Central Link Toastmasters a place to practice communication and
            leadership.
          </p>

          <div className="landing-club-note animate-fade-rise-delay-2">
            <span>Central Link Toastmasters</span>
            <span>Kandy, Sri Lanka</span>
          </div>
        </section>

        <section className="landing-dashboard-panel animate-fade-rise-delay-2" aria-label="Dashboard selection">
          <div className="landing-panel-heading">
            <h2>Select Dashboard Year</h2>
            <p>Choose a programme year to view member progress, achievements, and club activity.</p>
          </div>

          <div className="landing-year-list">
            {dashboardOptions.map(([dashboardKey, source], index) => (
              <button
                key={dashboardKey}
                type="button"
                onClick={() => navigate(`/club/${dashboardKey}`)}
                className="landing-year-button"
              >
                <span className="landing-year-number">0{index + 1}</span>
                <span className="landing-year-copy">
                  <span className="landing-year-label">Programme year</span>
                  <strong>{source.label}</strong>
                  <span>{source.title}</span>
                </span>
                <span className="landing-year-arrow" aria-hidden="true">
                  <ArrowUpRight size={20} />
                </span>
              </button>
            ))}
          </div>

        </section>
      </main>

      <section id="gallery" className="landing-ribbon" aria-label="Central Link Toastmasters moments">
        <div className="landing-ribbon-sticky">
          <div className="landing-ribbon-track">
            {randomizedRibbonImages.map((image, index) => (
              <img
                key={`${image.src}-${index}`}
                src={image.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                style={{ objectPosition: image.position }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-story" aria-labelledby="landing-story-title">
        <div className="landing-story-content">
          <div className="landing-story-intro landing-reveal" data-landing-reveal>
            <h2 id="landing-story-title">Every meeting moves the story forward.</h2>
            <p>
              Central Link is a place to practise with purpose, take on new challenges, and recognise
              the progress made along the way.
            </p>
          </div>
        </div>

        <div className="landing-story-slideshow landing-reveal" data-landing-reveal aria-hidden="true">
          {randomizedSlideshowImages.map((image, index) => (
            <img
              key={`story-${image.src}-${index}`}
              src={image.src}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                objectPosition: image.position,
                animationDelay: `${index * 2}s`,
                animationDuration: `${randomizedSlideshowImages.length * 2}s`,
              }}
            />
          ))}
        </div>
      </section>

      <ContactSection />
    </div>
  );
}
