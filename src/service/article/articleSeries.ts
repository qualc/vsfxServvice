import { Service } from 'vsfx';
import { isInteger } from '../../lib/validate';
import { BaseService } from '../BaseService';
import { ArticleSeriesInterface } from './articleSeries.d';
import { ArticleSeries } from '../../entity/articleSeries';
@Service()
export class ArticleSeriesService extends BaseService implements ArticleSeriesInterface {
    /**
     * 根据用户查询文章分类和分类总数
     *
     * @param {number} userId
     * @memberof ArticleSeriesInterface
     */
    async findAllGroupSeries(identity?: string) {
        let query = `SELECT count(a.articleSeriesId) as num, at.id as id, at.name classify 
        FROM article a LEFT JOIN article_series at ON at.id=a.articleSeriesId 
        LEFT JOIN users au ON au.id=a.usersId 
        WHERE a.disabled=1`;
        if (identity) {
            query += ` and au.identity='${identity}'`;
        }
        query += ' GROUP BY a.articleSeriesId';
        return this.getRepository(ArticleSeries).query(query);
    }

    /**
     * 获取所有分类列表
     *
     * @param {number} disabled
     * @memberof ArticleSeriesInterface
     */
    async findAll(disabled: number): Promise<Array<ArticleSeries>> {
        let query = 'select id, name from article_series where 1=1';
        if (isInteger(disabled)) {
            query += ` and disabled=${disabled}`;
        }
        return this.getRepository(ArticleSeries).query(query);
    }

    /**
     * 添加或保存文章
     *
     * @param {ArticleSeries} articleSeries
     * @memberof ArticleSeriesInterface
     */
    async saveOrUpdateArticleSeries(articleSeries: ArticleSeries): Promise<string> {
        // let exe = await this.getRepository(ArticleSeries).save(articleSeries);
        // return exe ? '操作成功' : '操作失败';
        return await super.saveOrUpdateAny(ArticleSeries, articleSeries);
    }

    /**
     * 逻辑删除
     *
     * @param {(number | ArticleSeries)}
     * @memberof ArticleSeriesInterface
     */
    async disabledArticleSeries(id: number) {
        // let exe = await this.getRepository(ArticleSeries).updateById(id, { disabled: 0 });
        // return exe ? '禁用成功' : '禁用失败';
        return await super.disabledAny(ArticleSeries, id);
    }
    /**
     * 恢复逻辑删除
     *
     * @param {(number | ArticleSeries)}
     * @memberof ArticleSeriesInterface
     */
    async publishArticleSeries(id: number) {
        // let exe = await this.getRepository(ArticleSeries).updateById(id, { disabled: 1 });
        // return exe ? '发布成功' : '发布失败';
        return await super.publishAny(ArticleSeries, id);
    }

    /**
     * 物理删除
     *
     * @param {(number | ArticleSeries)} any
     * @memberof ArticleSeriesInterface
     */
    async deletedArticleSeries(id: number) {
        // let exe = await this.getRepository(ArticleSeries).removeById(id);
        // return exe ? '删除成功' : '删除失败';
        return await super.deletedAny(ArticleSeries, id);
    }

    /**
     * 根据seriesName获取相似series
     *
     * @param {string} seriesName
     * @memberof ArticleSeriesInterface
     */
    async findBySeriesName(seriesName: string) {
        let seriesList: Array<ArticleSeries> = await this.getRepository(ArticleSeries).query(`SELECT name FROM article_series  WHERE name like "%${seriesName}%"`);
        return seriesList;
    }

    /**
     * 根据seriesName获取seriesId
     *
     * @param {string} seriesName
     * @memberof ArticleSeriesInterface
     */
    async findIdBySeriesName(seriesName: string) {
        let series: ArticleSeries | undefined = await this.getRepository(ArticleSeries).findOne({ name: seriesName });
        return series ? series.id : 0;
    }
}
