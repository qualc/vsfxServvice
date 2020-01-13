import { ArticleType } from '../../entity/articleType';
type findAllGroupTypeParam = {
    identity?: string
    type?: number
}

export interface ArticleTypeInterface {
    /**
     * 根据用户查询文章分类和分类总数
     * 
     * @param {number} identity 
     * @memberof ArticleTypeInterface
     */
    findAllGroupType(obj: findAllGroupTypeParam);
    /**
     * 获取所有分类列表
     * 
     * @param {number} disabled 
     * @memberof ArticleTypeInterface
     */
    findAll(disabled: number);
    /**
     * 添加或保存类型
     * 
     * @param {ArticleType} articleType 
     * @memberof ArticleTypeInterface
     */
    saveOrUpdateArticleType(articleType: ArticleType);

    /**
     * 逻辑删除
     * 
     * @param {(number | ArticleType)} any 
     * @memberof ArticleInterface
     */
    disabledArticleType(any: number | ArticleType);
    /**
     * 恢复逻辑删除
     * 
     * @param {(number | ArticleType)}
     * @memberof ArticleInterface
     */
    publishArticleType(id: number | ArticleType);
    /**
     * 物理删除
     * 
     * @param {(number | ArticleType)} any 
     * @memberof ArticleInterface
     */
    deletedArticleType(any: number | ArticleType);

    /**
     * 根据typeName获取相似type
     *
     * @param {string} typeName
     * @memberof ArticleTypeInterface
     */
    findByTypeName(typeName: string)

    /**
     * 根据typeName获取type
     *
     * @param {string} typeName
     * @memberof ArticleTypeInterface
     */
    findOneByTypeName(typeName: string)
}