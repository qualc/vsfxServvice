import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { Picture } from '../../entity/picture';
import { PictureInterface, AllParam } from './picture.d';

@Service()
export class PictureService extends BaseService implements PictureInterface {
    getRepository;
    async getAll({ name = '', noPage = false, vague = false, pageSize = 20, currPage = 1, used = 'all' }: AllParam) {
        // let picture: Array<Picture> = this.getRepository(Picture).find();
        // return picture;

        let query = this.getRepository(Picture)
                .createQueryBuilder('picture')
                .select(['picture.id id', 'picture.alt alt', 'picture.name name', 'picture.imgUrl imgUrl', 'picture.used used']),
            countQuery = this.getRepository(Picture)
                .createQueryBuilder('picture')
                .select('count(picture.id)', 'total');
        query = query.where('1=1');
        if (name) {
            if (vague) {
                let conditions = ['('],
                    names = <Array<string>>name;
                names.forEach((item, index, array) => {
                    conditions.push('picture.name like "%:' + item + '%" ');
                    if (index < array.length - 1) {
                        conditions.push(' or ');
                    }
                });

                conditions.push(')');
                query = query.andWhere(conditions.join(''));
                countQuery = countQuery.andWhere(conditions.join(''));
            } else {
                query = query.andWhere('picture.name=:name', { name });
                countQuery = countQuery.andWhere('picture.name=:name', { name });
            }
        }
        if (used != 'all') {
            // 1常用  0非常用  all全部
            query = query.andWhere('picture.used=:used', { used });
            countQuery = countQuery.andWhere('picture.used=:used', { used });
        }
        // .orderBy('picture.used', 'DESC').addOrderBy('picture.id', 'DESC')
        query = query.orderBy({ 'picture.used': 'DESC', 'picture.id': 'DESC' });
        if (!noPage) {
            query = query.offset((currPage - 1) * pageSize).limit(pageSize);
        }
        let pictureList: Array<Picture> = await query./*printSql().*/ getRawMany();
        let { total } = await countQuery.getRawOne();
        return { pictureList, total };
    }
}
