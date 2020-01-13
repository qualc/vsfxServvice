import { Service } from 'vsfx';
import { isInteger } from '../../lib/validate';
import { BaseService } from '../BaseService';
import { ArticleTypeInterface } from './articleType.d';
import { ArticleType } from '../../entity/articleType';
import { isNotFalse } from '../../lib/validate';
@Service()
export class ArticleTypeService extends BaseService implements ArticleTypeInterface {
    /**
     * 根据用户查询文章分类和分类总数
     *
     * @param {number} userId
     * @memberof ArticleTypeInterface
     */
    async findAllGroupType({ identity, type }) {
        let query = `SELECT count(a.articleTypeId) as num, at.id as id, at.name classify 
        FROM article a LEFT JOIN article_type at ON at.id=a.articleTypeId 
        LEFT JOIN users au ON au.id=a.usersId 
        WHERE a.disabled=1`;
        if (identity) {
            query += ` and au.identity='${identity}'`;
        }
        if (isNotFalse(type)) {
            query += ` and a.type=${type}`;
        }
        query += ' GROUP BY a.articleTypeId';
        return this.getRepository(ArticleType).query(query);
    }

    /**
     * 获取所有分类列表
     *
     * @param {number} disabled
     * @memberof ArticleTypeInterface
     */
    async findAll(disabled: number): Promise<Array<ArticleType>> {
        let query = 'select id, name, iconUrl from article_type where 1=1';
        if (isInteger(disabled)) {
            query += ` and disabled=${disabled}`;
        }
        return this.getRepository(ArticleType).query(query);
    }

    /**
     * 添加或保存文章
     *
     * @param {ArticleType} articleType
     * @memberof ArticleTypeInterface
     */
    async saveOrUpdateArticleType(articleType: ArticleType): Promise<string> {
        // let exe = await this.getRepository(ArticleType).save(articleType);
        // return exe ? '操作成功' : '操作失败';
        return await super.saveOrUpdateAny(ArticleType, articleType);
    }

    /**
     * 逻辑删除
     *
     * @param {(number | ArticleType)}
     * @memberof ArticleTypeInterface
     */
    async disabledArticleType(id: number) {
        // let exe = await this.getRepository(ArticleType).updateById(id, { disabled: 0 });
        // return exe ? '禁用成功' : '禁用失败';
        return await super.disabledAny(ArticleType, id);
    }
    /**
     * 恢复逻辑删除
     *
     * @param {(number | ArticleType)}
     * @memberof ArticleTypeInterface
     */
    async publishArticleType(id: number) {
        // let exe = await this.getRepository(ArticleType).updateById(id, { disabled: 1 });
        // return exe ? '发布成功' : '发布失败';
        return await super.publishAny(ArticleType, id);
    }

    /**
     * 物理删除
     *
     * @param {(number | ArticleType)} any
     * @memberof ArticleTypeInterface
     */
    async deletedArticleType(id: number) {
        // let exe = await this.getRepository(ArticleType).removeById(id);
        // return exe ? '删除成功' : '删除失败';
        return await super.deletedAny(ArticleType, id);
    }

    /**
     * 根据typeName获取相似type
     *
     * @param {string} typeName
     * @memberof ArticleTypeInterface
     */
    async findByTypeName(typeName: string) {
        // let query = this.getRepository(ArticleType).createQueryBuilder("at")
        //     .select([
        //         'at.name name',
        //     ]).where('at.name like "%:name%"', { name: typeName });
        // let typeList: Array<ArticleType> = await query.printSql().getRawMany();
        let typeList: Array<ArticleType> = await this.getRepository(ArticleType).query(`SELECT id,name, iconUrl FROM article_type  WHERE name like "%${typeName}%"`);
        return typeList;
    }

    /**
     * 根据typeName获取type
     *
     * @param {string} typeName
     * @memberof ArticleTypeInterface
     */
    async findOneByTypeName(typeName: string): Promise<any> {
        let type: ArticleType | undefined = await this.getRepository(ArticleType).findOne({ name: typeName });
        return type || {};
    }

    /**
     * 返回vscode需要格式
     */
    async findAllToVs() {
        let query = 'select id, name as label, iconUrl from article_type where disabled = 1';
        return this.getRepository(ArticleType).query(query);
    }
}
