/**
 * Background styles configuration for all themes
 * Pre-defined styles for faster theme application
 */

import { ThemeName } from '../../types/theme';

export const backgroundStyles: Record<ThemeName, string> = {
  professional: `
    background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 25%, #f8fafc  50%, #f1f5f9 75%, #e2e8f0 100%) !important;
    background-image: 
      linear-gradient(138deg, rgba(59, 130, 246, 0.35) 0%, rgba(147, 197, 253, 0.28) 22%, transparent 48%, rgba(219, 234, 254, 0.22) 73%, rgba(239, 246, 255, 0.15) 100%),
      radial-gradient(ellipse at 28% 18%, rgba(226, 232, 240, 0.25) 0%, transparent 52%),
      radial-gradient(ellipse at 78% 82%, rgba(203, 213, 225, 0.20) 0%, transparent 47%) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  bamboo: `
    background: linear-gradient(45deg, #2d5016 0%,rgb(146, 183, 113) 25%,rgb(113, 155, 81) 63%,rgb(183, 203, 165) 85%, #7ba05f 100%) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  'apple-dark': `
    background: #0a0a0a !important;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(23, 23, 23, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(38, 38, 38, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(15, 15, 15, 0.03) 0%, transparent 50%) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  kyoto: `
    background-image: 
      /* Added subtle green and orange blurs for organic breakup */
      radial-gradient(ellipse 1800px 900px at 15% 20%, rgba(13, 142, 48, 0.39) 0%, transparent 35%),
      radial-gradient(ellipse 900px 600px at 85% 80%, rgba(197, 90, 17, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse 1200px 900px at 15% 25%, rgba(122, 61, 26, 0.6) 0%, rgba(155, 74, 31, 0.4) 25%, transparent 60%),
      radial-gradient(ellipse 12300px 1800px at 78% 69%, rgba(20, 54, 20, 0.76) 0%, rgba(80, 63, 30, 0.2) 27%, transparent 90%),
      /* Organic transition helper - subtle horizontal band to break up the diagonal */
      radial-gradient(ellipse 1200px 600px at 48% 63%, rgba(197, 90, 17, 0.2) 30%, rgba(217, 119, 6, 0.15) 20%, transparent 70%),
      radial-gradient(ellipse 900px 600px at 60% 10%, rgba(197, 90, 17, 0.4) 0%, rgba(217, 119, 6, 0.25) 40%, transparent 80%),
      radial-gradient(ellipse 900px 1200px at 5% 85%, rgba(122, 61, 26, 0.3) 0%, rgba(155, 74, 31, 0.15) 50%, transparent 85%),
      radial-gradient(ellipse 500px 700px at 95% 45%, rgba(19, 78, 74, 0.4) 0%, rgba(58, 118, 15, 0.2) 45%, transparent 90%),
      /* Modified gradient with left-shifted emphasis */
      linear-gradient(160deg, 
        #7A3D1A 0%,     /* Rich burnt sienna */
        #9B4A1F 5%,     /* Deep rust */
        #C55A11 10%,    /* Burnt orange */
        #D97706 15%,    /* Amber 700 */
rgb(220, 8, 8) 18%,    /* Amber 700 darker */
rgb(173, 76, 16) 27%,    /* Amber 800 */
        #6B4423 35%,    /* Mixed brown */
        #4A5D23 45%,    /* Olive brown - organic break */
        #3A4D1F 55%,    /* Deeper olive */
        #2A3D1A 60%,    /* Forest transition */
        #1E3A1E 65%,    /* Deep forest */
rgb(87, 69, 12) 70%,    /* Teal 800 */
rgb(7, 59, 27) 80%,    /* Teal 700 */
        #C55A11 95%,    /* Burnt orange */
rgb(186, 101, 3) 100%    /* Amber 700 */
      ),
      radial-gradient(circle at 40% 60%, rgba(30, 85, 80, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 60% 40%, rgba(140, 70, 50, 0.1) 0%, transparent 50%) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  'new-york': `
    background: #0a0a0a !important;
    background-image: 
      linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #451a03 100%),
      radial-gradient(circle at 50% 100%, rgba(251, 140, 0, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 25% 80%, rgba(255, 152, 0, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 75% 90%, rgba(239, 108, 0, 0.03) 0%, transparent 35%),
      repeating-linear-gradient(90deg, transparent 0%, rgba(16, 16, 16, 0.6) 2%, transparent 4%) !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 2px !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  autumn: `
    background-image: url('/images/autumn-background.jpg') !important;
    background-repeat: no-repeat !important;
    background-attachment: fixed !important;
    background-size: cover !important;
    background-position: center !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  'classic-light': `
    background: #f1f5f9 !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `,
  'classic-dark': `
    background: #171717 !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
  `
};
