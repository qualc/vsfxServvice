import { Article } from '../../entity/article';

export interface findAllArticleD {
    usersId?: number;
    articleTypeId?: number;
    type?: number;
    identity?: string;
    nickName?: string;
    desabled?: null;
    pageSize?: number;
    currPage?: number;
}

export interface findStatisticalByYmD {
    articleTypeId?: number;
    identity?: string;
    type?: number;
}
export interface ArticleInterface {
    /**
     * 获取所有文章列表
     *
     * @param {Article} article
     * @memberof ArticleInterface
     */
    findAllArticle(article: findAllArticleD);

    /**
     * 获取热门文章
     *
     * @author 天冰
     * @param {number} type 1、文章 2、短记
     * @param {number} [usersId]
     * @memberof ArticleInterface
     */
    findHotArticle(type: number, identity?: string);
    /**
     * 获取文章详情
     *
     * @param {number} id
     * @memberof ArticleInterface
     */
    getArticleInfoById(any: number | Article);

    /**
     * 添加或保存文章
     *
     * @param {Article} article
     * @memberof ArticleInterface
     */
    saveOrUpdateArticle(article: Article);

    /**
     * 逻辑删除
     *
     * @param {(number | Article)} any
     * @memberof ArticleInterface
     */
    disabledArticle(any: number | Article);
    /**
     * 恢复逻辑删除
     *
     * @param {(number | Article)}
     * @memberof ArticleInterface
     */
    publishArticle(id: number | Article);
    /**
     * 物理删除
     *
     * @param {(number | Article)} any
     * @memberof ArticleInterface
     */
    deletedArticle(any: number | Article);
    /**
     * 根据用户id删除
     *
     * @param {number} usersId
     * @memberof ArticleInterface
     */
    deletedArticlesByUsersId(usersId: number);
    /**
     * 按年月统计数量
     * @param identity
     */
    findStatisticalByYM(params: findStatisticalByYmD);
}
