import { deleteData, fetchData, postData } from 'src/helper/axios.instans';

export const uploadImageService = async (route: string, data: FormData) => {
  return await postData(route, data);
};
export const getImagesService = async (route: string) => {
  return await fetchData(route);
};
export const deleteImageService = async (route: string) => {
  return await deleteData(route);
};
