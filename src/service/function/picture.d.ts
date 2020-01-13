import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { Picture } from '../../entity/picture';
export type AllParam = {
    name: Array<string> | string;
    noPage: boolean;
    vague: boolean;
    pageSize: number;
    currPage: number;
    used: string | number;
};
export interface PictureInterface {
    // 获取图片列表
    getAll(params: AllParam);
}
