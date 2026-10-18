import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import './CakeCutting.css'; // Global CSS

const CakeCutting = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Initialize Splitting
    Splitting();

    // REGISTER PLUGINS if available
    const hasMorph = !!gsap.plugins.morphSVG;

    const BTN = document.querySelector('.birthday-button__button');
    const SOUNDS = {
      CHEER: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/cheer.mp3'),
      MATCH: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/match-strike-trimmed.mp3'),
      TUNE: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3'),
      ON: new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
      BLOW: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/blow-out.mp3'),
      POP: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pop-trimmed.mp3'),
      HORN: new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3'),
    };

    // Preload sounds
    Object.values(SOUNDS).forEach(s => s.load());

    // --- TIMELINES & ANIMATIONS ---
    
    // Blink
    const EYES = document.querySelector('.cake__eyes');
    const BLINK = (eyes) => {
      if (!eyes) return;
      gsap.set(eyes, { scaleY: 1 });
      if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
      eyes.BLINK_TL = new gsap.timeline({
        delay: Math.floor(Math.random() * 4) + 1,
        onComplete: () => BLINK(eyes),
      });
      eyes.BLINK_TL.to(eyes, {
        duration: 0.05,
        transformOrigin: '50% 50%',
        scaleY: 0,
        yoyo: true,
        repeat: 1,
      });
    };
    BLINK(EYES);

    // Frosting
    const FROSTING_TL = () => {
      const tl = gsap.timeline();
      tl.to('#frosting', { scaleX: 1.015, duration: 0.25 }, 0)
        .to('#frosting', { scaleY: 1, duration: 1 }, 0);
      
      if (hasMorph) {
        tl.to('#frosting', { duration: 1, morphSVG: '.cake__frosting--end' }, 0);
      }
      return tl;
    };

    // Sprinkles
    const SPRINKLES_TL = () => gsap.timeline().to('.cake__sprinkle', { scale: 1, duration: 0.06, stagger: 0.02 });

    // Spin
    const SPIN_TL = () =>
      gsap.timeline()
        .set('.cake__frosting-patch', { display: 'block' })
        .to(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: 0, duration: 1 }, 0)
        .to(['.cake__frosting--start', '.cake__sprinkles--initial'], { x: 65, duration: 1 }, 0)
        .to('.cake__face', { duration: 1, x: -48.82 }, 0);

    // Flame Flicker
    const flickerSpeed = 0.1;
    const FLICKER_TL = gsap.timeline();
    if (hasMorph) {
        FLICKER_TL.to('.candle__flame-outer', { duration: flickerSpeed, repeat: -1, yoyo: true, morphSVG: '#flame-outer' })
                  .to('.candle__flame-inner', { duration: flickerSpeed, repeat: -1, yoyo: true, morphSVG: '#flame-inner' }, 0);
    } else {
        // Fallback: Simple opacity/scale flicker
         FLICKER_TL.to(['.candle__flame-outer', '.candle__flame-inner'], { duration: 0.1, scale: 1.1, opacity: 0.8, yoyo: true, repeat: -1 });
    }

    // Shake
    const SHAKE_TL = () =>
      gsap.timeline({ delay: 0.5 })
        .set('.cake__face', { display: 'none' })
        .set('.cake__face--straining', { display: 'block' })
        .to('.birthday-button', {
          onComplete: () => {
             gsap.set('.cake__face--straining', { display: 'none' });
             gsap.set('.cake__face', { display: 'block' });
          },
          x: 1,
          y: 1,
          repeat: 13,
          duration: 0.1,
        }, 0)
        .to('.cake__candle', {
          onComplete: () => { FLICKER_TL.play(); },
          onStart: () => {
            SOUNDS.POP.play().catch(() => {});
            gsap.delayedCall(0.2, () => SOUNDS.POP.play().catch(() => {}));
            gsap.delayedCall(0.4, () => SOUNDS.POP.play().catch(() => {}));
          },
          ease: 'Elastic.easeOut',
          duration: 0.2,
          stagger: 0.2,
          scaleY: 1,
        }, 0.2);

    // Flame ON
    const FLAME_TL = () =>
      gsap.timeline({})
        .to('.cake__candle', { '--flame': 1, stagger: 0.2, duration: 0.1 })
        .to(containerRef.current, { '--flame': 1, '--lightness': 5, duration: 0.2, delay: 0.2 });

    // Lights Out
    const LIGHTS_OUT = () =>
      gsap.timeline().to(containerRef.current, {
        onStart: () => SOUNDS.BLOW.play().catch(() => {}),
        delay: 0.5,
        '--lightness': 0,
        duration: 0.1,
        '--glow-saturation': 0,
        '--glow-lightness': 0,
        '--glow-alpha': 1,
        '--transparency-alpha': 1,
      })
      .to('.birthday-text', { opacity: 1, duration: 1, ease: 'power2.out' }, '+=0.5');

    // Reset
    const RESET = () => {
      gsap.set('.char', {
        '--hue': () => Math.random() * 360,
        '--char-sat': 0,
        '--char-light': 0,
        x: 0,
        y: 0,
        opacity: 1,
      });
      gsap.set(containerRef.current, {
        '--frosting-hue': Math.random() * 360,
        '--glow-saturation': 50,
        '--glow-lightness': 35,
        '--glow-alpha': 0.4,
        '--transparency-alpha': 0,
        '--flame': 0,
      });
      gsap.set('.cake__candle', { '--flame': 0 });
      gsap.to(containerRef.current, { '--lightness': 50, duration: 0.25 });
      
      gsap.set('.cake__frosting--end', { opacity: 0 });
      gsap.set('#frosting', { transformOrigin: '50% 10%', scaleX: 0, scaleY: 0 });
      gsap.set('.cake__frosting-patch', { display: 'none' });
      gsap.set(['.cake__frosting--duplicate', '.cake__sprinkles--duplicate'], { x: -65 });
      gsap.set('.cake__face', { x: -110 });
      gsap.set('.cake__face--straining', { display: 'none' });
      gsap.set('.cake__sprinkle', {
        '--sprinkle-hue': () => Math.random() * 360,
        scale: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set('.birthday-button', { scale: 0.6, x: 0, y: 0 });
      gsap.set('.birthday-button__cake', { display: 'none' });
      gsap.set('.cake__candle', { scaleY: 0, transformOrigin: '50% 100%' });
      gsap.set('.birthday-text', { opacity: 0, y: 0 });
    };

    RESET();

    const MASTER_TL = gsap.timeline({
      onStart: () => {
        SOUNDS.ON.play().catch(() => {});
      },
      onComplete: () => {
        setTimeout(() => {
            sessionStorage.setItem('introShown', 'true');
            navigate('/home'); 
        }, 6000); 
      },
      paused: true,
    })
    .set('.birthday-button__cake', { display: 'block' })
    .to('.birthday-button', {
      onStart: () => SOUNDS.CHEER.play().catch(() => {}),
      scale: window.innerWidth < 600 ? 0.8 : 1, // Responsive scale target
      duration: 0.2,
    })
    .to('.char', { '--char-sat': 70, '--char-light': 65, duration: 0.2 }, 0)
    .to('.char', {
      onStart: () => SOUNDS.HORN.play().catch(() => {}),
      delay: 0.75,
      y: () => gsap.utils.random(-100, -200),
      x: () => gsap.utils.random(-50, 50),
      duration: () => gsap.utils.random(0.5, 1),
    })
    .to('.char', { opacity: 0, duration: 0.25 }, '>-0.5')
    .add(FROSTING_TL())
    .add(SPRINKLES_TL())
    .add(SPIN_TL())
    .add(SHAKE_TL())
    .add(FLAME_TL(), 'FLAME_ON')
    .add(LIGHTS_OUT(), 'LIGHTS_OUT');

    SOUNDS.TUNE.onended = () => MASTER_TL.play(); 
    SOUNDS.MATCH.onended = () => MASTER_TL.play(); 
    
    MASTER_TL.addPause('FLAME_ON', () => {
        SOUNDS.MATCH.play().catch(() => MASTER_TL.play());
    });
    MASTER_TL.addPause('LIGHTS_OUT', () => {
        SOUNDS.TUNE.play().catch(() => MASTER_TL.play());
    });

    const handleClick = () => {
        if (!started) {
            setStarted(true);
            if (BTN) BTN.setAttribute('disabled', true);
            MASTER_TL.restart();
        }
    };

    if (BTN) {
        BTN.addEventListener('click', handleClick);
    }

    return () => {
        if (BTN) BTN.removeEventListener('click', handleClick);
        MASTER_TL.kill();
        if (EYES && EYES.BLINK_TL) EYES.BLINK_TL.kill();
        FLICKER_TL.kill();
        Object.values(SOUNDS).forEach(s => { s.pause(); s.currentTime = 0; });
    };
  }, [navigate, started]);

  return (
    <div className="cake-cutting-container" ref={containerRef}>
      <div className="birthday-button">
        <button className="birthday-button__button" aria-label="Celebrate">
          <svg className="birthday-button__cake" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 76.609 47.643">
            <defs>
              <g id="candle" transform="translate(-48.82 -137.74)">
                <rect ry=".567" y="147.888" x="72.548" height="12.001" width="4.252" fill="#ececec"></rect>
                <g className="candle__flame">
                  <path className="candle__flame-outer" d="M75.672 145.92c.608 1.207.086 2.224-.749 2.224s-1.512-.037-1.512-1.388.558-3.566 1.98-3.973c1.007-.288-.855.884.281 3.138z" fill="#f60"></path>
                  <path className="candle__flame-inner" d="M75.081 146.449c.41.51.266 1.043-.13 1.128-.394.084-.682-.228-.822-.866 0 0-.13-1.382.502-1.719.447-.238-.315.505.45 1.457z" fill="#ff0"></path>
                </g>
                <g style={{ display: 'none' }}>
                  <path id="flame-outer" d="M73.676 145.92c-.609 1.207-.086 2.224.749 2.224s1.511-.037 1.511-1.388-.557-3.566-1.98-3.973c-1.006-.288.856.884-.28 3.138z" fill="#f60"></path>
                  <path id="flame-inner" d="M74.267 146.449c-.41.51-.266 1.043.129 1.128.395.084.683-.228.823-.866 0 0 .13-1.382-.502-1.719-.447-.238.315.505-.45 1.457z" fill="#ff0"></path>
                </g>
              </g>
              <clipPath id="face-clip">
                <rect transform="translate(-48.82 -138.799)" width="63.5" height="26.458" x="55.374" y="159.984" ry="3.402"></rect>
              </clipPath>
              <clipPath id="sprinkle-clip">
                <rect width="63.5" height="26.458" x="55.374" y="159.984" ry="3.402"></rect>
              </clipPath>
              <clipPath id="frosting-clip">
                <path d="m 58.311339,159.19367 c -1.915439,0 -3.331523,2.04311 -3.986711,3.74446 -0.778328,2.02111 -0.761971,4.73695 0.529167,6.47582 0.861406,1.16012 2.614079,1.3182 4.033715,1.5875 1.321013,0.25059 2.689143,0 4.033714,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344571,0 2.689143,0 4.033714,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344572,0 2.689143,0 4.033715,0 1.344573,0 2.689143,0 4.033713,0 1.34457,0 2.68915,0 4.03372,0 1.34457,0 2.68914,0 4.03371,0 1.34457,0 2.71271,0.25059 4.03372,0 1.41963,-0.2693 3.17231,-0.42738 4.03371,-1.5875 1.29114,-1.73887 1.3075,-4.45471 0.52917,-6.47582 -0.65519,-1.70135 -2.07128,-3.74446 -3.98672,-3.74446 z" style={{ fill: '#ff0041', fillOpacity: '0.53424659', fillRule: 'nonzero', stroke: 'none', strokeWidth: '0.90433162', strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeDashoffset: 0, strokeOpacity: 1 }}></path>
              </clipPath>
              <g id="sprinkles" transform="translate(63.93)">
                <rect className="cake__sprinkle" transform="rotate(-44.064)" ry=".567" y="167.592" x="-91.837" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(127.01)" ry=".567" y="165.35" x="76.642" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(85.232)" width="3.307" height="1.228" x="182.37" y="3.842" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(136.794)" ry=".567" y="-137.013" x="122.349" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(-28.569)" width="3.307" height="1.228" x="-90.997" y="160.466" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(-134.37)" ry=".567" y="-124.272" x="-138.396" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(-37.152)" width="3.307" height="1.228" x="-101.107" y="155.28" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(-72.723)" ry=".567" y="77.322" x="-169.664" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(36.566)" width="3.307" height="1.228" x="124.338" y="135.065" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(-45)" ry=".567" y="150.009" x="-111.692" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(30)" width="3.307" height="1.228" x="119.879" y="141.701" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(-55.914)" ry=".567" y="139.024" x="-129.555" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(-30)" width="3.307" height="1.228" x="-60.133" y="178.671" ry=".567"></rect>
                <rect className="cake__sprinkle" transform="rotate(45)" ry=".567" y="95.647" x="162.293" height="1.228" width="3.307"></rect>
                <rect className="cake__sprinkle" transform="rotate(45)" ry=".567" y="133.647" x="124.293" height="1.228" width="3.307"></rect>
              </g>
              <path id="frosting" d="M58.311 159.194c-1.915 0-3.283-.087-3.986 1.098-.392.661-.073 1.766.529 2.243 1.054.834 2.689 0 4.034 0H115.36c1.344 0 2.979.834 4.033 0 .602-.477.921-1.582.53-2.243-.703-1.185-2.072-1.098-3.987-1.098z"></path>
              <path className="cake__frosting cake__frosting--end" d="M58.311 159.194c-1.915 0-3.354 2.034-3.986 3.744-.57 1.537-.953 4.189.529 4.888 1.454.687 2.425-2.645 4.034-2.645 1.608 0 2.425 2.645 4.034-2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.425-2.645 4.033-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.425-2.645 4.033-2.645 1.608 0 2.426 2.645 4.034 2.645 1.608 0 2.436-2.83 4.034-2.645 1.936.222 2.084 4.233 4.033 4.233 1.95 0 2.098-4.01 4.034-4.233 1.598-.184 2.426 2.645 4.034 2.645 1.608 0 2.426-2.645 4.034-2.645 1.608 0 2.58 3.332 4.033 2.645 1.482-.7 1.098-3.35.53-4.888-.633-1.71-2.072-3.744-3.987-3.744z"></path>
            </defs>
            <g className="cake-decoration" transform="translate(-48.82 -138.799)">
              <g className="cake__frosting-group" clipPath="url(#frosting-clip)">
                <g className="cake__frosting cake__frosting--start">
                  <use xlinkHref="#frosting"></use>
                </g>
                <g className="cake__frosting cake__frosting--duplicate">
                  <rect className="cake__frosting-patch" width="20" height="5" x="110" y="159.25"></rect>
                  <use xlinkHref="#frosting"></use>
                </g>
              </g>
              <g className="cake__sprinkles-group" clipPath="url(#sprinkle-clip)">
                <g className="cake__sprinkles cake__sprinkles--initial">
                  <use xlinkHref="#sprinkles"></use>
                </g>
                <g className="cake__sprinkles cake__sprinkles--duplicate">
                  <use xlinkHref="#sprinkles"></use>
                </g>
              </g>
            </g>
            <g clipPath="url(#face-clip)">
              <g className="cake__face" transform="translate(-48.82 -138.799)">
                <g className="cake__eyes">
                  <g className="cake__eye" transform="matrix(1.38031 0 0 1.38031 34.723 -33.58)">
                    <circle className="cake__eye-body" cx="29.86" cy="149.022" r="2.457"></circle>
                    <circle className="cake__eye-pupil" cx="28.773" cy="148.162" r=".756"></circle>
                  </g>
                  <g className="cake__eye" transform="matrix(1.38031 0 0 1.38031 57.092 -33.58)">
                    <circle className="cake__eye-body" r="2.457" cy="149.022" cx="29.86"></circle>
                    <circle className="cake__eye-pupil" r=".756" cy="148.162" cx="28.773"></circle>
                  </g>
                </g>
                <g className="cake__mouth">
                  <path className="cake__mouth-opening" d="M83.607 174.436a3.652 3.652 0 003.518 2.674 3.652 3.652 0 003.515-2.674z" strokeWidth="1.1801650499999998" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path className="cake__tongue" d="M88.836 175.492a3.113 2.329 0 00-2.869 1.425 3.652 3.652 0 001.158.192 3.652 3.652 0 002.899-1.44 3.113 2.329 0 00-1.188-.177z"></path>
                </g>
              </g>
              <g className="cake__face--straining" transform="translate(-48.82 -138.799)">
                <path d="M100.673 173.886l-5.248-2.073 5.713-1.466M73.574 173.886l5.248-2.073-5.713-1.466" fill="none" stroke="#000" strokeWidth="1.01590816" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M85.016 175.773h4.216" fill="none" stroke="#000" strokeWidth=".86683468" strokeLinecap="round"></path>
              </g>
            </g>
            <g className="cake__candles">
              <g className="cake__candle">
                <use xlinkHref="#candle"></use>
              </g>
              <g className="cake__candle">
                <use xlinkHref="#candle" transform="translate(25 0)"></use>
              </g>
              <g className="cake__candle">
                <use xlinkHref="#candle" transform="translate(12 0.5)"></use>
              </g>
            </g>
          </svg>
          <span className="birthday-button__text" data-splitting="">Click Me!</span>
        </button>
      </div>
      <div className="birthday-text">Happy Birthday HimaChan ❤️🥹</div>
      
      {!started && (
        <div style={{ position: 'absolute', top: '70%', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem', color: '#666' }}>
          Tap to celebrate!
        </div>
      )}
    </div>
  );
};

export default CakeCutting;
