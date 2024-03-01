import unifyHandler from './unifyHandler';
import { ADMIN_API } from './API_Base';

export const getCarousel = () => unifyHandler(ADMIN_API.get('carousel'));

export const getCarouselSetting = () => unifyHandler(ADMIN_API.get('carousel-setting'));

export const getHeroCarouselSetting = () =>
  unifyHandler(ADMIN_API.get('hero-carousel-setting'));
