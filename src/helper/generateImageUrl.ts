import config from 'src/config';

export const getImageUrl = (imagePath: string): string => {
  return `${config.API_URL}/${imagePath}`;
};

export const getBackgroundUrl = (imagePath: string): string => {
  return `url(${config.API_URL}/${imagePath}) no-repeat`;
};
