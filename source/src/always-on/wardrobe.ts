import {products} from './data';
export const wardrobe=['Outerwear','Tops','Bottoms','Shoes','Accessories'].map(c=>products.find(p=>p.category===c)!).filter(Boolean);
