export function Runner() {
  return <span className="journey-runner" aria-hidden="true"><svg viewBox="0 0 36 44"><g className="runner-stride"><path data-limb="back-leg" /><path data-limb="back-arm" /><path data-limb="torso" /><circle data-limb="head" r="4.6" /><path data-limb="front-leg" /><path data-limb="front-arm" /></g><g className="runner-jump"><circle cx="20" cy="5.6" r="4.6" /><path d="M19.2 11.6 17.6 24.4M18.8 14.6l6.4-3.4 2-6.2M18.8 14.6l-6.4-3-1.6-6.4M17.6 24.4l7 2.4 1.6 7.6M17.6 24.4l-6.6 3.8 2.2 7.2" /></g></svg></span>;
}

export function Parachute() {
  return <span className="contact-parachute" aria-hidden="true"><svg viewBox="0 0 60 100"><g><path d="M2 22C2 6 15 0 30 0s28 6 28 22Q51 17 44 22 37 17 30 22 23 17 16 22 9 17 2 22Z" fill="var(--line)" /><path d="M30 0Q20 9 16 22M30 0Q40 9 44 22" stroke="var(--bg)" strokeWidth="1.2" fill="none" opacity=".5" /><path d="M3 22 29 61M30 22 29.5 61M30 22 30.5 61M57 22 31 61" stroke="currentColor" strokeWidth="1" fill="none" /></g><g transform="translate(12 44)"><circle cx="18" cy="9" r="4.6" fill="currentColor" /><path d="M18 15 18 28M18 17 12 24 15 30M18 17 24 24 21 30M18 28 11 33 6 37M18 28 25 33 30 37" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g></svg></span>;
}
