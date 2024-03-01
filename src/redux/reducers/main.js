import MobileDetect from 'mobile-detect';
import { APP_RESIZE } from '../constants/main';

function getIsMobile() {
  const md = new MobileDetect(window.navigator.userAgent);
  return !!md.mobile() || window.innerWidth < 550;
}

const initialState = {
  isMobile: false,
};

export default function main(state = initialState, action) {
  switch (action.type) {
    case APP_RESIZE:
      return {
        ...state,
        isMobile: getIsMobile(),
      };
    default:
      return state;
  }
}
