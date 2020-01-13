import { Controller, Get, Post } from 'vsfx';
import { isNotInteger, isEmpty, isFalse, isNotEmpty, isInteger } from '../../../lib/validate';
import { ArticleTypeService } from '../../../service/article/articleType';
import { ArticleType } from '../../../entity/articleType';

/**
 * 文章controller
 *
 * @export
 * @class ArticleController
 */
const articleTypeService = new ArticleTypeService();
@Controller('/articletype')
export class ArticleTypeController {
    /**
     * 获取文章类型列表
     *
     * @param {any} { query }
     * @param {any} res
     * @memberof ArticleTypeController
     */
    @Get('/findAll')
    async findAllArticleType({ body }, res) {
        let { desabled = 1 } = body;
        if (isNotInteger(desabled)) {
            return res.sendError('入参类型异常');
        }
        res.sendSuccess(await articleTypeService.findAll(desabled));
    }

    @Post('/saveOrUpdate')
    // @Validation(ArticleCreateDto)
    async saveArticleTypeInfo({ body, users }, res) {
        var articleType = <ArticleType>{};
        if (isNotEmpty(body.id)) {
            if (isInteger(body.id)) {
                articleType.id = body.id;
            } else {
                return res.sendError('id入参类型异常');
            }
        }
        if (isEmpty(body.name) || body.name.length > 25) {
            return res.sendError('标题长度必须为1-25个字符');
        }
        if (isEmpty(body.iconUrl)) {
            return res.sendError('图片地址不能为空');
        }
        articleType.name = body.name;
        articleType.iconUrl = body.iconUrl;
        res.sendSuccess(await articleTypeService.saveOrUpdateArticleType(articleType));
    }

    // @Get('/pulish')
    // async pulishArticleType({ query }, res) {
    //     let { id } = query;
    //     if (isNotInteger(id)) {
    //         return res.sendError('入参类型错误');
    //     }
    //     if (isFalse(id)) {
    //         return res.sendError('id不能为空');
    //     }
    //     res.sendSuccess(await articleService.publishArticle(id));
    // }
    // @Get('/disabled')
    // async disabledArticleType({ query }, res) {
    //     let { id } = query;
    //     if (isNotInteger(id)) {
    //         return res.sendError('入参类型错误');
    //     }
    //     if (isFalse(id)) {
    //         return res.sendError('id不能为空');
    //     }
    //     res.sendSuccess(await articleService.disabledArticle(id));
    // }
    @Get('/delete')
    async deleteArticleType({ query }, res) {
        let { id } = query;
        if (isNotInteger(id)) {
            return res.sendError('入参类型错误');
        }
        if (isFalse(id)) {
            return res.sendError('id不能为空');
        }
        // if id存在文章，则不能删除
        res.sendSuccess(await articleTypeService.deletedArticleType(id));
    }
}
