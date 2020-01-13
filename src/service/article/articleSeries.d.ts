import { ArticleSeries } from '../../entity/articleSeries';

export interface ArticleSeriesInterface {

    /**
     * 获取所有分类列表
     * 
     * @param {number} disabled 
     * @memberof ArticleSeriesInterface
     */
    findAll(disabled: number);
    /**
     * 添加或保存类型
     * 
     * @param {ArticleSeries} articleSeries 
     * @memberof ArticleSeriesInterface
     */
    saveOrUpdateArticleSeries(articleSeries: ArticleSeries);

    /**
     * 逻辑删除
     * 
     * @param {(number | ArticleSeries)} any 
     * @memberof ArticleInterface
     */
    disabledArticleSeries(any: number | ArticleSeries);
    /**
     * 恢复逻辑删除
     * 
     * @param {(number | ArticleSeries)}
     * @memberof ArticleInterface
     */
    publishArticleSeries(id: number | ArticleSeries);
    /**
     * 物理删除
     * 
     * @param {(number | ArticleSeries)} any 
     * @memberof ArticleInterface
     */
    deletedArticleSeries(any: number | ArticleSeries);

    /**
     * 根据seriesName获取相似series
     *
     * @param {string} seriesName
     * @memberof ArticleSeriesInterface
     */
    findBySeriesName(seriesName: string)

    /**
     * 根据seriesName获取seriesId
     *
     * @param {string} seriesName
     * @memberof ArticleSeriesInterface
     */
    findIdBySeriesName(seriesName: string)
}