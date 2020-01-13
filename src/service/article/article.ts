import { Service } from 'vsfx';
import { BaseService } from '../BaseService';
import { ArticleInterface, findAllArticleD } from './article.d';
import { Article } from '../../entity/article';
import { isNotFalse } from '../../lib/validate';

@Service()
export class ArticleService extends BaseService implements ArticleInterface {
    /**
     * 获取所有文章列表
     *
     * @param {Article} article
     * @memberof ArticleInterface
     */
    async findAllArticle({ usersId = 0, articleTypeId = 0, type = 0, identity = '', nickName = '', desabled = null, pageSize = 20, currPage = 1 }: findAllArticleD) {
        // let [articleList, [{ total }]] = await this.execute(`call getArticleList(${articleTypeId}, ${type}, ${desabled},${nickName || null},${currPage}, ${pageSize})`);
        // return { articleList, total }
        let query = this.getRepository(Article)
                .createQueryBuilder('article')
                .leftJoinAndSelect('article.users', 'users')
                .leftJoinAndSelect('article.articleType', 'articleType')
                .select([
                    'date_format(article.publishDate, "%Y-%m-%d %H:%I:%S") publishDate',
                    'article.title title',
                    // 'article.labelIds labelIds',
                    // 'date_format(a.createDate, "%Y-%m-%d %H:%I:%S") createDate',
                    'article.docreader docreader',
                    'article.id id',
                    'article.visitors visitors',
                    // 'cast(article.content as char) content',
                    'article.praise praise',
                    'article.picture picture',
                    'articleType.id articleTypeId',
                    'articleType.name articleTypeName',
                    'articleType.iconUrl iconUrl',
                    'article.disabled disabled',
                    'article.type type',
                    'users.id usersId',
                    'users.nickName nickName'
                ]),
            countQuery = this.getRepository(Article)
                .createQueryBuilder('article')
                .leftJoinAndSelect('article.users', 'users')
                .leftJoinAndSelect('article.articleType', 'articleType')
                .select('count(article.id)', 'total'),
            params = <findAllArticleD>{};
        query = query.where('1=1');
        if (type && type != 0) {
            query = query.andWhere('article.type=:type', { type });
            countQuery = countQuery.andWhere('article.type=:type', { type });
            // params.type = type;
        }
        if (isNotFalse(articleTypeId)) {
            query = query.andWhere('article.articleTypeId=:articleTypeId', {
                articleTypeId
            });
            countQuery = countQuery.andWhere('article.articleTypeId=:articleTypeId', { articleTypeId });
            // params.articleTypeId = articleTypeId;
        }
        if (identity) {
            query = query.andWhere('users.identity=:identity', { identity });
            countQuery = countQuery.andWhere('users.identity=:identity', {
                identity
            });
            // params.identity = identity;
        }
        if (usersId) {
            query = query.andWhere('users.id=:usersId', { usersId });
            countQuery = countQuery.andWhere('users.id=:usersId', { usersId });
            // params.usersId = usersId;
        }
        // .skip(currPage - 1).take(pageSize).
        let articleList: Array<Article> = await query
            .orderBy('article.publishDate', 'DESC')
            .offset((currPage - 1) * pageSize)
            .limit(pageSize)
            ./*printSql().*/ getRawMany();

        let { total } = await countQuery.getRawOne();
        return { articleList, total };
    }

    /**
     * 获取热门文章
     *
     * @author 天冰
     * @param {number} type 1、文章 2、短记
     * @param {number} [usersId]
     * @memberof ArticleInterface
     */
    async findHotArticle(type, identity) {
        let query = this.getRepository(Article)
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.users', 'users')
            .leftJoinAndSelect('article.articleType', 'articleType')
            .select([
                'date_format(article.publishDate, "%Y-%m-%d %H:%I:%S") publishDate',
                'article.title title',
                // 'article.docreader docreader',
                'article.id id',
                'article.visitors visitors'
                // 'article.visitors visitors',
                // 'article.praise praise',
                // 'article.picture picture',
                // 'articleType.id articleTypeId',
                // 'articleType.name articleTypeName',
                // 'article.disabled disabled',
                // 'article.type type',
                // 'users.id usersId',
                // 'users.nickName nickName'
            ]);
        if (type) {
            query = query.andWhere('article.type=:type', { type });
        }
        if (identity) {
            query = query.andWhere(`users.identity=:identity`, { identity });
        }
        let articleList: Array<Article> = await query
            .orderBy('article.visitors', 'DESC')
            .offset(0)
            .limit(5)
            .printSql()
            .getRawMany();
        return articleList;
    }

    /**
     * 获取文章详情
     *
     * @param {number} id
     * @memberof ArticleInterface
     */
    async getArticleInfoById(id: number): Promise<Article> {
        let article = <Article>{};
        if (!id || id == 0) return article;
        article = await this.getRepository(Article)
            .createQueryBuilder('article')
            .leftJoinAndSelect('article.users', 'users')
            .leftJoinAndSelect('article.articleType', 'articleType')
            .select(['article.id id', 'article.title title', 'article.type type', 'article.docreader docreader', 'article.picture picture', 'article.visitors visitors', 'article.praise praise', 'cast(article.content as char) content', 'date_format(article.publishDate, "%Y-%m-%d %H:%I:%S") publishDate', 'article.disabled disabled', 'articleType.id articleTypeId', 'articleType.name articleTypeName', 'users.id usersId', 'users.nickName nickName'])
            .where('article.id=:id', { id })
            .getRawOne();
        if (article && article.id) {
            this.articleVisitorsCount(article.id);
        }
        return article || {};
    }

    async articleVisitorsCount(id) {
        if (!id || id == 0) return;
        this.getRepository(Article).query('update article set visitors = visitors +1 where id =' + id);
        // this.getRepository(Article).updateById(id, {
        //     visitors: ++article.visitors
        // });
    }
    /**
     * 添加或保存文章
     *
     * @param {Article} article
     * @memberof ArticleInterface
     */
    async saveOrUpdateArticle(article: Article) {
        // let exe = await this.getRepository(Article).save(article);
        // return exe ? '操作成功' : '操作失败';
        return await super.saveOrUpdateAny(Article, article);
    }

    /**
     * 逻辑删除
     *
     * @param {(number | Article)}
     * @memberof ArticleInterface
     */
    async disabledArticle(id: number) {
        // let exe = await this.getRepository(Article).updateById(id, { disabled: 0 });
        // return exe ? '禁用成功' : '禁用失败';
        return await super.disabledAny(Article, id);
    }
    /**
     * 恢复逻辑删除
     *
     * @param {(number | Article)}
     * @memberof ArticleInterface
     */
    async publishArticle(id: number) {
        // let exe = await this.getRepository(Article).updateById(id, { disabled: 1 });
        // return exe ? '发布成功' : '发布失败';
        return await super.publishAny(Article, id);
    }

    /**
     * 物理删除
     *
     * @param {(number | Article)} any
     * @memberof ArticleInterface
     */
    async deletedArticle(id: number) {
        // let exe = await this.getRepository(Article).removeById(id);
        // return exe ? '删除成功' : '删除失败';
        return await super.deletedAny(Article, id);
    }
    async deletedArticlesByUsersId(usersId: number) {
        await this.getConnection()
            .createQueryBuilder()
            .delete()
            .from(Article)
            .where('users.id = :usersId', { usersId })
            .execute();
        return '操作成功';
    }

    async saveOrUpdateAndGetId(article: Article) {
        // let a = await this.getManager(Article).transaction(async transactionalEntityManager => {
        //     await transactionalEntityManager.save(article);
        //     return await transactionalEntityManager.query(`SELECT LAST_INSERT_ID();`);
        //     // ...
        // });

        const connection = this.getConnection();
        const queryRunner = connection.createQueryRunner();

        // establish real database connection using our new query runner
        await queryRunner.connect();
        await queryRunner.manager.find(Article);
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(Article, article);
            let lastId = 0;
            if (article.id) {
                lastId = article.id;
            } else {
                [{ lastId }] = await queryRunner.query(`select last_insert_id() as lastId;`);
            }

            // commit transaction now:
            await queryRunner.commitTransaction();
            return lastId;
        } catch (err) {
            // since we have errors lets rollback changes we made
            await queryRunner.rollbackTransaction();
        }
        return null;
    }
    /**
     * 按年月统计数量
     */
    async getStatisticalByYM(identity?) {
        let sql = `select any_value(date_format(publishDate, '%Y年%m月')) date, count(1) count from article where disabled = 1`;
        if (identity) {
            sql += ` and identity = '${identity}'`;
        }
        sql += ` group by date_format(publishDate, '%Y-%m') order by date desc;`;
        return await this.getRepository(Article).query(sql);
    }
}
