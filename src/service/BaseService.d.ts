
export interface BaseServiceInterface {
    getRepository;
    /**
     * 添加或保存文章
     * 
     * @param {Article} article 
     * @memberof ArticleInterface
     */
    saveOrUpdateAny(Model: any, article: any);
    /**
     * 逻辑删除
     * 
     * @param {(number | Article)}
     * @memberof ArticleInterface
     */
    disabledAny(Model: any, id: number);
    /**
     * 恢复逻辑删除
     * 
     * @param {(number | Article)}
     * @memberof ArticleInterface
     */
    publishAny(Model: any, id: number);

    /**
     * 物理删除
     * 
     * @param {(number | Article)} any 
     * @memberof ArticleInterface
     */
    deletedAny(Model: any, id: number)

}